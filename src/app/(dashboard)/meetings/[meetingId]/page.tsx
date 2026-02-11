export default function MeetingPage({
  params,
}: {
  params: { meetingId: string };
}) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Meeting Page</h1>
      <p className="mt-2">Meeting ID: {params.meetingId}</p>
    </div>
  );
}
