"use client";

import { useEffect, useState } from "react";
import { LoaderIcon } from "lucide-react";
import {
  Call,
  CallingState,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  TokenProvider,
} from "@stream-io/video-react-sdk";

import { api } from "@/trpc/client";
import { CallUI } from "./call-ui";

import "@stream-io/video-react-sdk/dist/css/styles.css";

interface Props {
  meetingId: string;
  meetingName: string;
  userId: string;
  userName: string;
  userImage: string;
}

export const CallConnect = ({
  meetingId,
  meetingName,
  userId,
  userName,
  userImage,
}: Props) => {
  const generateToken = api.meetings.generateToken.useMutation();

  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);

  useEffect(() => {
    const tokenProvider: TokenProvider = async () => {
      const token = await generateToken.mutateAsync();
      return token;
    };

    const videoClient = new StreamVideoClient({
      apiKey: process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
      user: {
        id: userId,
        name: userName,
        image: userImage,
      },
      tokenProvider,
    });

    setClient(videoClient);

    return () => {
      videoClient.disconnectUser();
      setClient(null);
    };
  }, [userId, userName, userImage]);

  useEffect(() => {
    if (!client) return;

    const newCall = client.call("default", meetingId);

    const setup = async () => {
      await newCall.getOrCreate();
      await newCall.camera.disable();
      await newCall.microphone.disable();
      setCall(newCall);
    };

    setup();

    return () => {
      if (newCall && newCall.state.callingState !== CallingState.LEFT) {
        newCall.leave();
      }
    };
  }, [client, meetingId]);

  if (!client || !call) {
    return (
      <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
        <LoaderIcon className="size-6 animate-spin text-white" />
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CallUI meetingName={meetingName} />
      </StreamCall>
    </StreamVideo>
  );
};
