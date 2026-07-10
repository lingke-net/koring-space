import { useNewsStore } from "@/lib/database";

export default async function NewsPage() {
  const newsList = await useNewsStore.findAsync({});

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold">新闻动态</h1>

      <div className="grid gap-4">
        {newsList.length > 0 ? (
          newsList.map((item: any) => (
            <div
              key={item._id}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h2 className="text-lg font-semibold">{item.title || "无标题"}</h2>
              <p className="text-gray-500 text-sm mt-2">{item.content || "暂无内容..."}</p>
              <div className="text-xs text-gray-400 mt-4">
                发布于: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "未知"}
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">目前还没有新闻内容。</p>
        )}
      </div>
    </div>
  );
}
