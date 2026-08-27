import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
export default async function NewsPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">MST News Feed</h1>
      
      {/* This Suspense boundary fixes the "Blocking Route" error */}
      <Suspense fallback={<p className="text-gray-500">Loading academic updates...</p>}>
        <NewsList />
      </Suspense>
    </div>
  );
}

async function NewsList() {
  // Fix: We must await the client creation
  const supabase = await createClient();
  
  // This fetches your data from the table you just created
  const { data: news, error } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return <p className="text-red-500">Error loading news: {error.message}</p>;
  }

  if (!news || news.length === 0) {
    return <p className="text-gray-500">No news posted yet. Check back soon!</p>;
  }

  return (
    <div className="space-y-4">
      {news.map((item) => (
        <div key={item.id} className="border p-4 rounded-lg shadow-sm bg-white">
          <h2 className="text-xl font-semibold text-blue-700">{item.title}</h2>
          <p className="mt-2 text-gray-700 leading-relaxed">{item.content}</p>
          <p className="text-xs text-gray-400 mt-4">
            {new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}