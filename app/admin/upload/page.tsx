"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
}

interface JobApplication {
  id: string;
  name: string;
  role: string;
  experience: string;
  status: "Pending" | "Hired" | "Rejected";
}

export default function BlackdotApp() {
  const [activeTab, setActiveTab] = useState<"assistant" | "videos" | "news" | "business" | "library" | "message" | "jobs">("assistant");
  
  // Marketing & Hiring State
  const [applications, setApplications] = useState<JobApplication[]>([
    { id: "1", name: "Sipho M.", role: "B2B Sales Rep", experience: "2 yrs in tech sales", status: "Pending" },
    { id: "2", name: "Aisha K.", role: "Community Moderator", experience: "Student leader", status: "Pending" },
  ]);
  const [applicantName, setApplicantName] = useState("");
  const [selectedRole, setSelectedRole] = useState("Community Moderator");
  const [applicantExp, setApplicantExp] = useState("");

  // News & Video Demo States
  const [newsSearch, setNewsSearch] = useState("");
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(1240);

  // Assistant Chat State
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", sender: "assistant", text: "Hello! Welcome to Blackdot. How can I help with your studies, business, or hiring today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantExp) return;
    
    const newApp: JobApplication = {
      id: Date.now().toString(),
      name: applicantName,
      role: selectedRole,
      experience: applicantExp,
      status: "Pending",
    };

    setApplications((prev) => [newApp, ...prev]);
    setApplicantName("");
    setApplicantExp("");
    alert("Application submitted! The team will review it shortly.");
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
        { id: (Date.now() + 1).toString(), sender: "assistant", text: "Network Error: Could not reach the AI service." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#f7f9fa] text-gray-800 font-sans max-w-lg mx-auto border-x border-gray-200">
      
      {/* Header */}
      <header className="p-4 border-b border-gray-200 bg-white text-lg font-bold text-center capitalize">
        {activeTab} Section
      </header>

      {/* Main Container */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        
        {/* 1. ASSISTANT TAB */}
        {activeTab === "assistant" && (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-xl max-w-[85%] text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-[#0084ff] text-white ml-auto rounded-br-none"
                    : "bg-[#e9ecef] text-gray-800 mr-auto rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="p-3 rounded-xl max-w-[85%] bg-[#e9ecef] text-gray-500 mr-auto text-sm animate-pulse">
                Thinking...
              </div>
            )}
          </div>
        )}

        {/* 2. VIDEO TAB */}
        {activeTab === "videos" && (
          <div className="relative bg-black text-white h-[450px] rounded-2xl overflow-hidden flex flex-col justify-between p-4">
            <div className="flex items-center gap-2 z-10">
              <div className="w-8 h-8 rounded-full bg-purple-500 border border-white flex items-center justify-center text-xs font-bold">
                P
              </div>
              <span className="text-xs font-semibold">@creator_profile</span>
            </div>

            <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold">
              [ Video Feed Player ]
            </div>

            <div className="absolute right-3 bottom-12 flex flex-col items-center gap-4 z-10 text-xs">
              <button className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-gray-800/80 flex items-center justify-center text-lg border border-gray-600">👤</div>
                <span className="text-[10px] mt-0.5">Profile</span>
              </button>

              <button 
                onClick={() => {
                  setLiked(!liked);
                  setLikesCount(liked ? likesCount - 1 : likesCount + 1);
                }} 
                className="flex flex-col items-center"
              >
                <div className={`w-9 h-9 rounded-full ${liked ? "bg-red-500" : "bg-gray-800/80"} flex items-center justify-center text-lg border border-gray-600`}>❤️</div>
                <span className="text-[10px] mt-0.5">{likesCount}</span>
              </button>

              <button className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-gray-800/80 flex items-center justify-center text-lg border border-gray-600">💬</div>
                <span className="text-[10px] mt-0.5">Comment</span>
              </button>

              <button className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-gray-800/80 flex items-center justify-center text-lg border border-gray-600">↗️</div>
                <span className="text-[10px] mt-0.5">Share/Save</span>
              </button>

              <button className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-gray-800/80 flex items-center justify-center text-lg border border-gray-600 animate-spin">🎵</div>
                <span className="text-[10px] mt-0.5">Audio/Voice</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. NEWS TAB */}
        {activeTab === "news" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-2 shadow-sm">
              <span className="text-gray-400">🔍</span>
              <input 
                type="text" 
                placeholder="Search for news..." 
                className="w-full text-xs outline-none bg-transparent"
                value={newsSearch}
                onChange={(e) => setNewsSearch(e.target.value)}
              />
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Daily News & Headlines</h3>
              <div className="p-3 bg-white border rounded-xl shadow-sm">
                <span className="text-[9px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-bold">LATEST</span>
                <h4 className="font-bold text-sm mt-1">Global Economic & Tech Updates</h4>
                <p className="text-xs text-gray-500 mt-1">Breaking changes in local business funding and emerging tech platforms.</p>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">News That Are Trending</h3>
              <div className="space-y-2">
                <div className="p-3 bg-white border rounded-xl shadow-sm flex justify-between items-center">
                  <div>
                    <h5 className="font-bold text-xs">#1 Small Business Investments Rising</h5>
                    <p className="text-[10px] text-gray-400">12.4k Readers • 2 hours ago</p>
                  </div>
                  <span className="text-xs text-blue-500 font-bold">Read</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. BUSINESS TAB */}
        {activeTab === "business" && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-3 rounded-xl text-xs flex justify-between items-center shadow-md">
              <div>
                <p className="font-bold">7 Days Free Trial Active</p>
                <p className="text-[10px] text-amber-100">Pay required after 7 days to maintain investor listings.</p>
              </div>
              <button className="bg-white text-orange-600 font-bold px-3 py-1 rounded-md text-[10px]">Upgrade</button>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Find Big Business & Investors</h3>
              <div className="space-y-3">
                <div className="p-4 bg-white border rounded-xl shadow-sm">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm">Venture Capital Group</h4>
                    <span className="text-[9px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded">Helping Small Biz</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Providing seed capital for small business growth and startups.</p>
                  <button className="mt-3 w-full bg-[#0084ff] text-white text-xs py-2 rounded-lg font-bold">Connect & Find Investor</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. LIBRARY TAB */}
        {activeTab === "library" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Book Marketplace</h3>
              <button className="bg-[#0084ff] text-white text-xs px-3 py-1.5 rounded-lg font-bold">+ Sell a Book</button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white border rounded-xl shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center text-2xl mb-2">📚</div>
                  <h4 className="font-bold text-xs">Computer Science 101</h4>
                  <p className="text-[10px] text-gray-500">Condition: Good</p>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <span className="font-bold text-sm text-green-600">$25</span>
                  <button className="bg-gray-900 text-white text-[10px] px-2.5 py-1 rounded font-bold">Buy</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. MESSAGE TAB */}
        {activeTab === "message" && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Communicate with People</h3>
            <div className="p-3 bg-white border rounded-xl flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">JD</div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="font-bold text-xs">John Doe (Book Buyer)</h4>
                  <span className="text-[9px] text-gray-400">10:30 AM</span>
                </div>
                <p className="text-xs text-gray-500 truncate">Is the Economics book still available?</p>
              </div>
            </div>
          </div>
        )}

        {/* 7. JOBS & MARKETING TAB (NEW) */}
        {activeTab === "jobs" && (
          <div className="space-y-4">
            {/* Marketing Standard Metrics Banner */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <h3 className="font-bold text-xs text-blue-900 uppercase">Blackdot Operations Hub</h3>
              <p className="text-[11px] text-blue-700 mt-1">Hire specialists to keep the app running and generate revenue.</p>
              <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                <div className="bg-white p-2 rounded border">
                  <p className="text-xs text-gray-400">Trial Conversion</p>
                  <p className="font-bold text-sm text-gray-800">14.2%</p>
                </div>
                <div className="bg-white p-2 rounded border">
                  <p className="text-xs text-gray-400">Open Roles</p>
                  <p className="font-bold text-sm text-blue-600">3 Positions</p>
                </div>
                <div className="bg-white p-2 rounded border">
                  <p className="text-xs text-gray-400">Applicants</p>
                  <p className="font-bold text-sm text-green-600">{applications.length}</p>
                </div>
              </div>
            </div>

            {/* Application Form */}
            <form onSubmit={handleApply} className="p-4 bg-white border rounded-xl shadow-sm space-y-3">
              <h4 className="font-bold text-xs uppercase text-gray-500">Apply to Join Blackdot Team</h4>
              <div>
                <label className="text-[10px] font-bold text-gray-500">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Your Name"
                  className="w-full text-xs p-2 bg-gray-50 border rounded mt-1 outline-none"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500">Target Role</label>
                <select 
                  className="w-full text-xs p-2 bg-gray-50 border rounded mt-1 outline-none"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option>Community Moderator</option>
                  <option>B2B Sales & Investor Rep</option>
                  <option>Next.js App Developer</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500">Experience / Skills</label>
                <textarea 
                  placeholder="Tell us how you can help run the app..."
                  className="w-full text-xs p-2 bg-gray-50 border rounded mt-1 outline-none h-16"
                  value={applicantExp}
                  onChange={(e) => setApplicantExp(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="w-full bg-[#0084ff] text-white font-bold text-xs py-2 rounded-lg hover:bg-blue-600 transition">
                Submit Hiring Application
              </button>
            </form>

            {/* Received Applications List */}
            <div>
              <h4 className="font-bold text-xs uppercase text-gray-500 mb-2">Pending Applications</h4>
              <div className="space-y-2">
                {applications.map((app) => (
                  <div key={app.id} className="p-3 bg-white border rounded-xl shadow-sm flex justify-between items-center">
                    <div>
                      <h5 className="font-bold text-xs">{app.name}</h5>
                      <p className="text-[10px] text-blue-600 font-semibold">{app.role}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{app.experience}</p>
                    </div>
                    <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-2 py-1 rounded-full">
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Input Bar (Assistant Tab Only) */}
      {activeTab === "assistant" && (
        <div className="p-3 border-t border-gray-200 bg-white flex items-center gap-2">
          <input
            type="text"
            className="flex-1 bg-gray-100 text-gray-800 text-sm px-4 py-2.5 rounded-full outline-none"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-[#0084ff] text-white p-2.5 rounded-full hover:bg-blue-600 transition disabled:opacity-50 text-xs font-bold"
          >
            Send
          </button>
        </div>
      )}

      {/* Bottom Navigation Dock */}
      <nav className="flex justify-around py-2 border-t border-gray-200 bg-white text-[10px]">
        <button
          onClick={() => setActiveTab("assistant")}
          className={`flex flex-col items-center ${activeTab === "assistant" ? "text-[#0084ff] font-bold" : "text-gray-500"}`}
        >
          <span>🤖</span>
          <span>AI</span>
        </button>

        <button
          onClick={() => setActiveTab("videos")}
          className={`flex flex-col items-center ${activeTab === "videos" ? "text-[#0084ff] font-bold" : "text-gray-500"}`}
        >
          <span>🎬</span>
          <span>Videos</span>
        </button>

        <button
          onClick={() => setActiveTab("news")}
          className={`flex flex-col items-center ${activeTab === "news" ? "text-[#0084ff] font-bold" : "text-gray-500"}`}
        >
          <span>📰</span>
          <span>News</span>
        </button>

        <button
          onClick={() => setActiveTab("business")}
          className={`flex flex-col items-center ${activeTab === "business" ? "text-[#0084ff] font-bold" : "text-gray-500"}`}
        >
          <span>💼</span>
          <span>Business</span>
        </button>

        <button
          onClick={() => setActiveTab("library")}
          className={`flex flex-col items-center ${activeTab === "library" ? "text-[#0084ff] font-bold" : "text-gray-500"}`}
        >
          <span>📚</span>
          <span>Library</span>
        </button>

        <button
          onClick={() => setActiveTab("jobs")}
          className={`flex flex-col items-center ${activeTab === "jobs" ? "text-[#0084ff] font-bold" : "text-gray-500"}`}
        >
          <span>👥</span>
          <span>Jobs</span>
        </button>
      </nav>
    </div>
  );
}