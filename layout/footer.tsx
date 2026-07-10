import { Button } from "@/components/ui/button";
import Link from "next/link";

function Footer() {
  return (
    <div className="py-10 px-4 mt-10 mx-4 md:mx-6 lg:mx-44 flex items-start md:items-center flex-col md:flex-row sm:justify-between gap-4 md:gap-0 border-t">
      <Link href="/">
        <Button className="font-bold" variant="ghost">
          <span>Koring Team Space</span>
        </Button>
      </Link>
      <div className="flex items-center gap-1 flex-wrap">
        <a href="mailto:hi@lenjing.email?subject=联系支持" target="_blank">
          <Button variant="ghost">hi@lenjing.email</Button>
        </a>
        <a href="https://beian.miit.gov.cn/" target="_blank">
          <Button variant="ghost">鲁ICP备2024089677号-2</Button>
        </a>
        <a href="https://rivfox.com/" target="_blank">
          <Button variant="ghost">RIVFOX.COM</Button>
        </a>
        <a href="https://lingke.ink/" target="_blank">
          <Button variant="ghost">瓴克科技</Button>
        </a>
        <a href="https://dream-pep.cn/" target="_blank">
          <Button variant="ghost">追梦者</Button>
        </a>
        <a href="https://lenjing.cn/" target="_blank">
          <Button variant="ghost">棱镜视界</Button>
        </a>
      </div>
    </div>
  );
}

export { Footer };
