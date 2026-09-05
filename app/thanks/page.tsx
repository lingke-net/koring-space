import { Suspense } from "react";
import { ThanksView } from "./thanks-view";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "感谢下载 · Koring Launcher",
};

export default function ThanksPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">正在准备下载...</p>
        </div>
      }
    >
      <ThanksView />
    </Suspense>
  );
}
