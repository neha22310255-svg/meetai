import { and, eq, not } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { CallSessionStartedEvent } from "@stream-io/node-sdk";

import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { streamVideo } from "@/lib/stream-video";

// Store active connections to prevent duplicates
const activeConnections = new Map<string, boolean>();

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-signature");
  const apiKey = req.headers.get("x-api-key");

  if (!signature || !apiKey) {
    return NextResponse.json({ error: "Missing headers" }, { status: 400 });
  }

  const body = await req.text();

  // Verify webhook signature
  const isValid = streamVideo.verifyWebhook(body, signature);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(body);
  const eventType = payload.type;

  // Only process call.session_started
  if (eventType !== "call.session_started") {
    return NextResponse.json({ status: "ignored" });
  }

  const event = payload as CallSessionStartedEvent;
  const meetingId = event.call.custom?.meetingId;

  if (!meetingId) {
    return NextResponse.json({ error: "No meetingId" }, { status: 400 });
  }

  // Prevent duplicate processing
  if (activeConnections.has(meetingId)) {
    console.log(`Already processing meeting ${meetingId}`);
    return NextResponse.json({ status: "already_processing" });
  }

  activeConnections.set(meetingId, true);

  try {
    // Update meeting status
    const [updatedMeeting] = await db
      .update(meetings)
      .set({ status: "active", startedAt: new Date() })
      .where(eq(meetings.id, meetingId))
      .returning();

    if (!updatedMeeting) {
      activeConnections.delete(meetingId);
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    // Get agent details
    const [agent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, updatedMeeting.agentId));

    if (!agent) {
      activeConnections.delete(meetingId);
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Connect OpenAI agent
    const call = streamVideo.video.call("default", meetingId);

    const realtimeClient = await streamVideo.video.connectOpenAi({
      call,
      openAiApiKey: process.env.OPENAI_API_KEY!,
      agentUserId: agent.id,
    });

    await realtimeClient.updateSession({
      instructions: agent.instructions,
    });

    // Clear after 5 minutes
    setTimeout(
      () => {
        activeConnections.delete(meetingId);
      },
      5 * 60 * 1000,
    );

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Error:", error);
    activeConnections.delete(meetingId);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
