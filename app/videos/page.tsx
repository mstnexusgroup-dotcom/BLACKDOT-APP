import { Suspense } from "react";

export default function VideosPage() {
  // Real educational YouTube IDs for Grade 11 & 12
  const studyVideos = [
    {
      id: "1",
      title: "Grade 12 Mathematics: Trigonometry",
      grade: "Grade 12",
      embedId: "S4S3ayp7S6Y", // Real Video ID
      description: "Mastering Trigonometric Graphs and Identities for the NSC exams."
    },
    {
      id: "2",
      title: "Grade 11 Physical Sciences: Newton's Laws",
      grade: "Grade 11",
      embedId: "kvXvC693t9s", // Real Video ID
      description: "A deep dive into Newton's First, Second, and Third laws of motion."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-blue-900">Study Video Library</h1>
          <p className="text-gray-600 mt-2">Expert tutorials for MST students.</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {studyVideos.map((video) => (
            <div key={video.id} className="group border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow bg-white">
              {/* The Video Player Area */}
              <div className="aspect-video bg-black">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${video.embedId}`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              {/* The Info Area */}
              <div className="p-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full uppercase tracking-wider">
                    {video.grade}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {video.description}
                </p>
                
                <button className="mt-4 w-full bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                  View Resources
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}