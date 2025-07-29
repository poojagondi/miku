import Image from "next/image";
import { cn } from "@/lib/utils";

interface MikuLoaderProps {
  size?: number;
  className?: string;
  text?: string;
}

export function MikuLoader({
  size = 48,
  className,
  text = "Loading...",
}: MikuLoaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className
      )}
    >
      <div className="relative">
        <Image
          src="/hatsune_miku_head.png"
          alt="Loading..."
          width={size}
          height={size}
          className="animate-spin"
          priority
        />
      </div>
      {text && (
        <span className="text-sm text-muted-foreground animate-pulse">
          {text}
        </span>
      )}
    </div>
  );
}
