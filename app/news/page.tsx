import { useNewsStore } from "@/lib/database";
import { ArrowUpRight } from "lucide-react";

export default async function NewsPage() {
  const newsList = await useNewsStore.findAsync({});

  const rowClass =
    "group flex items-start gap-4 md:gap-8 border-t border-border py-5 md:py-6 transition-colors";

  return (
    <div className="pb-8">
      {/* Hero */}
      <section className="pt-14 md:pt-24 pb-12">
        <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
          新闻动态 · News
        </p>
        <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight">
          新闻动态
        </h1>
        <p className="mt-6 max-w-xl text-base md:text-lg leading-relaxed text-muted-foreground">
          Koring Team 的最新消息、产品更新与活动公告。
        </p>
      </section>

      {/* 列表 */}
      <section className="border-t border-border py-10">
        {newsList.length > 0 ? (
          <ul>
            {newsList.map((item: any, i: number) => (
              <li
                key={item._id}
                className="last:border-b last:border-border border-t border-border"
              >
                <div className={rowClass}>
                  <span className="w-6 shrink-0 pt-1.5 font-mono text-xs text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="text-lg font-medium tracking-tight">
                      {item.title || "无标题"}
                    </span>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {item.content || "暂无内容..."}
                    </p>
                  </div>
                  <span className="hidden shrink-0 pt-1.5 font-mono text-xs text-muted-foreground sm:block">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString("zh-CN")
                      : "未知"}
                  </span>
                  <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground py-8">目前还没有新闻内容。</p>
        )}
      </section>
    </div>
  );
}
