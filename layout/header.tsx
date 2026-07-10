import { Button } from "@/components/ui/button";
import Link from "next/link";

function Header() {
  return (
    <div className="fixed w-full backdrop-blur-sm bg-background/70 p-3 px-4 md:px-10 lg:px-48 flex items-center justify-between z-20">
      <Link href="/">
        <Button className="font-bold" variant="ghost">
          Koring Team Space
        </Button>
      </Link>
      <div className="flex items-center gap-1">
        <a href="https://support.lingke.ink">
          <Button variant="ghost">支持</Button>
        </a>
        <a href="https://learn.rivfox.com">
          <Button variant="ghost">文档</Button>
        </a>
      </div>
    </div>
  );
}

export { Header };
