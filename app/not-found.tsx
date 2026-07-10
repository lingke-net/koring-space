import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FlickeringGrid } from "@/components/ui/flickering-grid";

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[60vh] gap-6" style={{ height: "85vh" }}>
      <FlickeringGrid
        className="absolute inset-0 z-0 mask-[radial-gradient(700px_circle_at_center,white,transparent)]"
        squareSize={6}
        gridGap={14}
        color="#6b9eb6"
        maxOpacity={0.7}
        flickerChance={0.1}
      />
      <div className="relative z-10 flex flex-col items-center gap-2">
        <span className="text-8xl font-black tracking-tighter text-muted-foreground/20">404</span>
        <h1 className="text-2xl font-bold">页面未找到</h1>
        <p className="text-sm text-muted-foreground">你访问的页面不存在或已被移除</p>
      </div>
      <Link href="/" className="relative z-10">
        <Button>返回首页</Button>
      </Link>
    </div>
  );
}
