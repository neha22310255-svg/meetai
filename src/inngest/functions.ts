import { eq, inArray } from "drizzle-orm";
import JSONL from "jsonl-parse-stringify";
import { createAgent, openai, TextMessage } from "@inngest/agent-kit";

import { db } from "@/db";
import { agents, meetings, user } from "@/db/schema";
import { inngest } from "@/inngest/client";

/* ---- Type Fix (Added Locally) ---- */
export interface StreamTranscriptItem {
  speaker_id: string;
  text: string;
  start: number;
  end: number;
}

const summarizer = createAgent({
  name: "summarizer",
  system: `
You are an expert summarizer. You write readable, concise, simple content. You are given a transcript of a meeting and you need to summarize it.

Use the following markdown structure for every output:

### Overview
Provide a detailed, engaging summary of the session's content. Focus on major features, user workflows, and any key takeaways. Write in a narrative style, using full sentences. Highlight unique or powerful aspects of the product, platform, or discussion.

### Notes
Break down key content into thematic sections with timestamp ranges. Each section should summarize key points, actions, or demos in bullet format.

Example:

#### Section Name
- Main point or demo shown here
- Another key insight or interaction
- Follow-up tool or explanation provided

#### Next Section
- Feature X automatically does Y
- Mention of integration with Z
`.trim(),
  model: openai({
    model: "gpt-4o",
    apiKey: process.env.OPENAI_API_KEY,
  }),
});

interface MeetingsProcessingEvent {
  data: {
    meetingId: string;
    transcriptUrl: string;
  };
}

interface TranscriptItemWithUser extends StreamTranscriptItem {
  user?: {
    name: string;
  };
}

export const meetingsProcessing = inngest.createFunction(
  { id: "meetings/processing" },
  { event: "meetings/processing" },
  async ({ event, step }: { event: MeetingsProcessingEvent; step: any }) => {
    const response = await step.fetch(event.data.transcriptUrl);

    const transcript = await step.run("parse-transcript", async () => {
      const text = await response.text();
      return JSONL.parse<StreamTranscriptItem>(text);
    });

    const transcriptWithSpeakers = await step.run("add-speakers", async () => {
      const speakerIdsSet = new Set(
        transcript.map((item: StreamTranscriptItem) => item.speaker_id),
      );

      const speakerIds = Array.from(speakerIdsSet) as string[];

      const userSpeakers = await db
        .select({
          id: user.id,
          name: user.name,
        })
        .from(user)
        .where(inArray(user.id, speakerIds));

      const agentSpeakers = await db
        .select({
          id: agents.id,
          name: agents.name,
        })
        .from(agents)
        .where(inArray(agents.id, speakerIds));

      const speakers = [...userSpeakers, ...agentSpeakers];

      return transcript.map((item: StreamTranscriptItem) => {
        const speaker = speakers.find(
          (speaker) => speaker.id === item.speaker_id,
        );

        if (!speaker) {
          return {
            ...item,
            user: {
              name: "Unknown",
            },
          };
        }

        return {
          ...item,
          user: {
            name: speaker.name,
          },
        };
      });
    });

    const { output } = await summarizer.run(
      "Summarize the following transcript: " +
        JSON.stringify(transcriptWithSpeakers),
    );

    await step.run("save-summary", async () => {
      await db
        .update(meetings)
        .set({
          summary: (output[0] as TextMessage).content as string,
          status: "completed",
        })
        .where(eq(meetings.id, event.data.meetingId));
    });
  },
);
