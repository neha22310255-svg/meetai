import { Loader2Icon } from "lucide-react";

interface Props {
  title: string;
  description: string;
}

export const LoadingState = ({ title, description }: Props) => {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-y-4">
        <Loader2Icon className="w-5 h-5 animate-spin text-primary" />
        <div className="text-center">
          <h6 className="text-sm font-medium">{title}</h6>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
};
