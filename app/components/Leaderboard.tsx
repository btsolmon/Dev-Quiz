// components/Leaderboard.tsx
"use client";

import React, { useState, useEffect } from "react";

interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  score: number;
}

interface ApiResponse {
  totalParticipants: number;
  activeUsers: number;
  leaderboard: LeaderboardUser[];
}

export default function Leaderboard() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Өгөгдлийг бэкэндээс татах функц
  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("/api/quiz");
      if (!res.ok) throw new Error("Өгөгдөл татахад алдаа гарлаа.");
      const resData: ApiResponse = await res.json();
      setData(resData);
    } catch (err: any) {
      setError(err.message || "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();

    // Сонголттой: Лайв мэдрэмж төрүүлэхийн тулд 10 секунд тутамд шинэчилж болно
    const interval = setInterval(fetchLeaderboard, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl animate-pulse">
        <div className="h-6 bg-slate-800 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-12 bg-slate-800 rounded-xl"></div>
          <div className="h-12 bg-slate-800 rounded-xl"></div>
          <div className="h-12 bg-slate-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-slate-900 border border-rose-950/40 rounded-2xl p-6 text-center">
        <p className="text-rose-400 text-sm">⚠️ {error}</p>
        <button
          onClick={fetchLeaderboard}
          className="mt-3 text-xs text-cyan-400 hover:underline"
        >
          Дахин оролдох
        </button>
      </div>
    );
  }

  const list = data?.leaderboard || [];

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
      {/* Дээд хэсэг: Гарчиг болон Лайв Статус */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏆</span>
          <h3 className="text-lg font-bold text-slate-100 tracking-wide">
            Онооны Самбар
          </h3>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-950/50 border border-emerald-800/60 px-2.5 py-1 rounded-full">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
          <span className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider">
            {data?.activeUsers || 1} Онлайн
          </span>
        </div>
      </div>

      {/* Оролцогчдын тоо */}
      <p className="text-xs text-slate-400 mb-4 font-mono">
        Нийт оролцсон:{" "}
        <span className="text-cyan-400 font-bold">
          {data?.totalParticipants || 0}
        </span>{" "}
        хөгжүүлэгч
      </p>

      {/* Жагсаалт харуулах хэсэг */}
      {list.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-slate-800 rounded-xl bg-slate-950/20">
          <p className="text-sm text-slate-500">
            Одоогоор онооны түүх байхгүй байна.
          </p>
          <p className="text-xs text-slate-600 mt-1">Та анхных нь болоорой!</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
          {list.map((user) => {
            // Эхний 3 байранд өнгө өгөх логик
            let rankStyle = "bg-slate-950/40 border-slate-900 text-slate-400";
            let medal = "";

            if (user.rank === 1) {
              rankStyle =
                "bg-amber-950/20 border-amber-500/30 text-amber-300 font-bold shadow-sm shadow-amber-950/50";
              medal = "🥇 ";
            } else if (user.rank === 2) {
              rankStyle =
                "bg-slate-800/40 border-slate-600/40 text-slate-200 font-bold";
              medal = "🥈 ";
            } else if (user.rank === 3) {
              rankStyle =
                "bg-orange-950/20 border-orange-700/30 text-orange-300 font-bold";
              medal = "🥉 ";
            }

            return (
              <div
                key={user.id}
                className={`flex justify-between items-center p-3.5 rounded-xl border text-sm transition-all duration-150 hover:bg-slate-800/30 ${rankStyle}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-6 text-xs font-mono font-bold text-center ${user.rank <= 3 ? "text-opacity-100" : "text-slate-600"}`}
                  >
                    {user.rank <= 3 ? "" : `#${user.rank}`}
                  </span>
                  <span className="font-medium text-slate-200 truncate">
                    {medal}
                    {user.name}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <span className="font-bold text-cyan-400 font-mono">
                    {user.score}
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    оноо
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
