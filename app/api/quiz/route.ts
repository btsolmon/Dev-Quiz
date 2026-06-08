/* eslint-disable prefer-const */
import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

// 1. Төрөлжилтийг баталгаажуулах интерфэйс
interface Submission {
  id: string;
  name: string;
  score: number;
}

// Локал орчинд зориулсан Бэкап (Fallback) санах ой
let localSubmissionsBackup: Submission[] = [
  { id: "local-1", name: "Ананд (Бэкап)", score: 38 },
  { id: "local-2", name: "Мишээл (Бэкап)", score: 35 },
  { id: "local-3", name: "Тэмүүлэн (Бэкап)", score: 28 },
];

// Багуудын тогтмол мэдээлэл
const TEAMS = [
  {
    name: "Team Alpha (Elite)",
    color: "text-rose-400",
    border: "border-rose-500",
  },
  {
    name: "Team Beta (Pro)",
    color: "text-cyan-400",
    border: "border-cyan-500",
  },
  {
    name: "Team Gamma (Rising)",
    color: "text-amber-400",
    border: "border-amber-500",
  },
  {
    name: "Team Delta (Junior)",
    color: "text-slate-400",
    border: "border-slate-500",
  },
];

// KV өгөгдлийн сангийн хувьсагчид байгаа эсэхийг шалгах туслах функц
const checkKvAvailable = () => {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
};

// 2. POST: Хэрэглэгчийн хариултыг хадгалах, багт хуваарилах
export async function POST(req: Request) {
  try {
    const { name, score } = await req.json();

    if (!name || score === undefined || typeof score !== "number") {
      return NextResponse.json(
        { error: "Нэр эсвэл оноо дутуу байна." },
        { status: 400 },
      );
    }

    const newSubmission: Submission = {
      id: Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      score,
    };

    let submissions: Submission[] = [];
    const isKvAvailable = checkKvAvailable();

    if (isKvAvailable) {
      try {
        // Vercel KV-ээс өмнөх бүх өгөгдлийг уншина
        submissions = (await kv.get<Submission[]>("quiz_submissions")) || [];
        submissions.push(newSubmission);
        // Шинэчлэгдсэн жагсаалтыг KV руу хадгална
        await kv.set("quiz_submissions", submissions);
      } catch (kvError) {
        console.error(
          "⚠️ KV руу бичихэд алдаа гарлаа, локал руу шилжлээ:",
          kvError,
        );
        localSubmissionsBackup.push(newSubmission);
        submissions = [...localSubmissionsBackup];
      }
    } else {
      // Локал бэкап санах ой руу нэмэх
      localSubmissionsBackup.push(newSubmission);
      submissions = [...localSubmissionsBackup];
    }

    // 1. Бүх хэрэглэгчдийг оноогоор нь өндрөөс бага руу жагсаана
    const sortedScores = [...submissions].sort((a, b) => b.score - a.score);

    // Хэрэглэгчийн одоогийн эзэлж буй байр
    const currentIdx = sortedScores.findIndex((s) => s.id === newSubmission.id);
    const rank = currentIdx + 1;

    // 2. Драфт / Тэнцүү хуваарилах Могой (Snake) алгоритм
    const numTeams = TEAMS.length;
    const round = Math.floor(currentIdx / numTeams);
    let teamIndex = 0;

    if (round % 2 === 0) {
      teamIndex = currentIdx % numTeams;
    } else {
      teamIndex = numTeams - 1 - (currentIdx % numTeams);
    }

    const team = TEAMS[teamIndex];
    const isCaptain = round === 0; // Эхний 4 хүн бол ахлагч

    return NextResponse.json({
      team: {
        ...team,
        name: isCaptain ? `${team.name} [АХЛАГЧ]` : team.name,
      },
      rank,
      totalParticipants: submissions.length,
      isCaptain,
    });
  } catch (error: any) {
    console.error("Quiz submission error:", error);
    return NextResponse.json(
      { error: "Server Error", details: error.message },
      { status: 500 },
    );
  }
}

// 3. GET: Лайв түүх болон Leaderboard харуулах
export async function GET() {
  try {
    let submissions: Submission[] = [];
    const isKvAvailable = checkKvAvailable();

    if (isKvAvailable) {
      try {
        submissions = (await kv.get<Submission[]>("quiz_submissions")) || [];
      } catch (kvError) {
        console.error(
          "⚠️ KV-ээс дата уншихад алдаа гарлаа, бэкап ашиглаж байна:",
          kvError,
        );
        submissions = [...localSubmissionsBackup];
      }
    } else {
      submissions = [...localSubmissionsBackup];
    }

    // Бүх оноог өндрөөс бага руу нь эрэмбэлж жагсаалт болгох
    const leaderboard = [...submissions].sort((a, b) => b.score - a.score);

    return NextResponse.json(
      {
        totalParticipants: submissions.length,
        // Лайв хэрэглэгчид (Дуураймал тоо)
        activeUsers: Math.max(
          2,
          submissions.length + Math.floor(Math.random() * 4 + 1),
        ),
        // Жагсаалтыг ранкжуулж илгээх
        leaderboard: leaderboard.map((s, idx) => ({
          rank: idx + 1,
          id: s.id,
          name: s.name,
          score: s.score,
        })),
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Leaderboard fetch error:", error);
    return NextResponse.json(
      { error: "Жагсаалтыг татахад алдаа гарлаа", details: error.message },
      { status: 500 },
    );
  }
}
