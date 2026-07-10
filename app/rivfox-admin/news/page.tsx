import { useNewsStore } from "@/lib/database";
import NewsEditor from "@/components/news-editor";

export default async function NewsPage() {
  const newsList = await useNewsStore.findAsync({});

  return (
    <div className="flex flex-col h-[calc(100vh-25vh)]">
      <div className="flex-1">213</div>

      <NewsEditor className="max-h-52" />
    </div>
  );
}
