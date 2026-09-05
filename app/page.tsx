"use client";

import { useState, useRef, useEffect } from "react";

interface FeedVideo {
  id: string;
  url: string;
  caption: string;
  author: string;
  likes: number;
  commentsCount: number;
}

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
}

interface NewsArticle {
  id: string;
  title: string;
  category: "Tech" | "Science" | "Sports" | "World" | "Business";
  summary: string;
  content: string;
  date: string;
  readTime: string;
  isSaved?: boolean;
}

interface BookItem {
  id: string;
  title: string;
  author: string;
  category: string;
  type: "Free" | "Marketplace";
  price?: string;
  condition?: string;
  description: string;
}

export default function BlackdotApp() {
  const [activeTab, setActiveTab] = useState<"assistant" | "videos" | "news" | "business" | "library" | "profile">("profile");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // --- BUSINESS STATE ---
  const [isInvestorModalOpen, setIsInvestorModalOpen] = useState(false);
  const [investorMessage, setInvestorMessage] = useState("");

  // --- LIBRARY STATE ---
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [activeReaderBook, setActiveReaderBook] = useState<BookItem | null>(null);
  const [activeCheckoutBook, setActiveCheckoutBook] = useState<BookItem | null>(null);

  // Checkout form state
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");

  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [bookPrice, setBookPrice] = useState("");
  const [bookCondition, setBookCondition] = useState("Good");
  const [bookDescription, setBookDescription] = useState("");

  const [books, setBooks] = useState<BookItem[]>([
    {
      id: "free-1",
      title: "Introduction to JavaScript & Web Development",
      author: "Open Source Community",
      category: "Programming",
      type: "Free",
      description: "A comprehensive free guide to learning modern frontend development, DOM manipulation, and JavaScript fundamentals."
    },
    {
      id: "free-2",
      type: "Free",
      title: "Fundamentals of Business Strategy & Startups",
      author: "Global Entrepreneurship Network",
      category: "Business",
      description: "Essential strategies for building, scaling, and managing modern startup companies effectively."
    },
    {
      id: "free-3",
      title: "Data Structures & Algorithms Made Easy",
      author: "Tech Academy",
      category: "Computer Science",
      description: "Essential reference book for coding interviews, algorithmic complexity, and efficient software design."
    },
    {
      id: "market-1",
      title: "Computer Science 101 Textbook",
      author: "Campus Bookstore",
      category: "Textbook",
      type: "Marketplace",
      price: "$25",
      condition: "Good",
      description: "Physical pickup copy of introductory computer science principles."
    }
  ]);

  // --- PROFILE & AUTH STATE ---
  const [authInput, setAuthInput] = useState("");
  const [verificationCodeSent, setVerificationCodeSent] = useState(false);
  const [enteredCode, setEnteredCode] = useState("");
  const [simulatedCode, setSimulatedCode] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState({
    identifier: "",
    name: "Blackdot Student",
    bio: "Passionate about tech, business, and learning.",
    savedBooksCount: 1,
  });

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authInput.trim()) {
      alert("Please enter a valid email or phone number.");
      return;
    }
    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
    setSimulatedCode(randomCode);
    setVerificationCodeSent(true);
    alert(`[Simulated SMS/Email Gateway]\nYour verification code is: ${randomCode}`);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredCode.trim() === simulatedCode) {
      setIsLoggedIn(true);
      setUserProfile((prev) => ({ ...prev, identifier: authInput }));
      alert("Successfully signed in!");
    } else {
      alert("Invalid verification code. Please check the code sent to your email or phone.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAuthInput("");
    setVerificationCodeSent(false);
    setEnteredCode("");
    setSimulatedCode("");
  };

  const handlePublishBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle || !bookPrice) {
      alert("Please fill in the book title and price.");
      return;
    }

    const newBook: BookItem = {
      id: Date.now().toString(),
      title: bookTitle,
      author: bookAuthor || (isLoggedIn ? userProfile.name : "Independent Seller"),
      category: "Marketplace",
      type: "Marketplace",
      price: `$${bookPrice.replace("$", "")}`,
      condition: bookCondition,
      description: bookDescription || "No description provided."
    };

    setBooks([newBook, ...books]);
    setBookTitle("");
    setBookAuthor("");
    setBookPrice("");
    setBookDescription("");
    setIsSellModalOpen(false);
    alert("Book listed successfully in the Marketplace!");
  };

  const handleCompleteCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerEmail || !buyerAddress) {
      alert("Please fill in all checkout fields.");
      return;
    }

    alert(`Order confirmed for "${activeCheckoutBook?.title}"! Receipt sent to ${buyerEmail}.`);
    setActiveCheckoutBook(null);
    setBuyerName("");
    setBuyerEmail("");
    setBuyerAddress("");
  };

  // --- NEWS STATE ---
  const [newsSearch, setNewsSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | "Tech" | "Science" | "Sports" | "World" | "Business">("All");
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const [articles, setArticles] = useState<NewsArticle[]>([
    {
      id: "1",
      title: "AI Breakthrough: Next-Gen Models Run Directly on Mobile Devices",
      category: "Tech",
      summary: "Engineers have developed hyper-efficient language models that run completely offline on ordinary smartphones without battery drain.",
      content: `Artificial intelligence research reached a massive landmark today as developers revealed light-weight neural networks optimized directly for mobile hardware.`,
      date: "Today, 10:30 AM",
      readTime: "4 min read",
      isSaved: false
    },
    {
      id: "2",
      title: "Global Climate Summit Reaches Historic Clean Energy Agreement",
      category: "World",
      summary: "Over 50 countries pledge to construct interconnected cross-border solar grids and modernize regional energy storage.",
      content: `Delegates at the International Climate Action Summit have finalized a binding agreement to construct high-capacity cross-border electrical grids.`,
      date: "Yesterday, 3:15 PM",
      readTime: "5 min read",
      isSaved: false
    }
  ]);

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    const matchesQuery =
      article.title.toLowerCase().includes(newsSearch.toLowerCase()) ||
      article.summary.toLowerCase().includes(newsSearch.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const toggleSaveArticle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isSaved: !a.isSaved } : a))
    );
  };

  // --- VIDEO STATES ---
  const [videoFeed, setVideoFeed] = useState<FeedVideo[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [stagedVideoUrl, setStagedVideoUrl] = useState<string | null>(null);
  const [videoCaption, setVideoCaption] = useState("");
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    { id: "1", sender: "assistant", text: "Hello! Welcome to Blackdot. How can I help with your studies, business, or profile today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isLive, setIsLive] = useState(false);
  const liveVideoRef = useRef<HTMLVideoElement>(null);
  const liveStreamRef = useRef<MediaStream | null>(null);

  const [likes, setLikes] = useState(1241);
  const [isLiked, setIsLiked] = useState(false);
  const [isSavedVideo, setIsSavedVideo] = useState(false);
  const [commentsList, setCommentsList] = useState<string[]>([
    "Awesome content! 🔥",
    "Very helpful breakdown, thanks for sharing!"
  ]);
  const [newCommentInput, setNewCommentInput] = useState("");
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraPreviewRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);

  const currentVideo = videoFeed[currentVideoIndex] || null;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleSaveVideo = () => {
    setIsSavedVideo(!isSavedVideo);
    alert(isSavedVideo ? "Removed from saved videos." : "Video saved successfully!");
  };

  const handleShareVideo = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert("Video link copied to clipboard!");
    } else {
      alert("Sharing feature active!");
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentInput.trim()) return;
    setCommentsList([newCommentInput.trim(), ...commentsList]);
    setNewCommentInput("");
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      stopCamera();
      stopLiveStream();
      const url = URL.createObjectURL(file);
      setStagedVideoUrl(url);
      setIsPostModalOpen(true);
      e.target.value = "";
    }
  };

  const handlePublishPost = () => {
    if (!stagedVideoUrl) return;

    const newVideo: FeedVideo = {
      id: Date.now().toString(),
      url: stagedVideoUrl,
      caption: videoCaption || "Uploaded to Blackdot Studio",
      author: isLoggedIn ? `@${userProfile.name.toLowerCase().replace(/\s+/g, "_")}` : "@you",
      likes: 0,
      commentsCount: commentsList.length
    };

    setVideoFeed((prev) => [newVideo, ...prev]);
    setCurrentVideoIndex(0);
    setStagedVideoUrl(null);
    setVideoCaption("");
    setIsPostModalOpen(false);
  };

  const toggleLiveStream = async () => {
    if (isLive) {
      stopLiveStream();
    } else {
      try {
        stopCamera();
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        liveStreamRef.current = stream;
        setIsLive(true);
        setTimeout(() => {
          if (liveVideoRef.current) {
            liveVideoRef.current.srcObject = stream;
          }
        }, 100);
      } catch (err) {
        alert("Unable to access camera for live streaming.");
      }
    }
  };

  const stopLiveStream = () => {
    if (liveStreamRef.current) {
      liveStreamRef.current.getTracks().forEach((track) => track.stop());
      liveStreamRef.current = null;
    }
    setIsLive(false);
  };

  const startCamera = async () => {
    stopLiveStream();
    setIsRecordingModalOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (cameraPreviewRef.current) {
        cameraPreviewRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Camera permission denied.");
      setIsRecordingModalOpen(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsRecordingModalOpen(false);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const userMsg: Message = { id: Date.now().toString(), sender: "user", text: userText };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      if (!response.ok) throw new Error("API call failed");

      const data = await response.json();
      const reply = data.reply || data.choices?.[0]?.message?.content || data.text;

      if (reply) {
        setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), sender: "assistant", text: reply }]);
      } else {
        setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), sender: "assistant", text: "Received empty response." }]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), sender: "assistant", text: "Network Error: Could not reach AI service." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-[#f7f9fa] text-gray-800 font-sans w-full relative overflow-hidden">

      <header className="p-4 border-b border-gray-200 bg-white text-lg font-bold text-center capitalize shrink-0 shadow-sm">
        {activeTab} Section
      </header>

      <main ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 w-full">

        {/* 1. ASSISTANT TAB */}
        {activeTab === "assistant" && (
          <div className="space-y-4 pb-4 w-full max-w-5xl mx-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-sm ${
                  msg.sender === "user"
                    ? "bg-[#0084ff] text-white ml-auto rounded-br-none"
                    : "bg-white border border-gray-200 text-gray-800 mr-auto rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="p-4 rounded-2xl max-w-[80%] bg-white border border-gray-200 text-gray-400 mr-auto text-sm animate-pulse">
                Thinking...
              </div>
            )}
          </div>
        )}

        {/* 2. VIDEO TAB */}
        {activeTab === "videos" && (
          <div className="space-y-4 w-full max-w-4xl mx-auto">
            <div className="relative bg-black text-white h-[600px] w-full rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl">
              <div className="p-4 flex items-center justify-between z-10 bg-gradient-to-b from-black/70 to-transparent">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-purple-600 border border-white flex items-center justify-center font-bold text-xs">
                    {isLoggedIn ? userProfile.name.charAt(0) : "P"}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">{currentVideo ? currentVideo.author : (isLoggedIn ? `@${userProfile.name.toLowerCase()}` : "@creator_profile")}</h4>
                    <p className="text-[10px] text-gray-300">
                      {currentVideo ? currentVideo.caption : "Blackdot Studio Feed"}
                    </p>
                  </div>
                </div>

                {isLive && (
                  <span className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                    LIVE • Broadcasting
                  </span>
                )}
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                {isLive ? (
                  <video ref={liveVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                ) : currentVideo ? (
                  <video
                    key={currentVideo.id}
                    src={currentVideo.url}
                    controls
                    autoPlay
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-gray-400 space-y-2 px-4">
                    <div className="text-4xl">🎬</div>
                    <p className="text-sm font-semibold">No Posted Videos Yet</p>
                    <p className="text-xs text-gray-500">Click Upload or Record on the left to publish your first video.</p>
                  </div>
                )}
              </div>

              <input
                type="file"
                accept="video/*"
                ref={fileInputRef}
                onChange={handleVideoUpload}
                className="hidden"
              />

              {/* Left Action Controls (Record, Upload, Live) */}
              <div className="absolute left-4 bottom-6 flex flex-col items-center gap-4 z-20 text-xs">
                <button onClick={startCamera} className="flex flex-col items-center group">
                  <div className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center text-xl border-2 border-white shadow-lg transition transform group-hover:scale-110">
                    📹
                  </div>
                  <span className="text-[10px] mt-1 font-bold drop-shadow">Record</span>
                </button>

                <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center group">
                  <div className="w-12 h-12 rounded-full bg-[#0084ff] hover:bg-blue-600 text-white flex items-center justify-center text-xl border-2 border-white shadow-lg transition transform group-hover:scale-110">
                    📤
                  </div>
                  <span className="text-[10px] mt-1 font-bold drop-shadow">Upload</span>
                </button>

                <button onClick={toggleLiveStream} className="flex flex-col items-center group">
                  <div className={`w-12 h-12 rounded-full ${isLive ? "bg-red-600 animate-pulse" : "bg-gray-900/90 hover:bg-black"} text-white flex items-center justify-center text-xl border-2 border-white shadow-lg transition transform group-hover:scale-110`}>
                    🔴
                  </div>
                  <span className="text-[10px] mt-1 font-bold drop-shadow">{isLive ? "End Live" : "Go Live"}</span>
                </button>
              </div>

              {/* Right Action Controls (Like, Comments, Save, Share) - Permanently Visible */}
              <div className="absolute right-4 bottom-6 flex flex-col items-center gap-4 z-20 text-xs">
                <button onClick={handleLike} className="flex flex-col items-center group">
                  <div className={`w-12 h-12 rounded-full ${isLiked ? "bg-pink-600 text-white" : "bg-gray-900/90 hover:bg-black text-gray-200"} flex items-center justify-center text-xl border-2 border-white shadow-lg transition transform group-hover:scale-110`}>
                    ❤️
                  </div>
                  <span className="text-[10px] mt-1 font-bold drop-shadow">{likes}</span>
                </button>

                <button onClick={() => setIsCommentsOpen(true)} className="flex flex-col items-center group">
                  <div className="w-12 h-12 rounded-full bg-gray-900/90 hover:bg-black text-gray-200 flex items-center justify-center text-xl border-2 border-white shadow-lg transition transform group-hover:scale-110">
                    💬
                  </div>
                  <span className="text-[10px] mt-1 font-bold drop-shadow">{commentsList.length}</span>
                </button>

                <button onClick={handleSaveVideo} className="flex flex-col items-center group">
                  <div className={`w-12 h-12 rounded-full ${isSavedVideo ? "bg-amber-500 text-white" : "bg-gray-900/90 hover:bg-black text-gray-200"} flex items-center justify-center text-xl border-2 border-white shadow-lg transition transform group-hover:scale-110`}>
                    🔖
                  </div>
                  <span className="text-[10px] mt-1 font-bold drop-shadow">Save</span>
                </button>

                <button onClick={handleShareVideo} className="flex flex-col items-center group">
                  <div className="w-12 h-12 rounded-full bg-gray-900/90 hover:bg-black text-gray-200 flex items-center justify-center text-xl border-2 border-white shadow-lg transition transform group-hover:scale-110">
                    🔗
                  </div>
                  <span className="text-[10px] mt-1 font-bold drop-shadow">Share</span>
                </button>
              </div>

              {/* Comments Popup Modal */}
              {isCommentsOpen && (
                <div className="absolute inset-x-0 bottom-0 top-20 bg-black/85 backdrop-blur-md rounded-t-2xl flex flex-col justify-between p-5 z-40 animate-in fade-in slide-in-from-bottom duration-200">
                  <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                    <h3 className="font-bold text-sm text-white">Comments ({commentsList.length})</h3>
                    <button onClick={() => setIsCommentsOpen(false)} className="text-gray-400 hover:text-white text-xs font-bold px-2 py-1">
                      ✕ Close
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto my-3 space-y-3 pr-1">
                    {commentsList.map((cmt, idx) => (
                      <div key={idx} className="bg-gray-900 border border-gray-800 p-3 rounded-xl text-xs text-gray-200 space-y-1">
                        <span className="font-bold text-blue-400">@viewer_user</span>
                        <p>{cmt}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddComment} className="flex gap-2 pt-2 border-t border-gray-800">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                      value={newCommentInput}
                      onChange={(e) => setNewCommentInput(e.target.value)}
                    />
                    <button type="submit" className="bg-[#0084ff] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-600 transition">
                      Post
                    </button>
                  </form>
                </div>
              )}

              {/* Post Creation Modal */}
              {isPostModalOpen && stagedVideoUrl && (
                <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col justify-between p-6 z-50">
                  <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                    <h3 className="font-bold text-sm text-white">Create Video Post</h3>
                    <button
                      onClick={() => {
                        setIsPostModalOpen(false);
                        setStagedVideoUrl(null);
                      }}
                      className="text-gray-400 hover:text-white text-xs"
                    >
                      ✕ Cancel
                    </button>
                  </div>

                  <div className="flex-1 my-4 relative rounded-xl overflow-hidden border border-gray-800 bg-black flex items-center justify-center">
                    <video src={stagedVideoUrl} controls autoPlay loop className="max-h-full max-w-full object-contain" />
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Write a caption for your video..."
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-blue-500"
                      value={videoCaption}
                      onChange={(e) => setVideoCaption(e.target.value)}
                    />

                    <button
                      onClick={handlePublishPost}
                      className="w-full bg-[#0084ff] hover:bg-blue-600 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg"
                    >
                      🚀 Publish Video Now
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. NEWS TAB */}
        {activeTab === "news" && (
          <div className="space-y-6 w-full max-w-5xl mx-auto">
            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl p-3.5 shadow-sm w-full focus-within:border-blue-500 transition">
              <span className="text-gray-400 text-lg">🔍</span>
              <input
                type="text"
                placeholder="Search headlines, tech, science, world news, or sports..."
                className="w-full text-base outline-none bg-transparent text-gray-800 placeholder-gray-400"
                value={newsSearch}
                onChange={(e) => setNewsSearch(e.target.value)}
              />
              {newsSearch && (
                <button onClick={() => setNewsSearch("")} className="text-xs text-gray-400 hover:text-gray-600 font-bold px-2">
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {(["All", "Tech", "Science", "Sports", "World", "Business"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition shrink-0 ${
                    selectedCategory === cat
                      ? "bg-[#0084ff] text-white shadow-sm scale-105"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                {selectedCategory} Headings & Articles ({filteredArticles.length})
              </h3>

              {filteredArticles.length === 0 ? (
                <div className="p-10 text-center bg-white border rounded-2xl shadow-sm space-y-3">
                  <p className="text-gray-500 font-semibold text-base">No articles found matching "{newsSearch}"</p>
                  <button
                    onClick={() => {
                      setNewsSearch("");
                      setSelectedCategory("All");
                    }}
                    className="text-xs text-blue-600 font-bold hover:underline"
                  >
                    Clear Search Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredArticles.map((article) => (
                    <div
                      key={article.id}
                      onClick={() => setSelectedArticle(article)}
                      className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer flex justify-between items-start gap-4 group"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] bg-red-100 text-red-600 px-3 py-0.5 rounded-full font-bold uppercase tracking-wide">
                            {article.category}
                          </span>
                          <span className="text-xs text-gray-400">• {article.date}</span>
                          <span className="text-xs text-gray-400">• {article.readTime}</span>
                        </div>
                        <h4 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition leading-snug">
                          {article.title}
                        </h4>
                        <p className="text-base text-gray-600 leading-relaxed font-normal">{article.summary}</p>
                      </div>

                      <button
                        onClick={(e) => toggleSaveArticle(article.id, e)}
                        className={`p-2.5 rounded-full border transition shrink-0 ${
                          article.isSaved
                            ? "bg-amber-50 border-amber-300 text-amber-600"
                            : "bg-gray-50 border-gray-200 text-gray-400 hover:text-gray-600"
                        }`}
                        title={article.isSaved ? "Saved" : "Bookmark Article"}
                      >
                        🔖
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedArticle && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 space-y-5 shadow-2xl relative border border-gray-100">
                  <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                    <span className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full font-bold uppercase">
                      {selectedArticle.category}
                    </span>
                    <button
                      onClick={() => setSelectedArticle(null)}
                      className="text-gray-400 hover:text-gray-800 text-sm font-bold bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center transition"
                    >
                      ✕
                    </button>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 leading-snug">{selectedArticle.title}</h2>

                  <div className="flex gap-4 text-xs text-gray-400 border-b border-gray-100 pb-4">
                    <span>Published: {selectedArticle.date}</span>
                    <span>Reading time: {selectedArticle.readTime}</span>
                  </div>

                  <div className="text-base text-gray-700 leading-relaxed space-y-4 whitespace-pre-line font-normal">
                    {selectedArticle.content}
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={() => setSelectedArticle(null)}
                      className="px-6 py-3 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition shadow-md"
                    >
                      Close Article
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. BUSINESS TAB */}
        {activeTab === "business" && (
          <div className="space-y-4 w-full max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 rounded-xl text-sm flex justify-between items-center shadow-md w-full">
              <div>
                <p className="font-bold">7 Days Free Trial Active</p>
                <p className="text-xs text-amber-100">Pay required after 7 days to maintain investor listings.</p>
              </div>
              <button
                onClick={() => alert("Redirecting to secure checkout billing...")}
                className="bg-white text-orange-600 font-bold px-4 py-2 rounded-lg text-xs hover:bg-amber-50 transition"
              >
                Upgrade
              </button>
            </div>

            <div className="p-5 bg-white border rounded-xl shadow-sm w-full">
              <h4 className="font-bold text-base">Venture Capital Group</h4>
              <p className="text-sm text-gray-600 mt-1">Providing seed capital for small business growth and startups.</p>
              <button
                onClick={() => setIsInvestorModalOpen(true)}
                className="mt-4 w-full bg-[#0084ff] text-white text-sm py-2.5 rounded-lg font-bold hover:bg-blue-600 transition shadow-sm"
              >
                Connect & Find Investor
              </button>
            </div>

            {isInvestorModalOpen && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative border border-gray-100">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="font-bold text-base text-gray-900">Connect with Venture Capital Group</h3>
                    <button
                      onClick={() => setIsInvestorModalOpen(false)}
                      className="text-gray-400 hover:text-gray-800 font-bold text-sm bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>

                  <p className="text-xs text-gray-600">
                    Send your business pitch and details directly to our partner network of verified investors.
                  </p>

                  <textarea
                    placeholder="Briefly describe your startup, traction, or funding goals..."
                    className="w-full text-sm p-3 bg-gray-50 border rounded-xl outline-none h-32 focus:border-blue-500 text-gray-800"
                    value={investorMessage}
                    onChange={(e) => setInvestorMessage(e.target.value)}
                  />

                  <button
                    onClick={() => {
                      if (!investorMessage.trim()) {
                        alert("Please enter a pitch or message before submitting.");
                        return;
                      }
                      alert("Pitch sent successfully! Investors will review and contact you via email.");
                      setInvestorMessage("");
                      setIsInvestorModalOpen(false);
                    }}
                    className="w-full bg-[#0084ff] hover:bg-blue-600 text-white font-bold py-3 rounded-xl text-xs transition shadow-md"
                  >
                    🚀 Submit Pitch to Investors
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5. LIBRARY TAB */}
        {activeTab === "library" && (
          <div className="space-y-6 w-full max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-gray-900">Digital Library & Marketplace</h3>
                <p className="text-xs text-gray-500 mt-0.5">Access free learning resources or buy/sell used textbooks.</p>
              </div>
              <button 
                onClick={() => setIsSellModalOpen(true)}
                className="bg-[#0084ff] text-white text-xs px-4 py-2.5 rounded-lg font-bold hover:bg-blue-600 transition shadow-sm"
              >
                + Sell a Book
              </button>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase text-gray-400 tracking-wider mb-3">📖 Free Learning Resources & Textbooks</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {books.filter(b => b.type === "Free").map((book) => (
                  <div key={book.id} className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2.5 py-0.5 rounded-full uppercase">Free Access</span>
                        <span className="text-[10px] text-gray-400">{book.category}</span>
                      </div>
                      <h5 className="font-bold text-sm text-gray-900 mt-1">{book.title}</h5>
                      <p className="text-xs text-gray-500 mt-1">By {book.author}</p>
                      <p className="text-xs text-gray-600 mt-2 line-clamp-2">{book.description}</p>
                    </div>
                    <button 
                      onClick={() => setActiveReaderBook(book)}
                      className="mt-4 w-full bg-green-600 text-white text-xs py-2 rounded-lg font-bold hover:bg-green-700 transition"
                    >
                      Read / Download Free
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase text-gray-400 tracking-wider mb-3">🏷️ Student Marketplace Listings</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {books.filter(b => b.type === "Marketplace").map((book) => (
                  <div key={book.id} className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full uppercase">Condition: {book.condition || "Good"}</span>
                        <span className="font-bold text-sm text-blue-600">{book.price}</span>
                      </div>
                      <h5 className="font-bold text-sm text-gray-900 mt-1">{book.title}</h5>
                      <p className="text-xs text-gray-500 mt-1">By {book.author || "Student Seller"}</p>
                      <p className="text-xs text-gray-600 mt-2 line-clamp-2">{book.description}</p>
                    </div>
                    <button 
                      onClick={() => setActiveCheckoutBook(book)}
                      className="mt-4 w-full bg-gray-900 text-white text-xs py-2 rounded-lg font-bold hover:bg-black transition"
                    >
                      Buy Now ({book.price})
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {activeReaderBook && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl max-w-3xl w-full h-[85vh] flex flex-col shadow-2xl relative border border-gray-100 overflow-hidden">
                  <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50 shrink-0">
                    <div>
                      <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded uppercase">Reader Mode</span>
                      <h3 className="font-bold text-sm text-gray-900 mt-1">{activeReaderBook.title}</h3>
                      <p className="text-xs text-gray-500">Author: {activeReaderBook.author}</p>
                    </div>
                    <button 
                      onClick={() => setActiveReaderBook(null)}
                      className="text-gray-400 hover:text-gray-800 font-bold text-sm bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center transition"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-8 space-y-6 text-gray-800 text-sm leading-relaxed bg-white">
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-800 font-medium">
                      📖 You are viewing the online edition of <span className="font-bold">{activeReaderBook.title}</span>.
                    </div>
                    <h4 className="font-bold text-base text-gray-900">Overview</h4>
                    <p>{activeReaderBook.description}</p>
                    <hr className="my-4 border-gray-100" />
                    <h4 className="font-bold text-base text-gray-900">Sample Chapter Content</h4>
                    <p>Welcome to the study material. Modern web development and digital frameworks require a foundational understanding of data handling, responsive user interfaces, and structured architectures.</p>
                  </div>
                  <div className="p-4 border-t bg-gray-50 flex justify-between items-center shrink-0">
                    <button 
                      onClick={() => alert(`Downloading full offline file for "${activeReaderBook.title}"...`)}
                      className="bg-gray-200 text-gray-700 text-xs px-4 py-2 rounded-lg font-bold hover:bg-gray-300 transition"
                    >
                      📥 Download PDF Copy
                    </button>
                    <button 
                      onClick={() => setActiveReaderBook(null)}
                      className="bg-green-600 text-white text-xs px-5 py-2 rounded-lg font-bold hover:bg-green-700 transition"
                    >
                      Done Reading
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeCheckoutBook && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative border border-gray-100">
                  <div className="flex justify-between items-center border-b pb-3">
                    <div>
                      <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded uppercase">Secure Checkout</span>
                      <h3 className="font-bold text-base text-gray-900 mt-1">{activeCheckoutBook.title}</h3>
                    </div>
                    <button 
                      onClick={() => setActiveCheckoutBook(null)}
                      className="text-gray-400 hover:text-gray-800 font-bold text-sm bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <p className="text-gray-500">Condition: <span className="font-bold text-gray-800">{activeCheckoutBook.condition}</span></p>
                      <p className="text-gray-500 mt-0.5">Seller: <span className="font-bold text-gray-800">{activeCheckoutBook.author}</span></p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold text-blue-600">{activeCheckoutBook.price}</span>
                    </div>
                  </div>

                  <form onSubmit={handleCompleteCheckout} className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-gray-500">Your Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. John Doe"
                        className="w-full text-sm p-2.5 bg-gray-50 border rounded-lg mt-1 outline-none focus:border-blue-500"
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-500">Email Address (for receipt & meetup details)</label>
                      <input
                        type="email"
                        placeholder="you@student.edu"
                        className="w-full text-sm p-2.5 bg-gray-50 border rounded-lg mt-1 outline-none focus:border-blue-500"
                        value={buyerEmail}
                        onChange={(e) => setBuyerEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-500">Campus Pickup / Delivery Address</label>
                      <input
                        type="text"
                        placeholder="e.g. Student Center / Room 302"
                        className="w-full text-sm p-2.5 bg-gray-50 border rounded-lg mt-1 outline-none focus:border-blue-500"
                        value={buyerAddress}
                        onChange={(e) => setBuyerAddress(e.target.value)}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#0084ff] hover:bg-blue-600 text-white font-bold py-3 rounded-xl text-xs transition shadow-md mt-2"
                    >
                      Confirm & Pay {activeCheckoutBook.price}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {isSellModalOpen && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative border border-gray-100">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="font-bold text-base text-gray-900">List a Book for Sale</h3>
                    <button 
                      onClick={() => setIsSellModalOpen(false)}
                      className="text-gray-400 hover:text-gray-800 font-bold text-sm bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handlePublishBook} className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-gray-500">Book Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Organic Chemistry 8th Edition"
                        className="w-full text-sm p-2.5 bg-gray-50 border rounded-lg mt-1 outline-none focus:border-blue-500"
                        value={bookTitle}
                        onChange={(e) => setBookTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-gray-500">Price ($)</label>
                        <input
                          type="text"
                          placeholder="e.g. 15"
                          className="w-full text-sm p-2.5 bg-gray-50 border rounded-lg mt-1 outline-none focus:border-blue-500"
                          value={bookPrice}
                          onChange={(e) => setBookPrice(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500">Condition</label>
                        <select
                          className="w-full text-sm p-2.5 bg-gray-50 border rounded-lg mt-1 outline-none focus:border-blue-500"
                          value={bookCondition}
                          onChange={(e) => setBookCondition(e.target.value)}
                        >
                          <option>Brand New</option>
                          <option>Like New</option>
                          <option>Good</option>
                          <option>Fair</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-500">Description / Details</label>
                      <textarea
                        placeholder="Mention any highlights, edition notes, or pickup info..."
                        className="w-full text-sm p-2.5 bg-gray-50 border rounded-lg mt-1 outline-none h-24 focus:border-blue-500"
                        value={bookDescription}
                        onChange={(e) => setBookDescription(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#0084ff] hover:bg-blue-600 text-white font-bold py-3 rounded-xl text-xs transition shadow-md mt-2"
                    >
                      Publish Listing to Marketplace
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 6. PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="space-y-6 w-full max-w-md mx-auto pt-4">
            {!isLoggedIn ? (
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl mx-auto">
                    🔐
                  </div>
                  <h3 className="font-bold text-xl text-gray-900">Sign in to Blackdot</h3>
                  <p className="text-xs text-gray-500">Enter your email or phone number to receive a verification code.</p>
                </div>

                {!verificationCodeSent ? (
                  <form onSubmit={handleSendCode} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500">Email Address or Phone Number</label>
                      <input
                        type="text"
                        placeholder="e.g., user@email.com or +123456789"
                        className="w-full text-sm p-3 bg-gray-50 border rounded-xl mt-1.5 outline-none focus:border-blue-500"
                        value={authInput}
                        onChange={(e) => setAuthInput(e.target.value)}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#0084ff] hover:bg-blue-600 text-white font-bold py-3 rounded-xl text-xs transition shadow-md"
                    >
                      Send Verification Code
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyCode} className="space-y-4">
                    <div className="p-3 bg-blue-50 text-blue-800 rounded-xl text-xs text-center font-medium">
                      Code sent to <span className="font-bold">{authInput}</span>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-500">Enter 4-Digit Verification Code</label>
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="1234"
                        className="w-full text-center tracking-widest text-lg font-bold p-3 bg-gray-50 border rounded-xl mt-1.5 outline-none focus:border-blue-500"
                        value={enteredCode}
                        onChange={(e) => setEnteredCode(e.target.value)}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl text-xs transition shadow-md"
                    >
                      Verify & Sign In
                    </button>

                    <button
                      type="button"
                      onClick={() => setVerificationCodeSent(false)}
                      className="w-full text-xs text-gray-500 hover:underline text-center pt-1"
                    >
                      Use a different email or phone number
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6 text-center">
                <div className="w-20 h-20 bg-purple-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto shadow-md">
                  {userProfile.name.charAt(0)}
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-xl text-gray-900">{userProfile.name}</h3>
                  <p className="text-xs text-gray-400">{userProfile.identifier}</p>
                </div>

                <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl">{userProfile.bio}</p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-blue-50 rounded-xl text-center">
                    <span className="block text-base font-bold text-blue-600">Active</span>
                    <span className="text-[10px] text-gray-500 font-semibold uppercase">Account Status</span>
                  </div>
                  <div className="p-3 bg-green-50 rounded-xl text-center">
                    <span className="block text-base font-bold text-green-600">Verified</span>
                    <span className="text-[10px] text-gray-500 font-semibold uppercase">Security</span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 rounded-xl text-xs transition border border-red-200"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Input Bar (Assistant Tab Only) */}
      {activeTab === "assistant" && (
        <div className="p-4 border-t border-gray-200 bg-white shrink-0 w-full">
          <div className="max-w-5xl mx-auto flex items-center gap-3">
            <input
              type="text"
              className="flex-1 bg-gray-100 text-gray-800 text-sm px-5 py-3 rounded-full outline-none border border-transparent focus:border-blue-500 focus:bg-white transition"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-[#0084ff] text-white px-8 py-3 rounded-full hover:bg-blue-600 transition disabled:opacity-50 text-xs font-bold shadow-sm"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <nav className="w-full bg-white border-t border-gray-200 py-3 shrink-0 z-20 shadow-sm">
        <div className="flex justify-around items-center w-full max-w-7xl mx-auto px-4 text-xs">
          <button
            onClick={() => setActiveTab("assistant")}
            className={`flex flex-col items-center gap-1 transition ${activeTab === "assistant" ? "text-[#0084ff] font-bold scale-105" : "text-gray-500 hover:text-gray-800"}`}
          >
            <span className="text-lg">🤖</span>
            <span>AI</span>
          </button>

          <button
            onClick={() => setActiveTab("videos")}
            className={`flex flex-col items-center gap-1 transition ${activeTab === "videos" ? "text-[#0084ff] font-bold scale-105" : "text-gray-500 hover:text-gray-800"}`}
          >
            <span className="text-lg">🎬</span>
            <span>Videos</span>
          </button>

          <button
            onClick={() => setActiveTab("news")}
            className={`flex flex-col items-center gap-1 transition ${activeTab === "news" ? "text-[#0084ff] font-bold scale-105" : "text-gray-500 hover:text-gray-800"}`}
          >
            <span className="text-lg">📰</span>
            <span>News</span>
          </button>

          <button
            onClick={() => setActiveTab("business")}
            className={`flex flex-col items-center gap-1 transition ${activeTab === "business" ? "text-[#0084ff] font-bold scale-105" : "text-gray-500 hover:text-gray-800"}`}
          >
            <span className="text-lg">💼</span>
            <span>Business</span>
          </button>

          <button
            onClick={() => setActiveTab("library")}
            className={`flex flex-col items-center gap-1 transition ${activeTab === "library" ? "text-[#0084ff] font-bold scale-105" : "text-gray-500 hover:text-gray-800"}`}
          >
            <span className="text-lg">📚</span>
            <span>Library</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center gap-1 transition ${activeTab === "profile" ? "text-[#0084ff] font-bold scale-105" : "text-gray-500 hover:text-gray-800"}`}
          >
            <span className="text-lg">👤</span>
            <span>Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}