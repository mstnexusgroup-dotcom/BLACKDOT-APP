"use client";
import { useState, useRef, useEffect } from "react";

export default function AIAssistant() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", text: "MST Exuberance is live! Ask a question or upload a photo." }
  ]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const startVoice = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    const chunks: any[] = [];
    mediaRecorder.current.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.current.onstop = async () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("file", blob, "audio.webm");
      const res = await fetch("/api/transcribe", { method: "POST", body: formData });
      const data = await res.json();
      if (data.text) setUserInput(data.text);
    };
    mediaRecorder.current.start();
  };

  const handleSend = async () => {
    if (!userInput.trim() && !image) return;
    const currentInput = userInput;
    const currentImage = image;

    setMessages(prev => [...prev, { role: "user", text: currentInput || "Uploaded image" }]);
    setUserInput("");
    setImage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput, image: currentImage }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "ai", text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "ai", text: "Something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      <header className="p-4 bg-blue-600 text-white font-bold text-center shadow-md">MST ASSISTANT</header>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`p-3 rounded-2xl max-w-[85%] ${m.role === "user" ? "bg-blue-600 text-white" : "bg-white border"}`}>
              <p className="text-sm whitespace-pre-wrap">{m.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border-t pb-10">
        {image && <div className="text-xs text-blue-500 mb-2">📸 Image attached</div>}
        <div className="flex items-center gap-3 max-w-4xl mx-auto bg-gray-100 rounded-full px-4 py-1 border shadow-inner">
          <label className="cursor-pointer text-xl">
            <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
            📷
          </label>
          <button onMouseDown={startVoice} onMouseUp={() => mediaRecorder.current?.stop()} className="text-xl active:text-red-500">🎤</button>
          <input 
            className="flex-1 bg-transparent p-2 outline-none text-sm" 
            value={userInput} 
            onChange={(e) => setUserInput(e.target.value)} 
            placeholder="Type or use voice..." 
          />
          <button onClick={handleSend} disabled={loading} className="bg-blue-600 text-white px-5 py-2 rounded-full font-bold text-sm">
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}