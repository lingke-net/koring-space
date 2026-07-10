import { Button } from "@/components/ui/button";
import Link from "next/link";

function Footer() {
  return (
    <>
      <div className="px-4 py-4 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Koring Team. All rights reserved.  |  棱镜视界，创造超越想象的视界
      </div>
      <div className="px-4 py-4 text-center text-sm text-muted-foreground">
        Koring Launcher 是一个非官方的 Minecraft 启动器，与 Mojang Studios、Microsoft 或他们位于中国大陆的代理公司之间并无任何从属或关联。
      </div>
      <div className="px-4 py-4 text-center text-sm text-muted-foreground">
        "Minecraft" 以及 "我的世界" 为美国微软公司的商标。Koring Launcher 和本网站与美国微软公司之间没有从属关系。
      </div>
      <div className="px-4 py-4 text-center text-sm text-muted-foreground">
        Koring Team 是 Lingke Network 旗下 Prism Horizon 独立运营的创意化工作室
      </div>
      <div style={{ height: 20 }} />
      <div className="py-8 px-4 border-t">
        <div className="mx-0 md:mx-6 lg:mx-44 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-4">
        <Link href="/">
          <Button className="font-bold text-sm md:text-base" variant="ghost">
            <span>Koring Team Space</span>
          </Button>
        </Link>
        <div className="flex items-center gap-1 flex-wrap">
          <a href="mailto:hi@lenjing.email?subject=联系支持" target="_blank">
            <Button className="text-xs md:text-sm" variant="ghost">HI@lenjing.email</Button>
          </a>
          <a href="https://rivfox.com/" target="_blank">
            <Button className="text-xs md:text-sm" variant="ghost">RIVFOX.COM</Button>
          </a>
          <a href="https://lingke.ink/" target="_blank">
            <Button className="text-xs md:text-sm" variant="ghost">瓴克科技</Button>
          </a>
          <a href="https://dream-pep.cn/" target="_blank">
            <Button className="text-xs md:text-sm" variant="ghost">追梦者</Button>
          </a>
          <a href="https://lenjing.cn/" target="_blank">
            <Button className="text-xs md:text-sm" variant="ghost">棱镜视界</Button>
          </a>
        </div>
        </div>
      </div>
      </>
    );
}

export { Footer };
