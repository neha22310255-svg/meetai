export const getStreamVideoConfig = () => {
  const apiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_STREAM_VIDEO_API_KEY environment variable. " +
        "Please add it to your .env file.",
    );
  }

  return {
    apiKey,
  };
};
