import Link from "next/link";
import Image from "next/image";
import { CallControls, SpeakerLayout } from "@stream-io/video-react-sdk";

interface Props {
  onLeave: () => void;
  meetingName: string;
}

export const CallActive = ({ onLeave, meetingName }: Props) => {
  return (
    <div className="flex flex-col justify-between h-screen p-4 text-white bg-[#0E0F10]">
      <div className="bg-[#101213] rounded-full p-4 flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center justify-center p-1 bg-white/10 rounded-full w-fit"
        >
          <Image src="/logo.svg" width={22} height={22} alt="Logo" />
        </Link>

        <h4 className="text-base font-medium">{meetingName}</h4>
      </div>

      <SpeakerLayout />

      <div className="bg-[#101213] rounded-full px-4 py-2">
        <CallControls onLeave={onLeave} />
      </div>
    </div>
  );
};
