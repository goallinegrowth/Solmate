"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

// Web Speech API will be loaded inside useEffect

interface Team {
  id: string;
  name: string;
  age_group: string;
}

export default function RecordClient({ coachId, teams }: { coachId: string; teams: Team[] }) {
  const router = useRouter();
  const [activeTeamId, setActiveTeamId] = useState<string>(teams[0]?.id || "");
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimResult, setInterimResult] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setHasMounted(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechAPI) {
      const recognition = new SpeechAPI();
      recognition.continuous = true;
      recognition.interimResults = true;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        let finalChunk = "";
        let interimChunk = "";
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalChunk += event.results[i][0].transcript;
          } else {
            interimChunk += event.results[i][0].transcript;
          }
        }

        if (finalChunk) {
          setTranscript((prev) => prev + finalChunk + " ");
        }
        setInterimResult(interimChunk);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech Recognition API is not supported in this browser.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setInterimResult("");
    } else {
      // Don't clear transcript, just start again so they can append!
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleGenerate = async () => {
    if (!transcript.trim()) return;
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate-drill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Send combined text just in case there's lingering interim
          voice_transcript: (transcript + " " + interimResult).trim(),
          coach_id: coachId,
          team_id: activeTeamId,
        }),
      });

      const data = await response.json();

      if (response.ok && data.drill_id) {
        // Redirect to detail page
        router.push(`/drill/${data.drill_id}`);
      } else {
        alert("Failed to generate drill: " + (data.error || "Unknown error"));
        setIsGenerating(false);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to the generator.");
      setIsGenerating(false);
    }
  };

  // Generate 24 wave bars for the animation
  const waveBars = Array.from({ length: 24 }).map((_, i) => (
    <div
      key={i}
      className="w-1 bg-gold rounded-sm h-2 transition-all duration-150"
      style={{
        animation: isRecording
          ? `waveAnim 0.6s ease-in-out infinite alternate`
          : "none",
        animationDelay: `${i * 0.07}s`,
      }}
    ></div>
  ));

  if (!hasMounted) return null;

  return (
    <div className="min-h-screen px-5 pt-10 pb-24 max-w-[400px] mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-[10px] transition-colors"
        >
          ←
        </button>
        <div className="font-bebas text-[22px] tracking-[0.06em] mt-1">
          RECORD PAIN POINT
        </div>
      </div>

      <div className="font-bebas text-[14px] text-white tracking-[0.08em] mb-3">
        SELECT TEAM
      </div>
      <div className="flex gap-2 flex-wrap mb-7">
        {teams.map((team) => (
          <button
            key={team.id}
            onClick={() => setActiveTeamId(team.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold border-[1.5px] transition-all ${
              activeTeamId === team.id
                ? "bg-gold text-dark border-gold"
                : "bg-transparent text-gray border-white/10 hover:border-gold hover:text-gold"
            }`}
          >
            {team.age_group} {team.name}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-5 my-3 mb-6">
        <button
          onClick={toggleRecording}
          className={`w-[110px] h-[110px] rounded-full bg-navy-light flex items-center justify-center text-[40px] transition-all duration-300 relative ${
            isRecording
              ? "border-gold border-[3px] shadow-[0_0_40px_rgba(242,169,0,0.3)] animate-pulse"
              : "border-[rgba(242,169,0,0.3)] border-[3px] hover:border-gold hover:shadow-[0_0_30px_rgba(242,169,0,0.3)]"
          }`}
        >
          🎙️
        </button>
        <div className="text-[13px] text-gray font-medium">
          {isRecording ? "Listening..." : "Tap to describe the problem"}
        </div>
        
        {/* Waveform Visualization */}
        <div
          className={`flex items-center gap-[3px] overflow-hidden transition-all duration-300 ${
            isRecording ? "opacity-100 h-10" : "opacity-0 h-0"
          }`}
        >
          {waveBars}
        </div>
      </div>

      <div className="bg-navy-mid border border-white/5 rounded-[14px] p-4 min-h-[120px] mb-5 flex flex-col">
        <div className="text-[10px] text-gray uppercase tracking-[0.1em] font-bold mb-2 flex justify-between">
          <span>Live Transcript</span>
          {isRecording && <span className="text-gold animate-pulse">● Recording</span>}
        </div>
        <textarea
          value={transcript + interimResult}
          onChange={(e) => {
            setTranscript(e.target.value);
            setInterimResult(""); // Clear interim if they manually type
          }}
          placeholder="Speak to record your problem, or type it here..."
          className="w-full bg-transparent text-[14px] text-white leading-[1.6] resize-none outline-none border-none placeholder:text-gray/50 flex-1 min-h-[80px]"
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={!(transcript + interimResult).trim() || isGenerating || isRecording}
        className="w-full p-4 bg-gold text-dark border-none rounded-[14px] font-bebas text-[20px] tracking-[0.1em] cursor-pointer transition-all disabled:opacity-30 disabled:pointer-events-none hover:-translate-y-0.5 hover:shadow-[0_10px_40px_rgba(242,169,0,0.3)] enabled:shadow-[0_6px_24px_rgba(242,169,0,0.3)] flex justify-center items-center gap-2"
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            GENERATING...
          </>
        ) : (
          "⚡ GENERATE DRILL PLAN"
        )}
      </button>

      {/* Global CSS for wave animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes waveAnim {
          0% { height: 8px; }
          100% { height: 36px; }
        }
      `}} />
    </div>
  );
}
