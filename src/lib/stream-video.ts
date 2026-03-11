// import "server-only";

// import { StreamClient } from "@stream-io/node-sdk";

// export const streamVideo = new StreamClient(
//   process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
//   process.env.STREAM_VIDEO_SECRET_KEY!,
// );
/**
 * Client-side Stream Video configuration
 * This file can be imported in client components
 */
import "server-only";

import { StreamClient } from "@stream-io/node-sdk";

if (!process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY) {
  throw new Error(
    "Missing NEXT_PUBLIC_STREAM_VIDEO_API_KEY environment variable",
  );
}

if (!process.env.STREAM_VIDEO_SECRET_KEY) {
  throw new Error("Missing STREAM_VIDEO_SECRET_KEY environment variable");
}

export const streamVideo = new StreamClient(
  process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY,
  process.env.STREAM_VIDEO_SECRET_KEY,
);
