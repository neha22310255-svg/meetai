"use client";

import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Call,
  CallingState,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";
import { toast } from "sonner";

import { api } from "@/trpc/client";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import { CallUI } from "./call-ui";

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
  // Define the mutation hook here
  const generateToken = api.meetings.generateToken.useMutation();

  const [client, setClient] = useState<StreamVideoClient>();
  const [call, setCall] = useState<Call>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let _client: StreamVideoClient | undefined;
    let _call: Call | undefined;
    let isMounted = true;

    const setupCall = async () => {
      try {
        setIsLoading(true);
        console.log("🔵 [CALL SETUP] Starting...");
        console.log("🔵 [CALL SETUP] Meeting ID:", meetingId);
        console.log("🔵 [CALL SETUP] User ID:", userId);

        // Check for API key
        const apiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY;
        console.log("🔵 [CALL SETUP] API Key present:", !!apiKey);

        if (!apiKey) {
          throw new Error(
            "Missing NEXT_PUBLIC_STREAM_VIDEO_API_KEY. Check your .env file.",
          );
        }

        console.log("🔵 [CALL SETUP] Requesting token from server...");
        const token = await generateToken.mutateAsync();
        console.log(
          "✅ [CALL SETUP] Token received:",
          token?.substring(0, 20) + "...",
        );

        if (!isMounted) {
          console.log("⚠️ [CALL SETUP] Component unmounted, aborting");
          return;
        }

        // Create Stream Video client
        console.log("🔵 [CALL SETUP] Creating StreamVideoClient...");
        _client = new StreamVideoClient({
          apiKey,
          user: {
            id: userId,
            name: userName,
            image: userImage,
          },
          tokenProvider: () => Promise.resolve(token),
        });

        console.log("✅ [CALL SETUP] StreamVideoClient created");

        if (!isMounted) {
          console.log(
            "⚠️ [CALL SETUP] Component unmounted after client creation",
          );
          return;
        }

        // Initialize the call
        console.log("🔵 [CALL SETUP] Getting call instance...");
        _call = _client.call("default", meetingId);
        console.log("✅ [CALL SETUP] Call instance created");

        // Try to get existing call or it will be created on join
        try {
          console.log("🔵 [CALL SETUP] Fetching call details...");
          await _call.get();
          console.log("✅ [CALL SETUP] Call exists on server");
        } catch (err) {
          console.log(
            "⚠️ [CALL SETUP] Call not found, will be created on join",
          );
        }

        // Disable camera and mic for lobby
        console.log("🔵 [CALL SETUP] Disabling camera and microphone...");
        await Promise.all([_call.camera.disable(), _call.microphone.disable()]);
        console.log("✅ [CALL SETUP] Camera and mic disabled");

        if (!isMounted) {
          console.log("⚠️ [CALL SETUP] Component unmounted during final setup");
          return;
        }

        console.log("✅ [CALL SETUP] Setup complete!");
        setClient(_client);
        setCall(_call);
        setIsLoading(false);
      } catch (err) {
        console.error("❌ [CALL SETUP] Failed:", err);

        if (!isMounted) {
          console.log(
            "⚠️ [CALL SETUP] Component unmounted, skipping error handling",
          );
          return;
        }

        let errorMessage = "Failed to connect to meeting";

        if (err instanceof Error) {
          errorMessage = err.message;
          console.error("❌ [CALL SETUP] Error details:", {
            name: err.name,
            message: err.message,
            stack: err.stack,
          });
        }

        setError(errorMessage);
        toast.error(errorMessage);
        setIsLoading(false);
      }
    };

    setupCall();

    // Cleanup function
    return () => {
      console.log("🔴 [CLEANUP] Starting cleanup...");
      isMounted = false;

      const cleanup = async () => {
        try {
          if (_call) {
            const state = _call.state.callingState;
            console.log("🔴 [CLEANUP] Call state:", state);

            if (state !== CallingState.LEFT) {
              console.log("🔴 [CLEANUP] Leaving call...");
              await _call.leave().catch((err) => {
                console.error("⚠️ [CLEANUP] Error leaving call:", err);
              });
            }
          }

          if (_client) {
            console.log("🔴 [CLEANUP] Disconnecting client...");
            await _client.disconnectUser().catch((err) => {
              console.error("⚠️ [CLEANUP] Error disconnecting:", err);
            });
            console.log("✅ [CLEANUP] Client disconnected");
          }
        } catch (err) {
          console.error("❌ [CLEANUP] Cleanup error:", err);
        }
      };

      cleanup();
    };
  }, [userId, userName, userImage, meetingId]);

  // Loading state
  if (isLoading || !client || !call) {
    return (
      <div className="flex h-screen items-center justify-center bg-linear-to-b from-gray-900 to-black">
        <div className="flex flex-col items-center gap-4">
          <LoaderIcon className="size-10 animate-spin text-blue-500" />
          <p className="text-white text-lg font-medium">
            Connecting to meeting...
          </p>
          <p className="text-gray-400 text-sm">Setting up your video call</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-linear-to-b from-gray-900 to-black">
        <div className="flex flex-col items-center gap-6 max-w-md text-center px-4">
          <div className="p-4 rounded-full bg-red-500/10">
            <svg
              className="w-12 h-12 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <p className="text-red-400 text-xl font-semibold mb-2">
              Connection Failed
            </p>
            <p className="text-gray-300 text-sm mb-1">{error}</p>
            <p className="text-gray-500 text-xs">
              Check the browser console (F12) for more details
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => (window.location.href = "/meetings")}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Back to Meetings
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
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
