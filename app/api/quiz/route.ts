/* eslint-disable prefer-const */
import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis"; // Swapped out @vercel/kv for the native Upstash client

// Force Next.js to run this live and bypass any layout casing/caches
export const dynamic = "force-dynamic";

// 1. Төрөлжилтийг баталгаажуулах интерфэйс
interface Submission {
  id: string;
  name: string;
  score: number;
}

// Локал орчинд зориулсан Бэкап (Fallback) санах ой
let localSubmissionsBackup: Submission[] = [];

// Explicitly initialize Redis with your custom environment variable names
const kv = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

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
  console.log("Checking credentials connection status...");
  console.log("URL status:", !!process.env.UPSTASH_REDIS_REST_URL);
  console.log("TOKEN status:", !!process.env.UPSTASH_REDIS_REST_TOKEN);
  return !!(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
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
    console.log("IS KV AVAILABLE:", isKvAvailable);

    if (isKvAvailable) {
      try {
        // Fetch existing logs from Upstash Redis
        submissions = (await kv.get<Submission[]>("quiz_submissions")) || [];
        submissions.push(newSubmission);
        // Write back updated list
        await kv.set("quiz_submissions", submissions);
        console.log("✅ Successfully saved to Upstash Database!");
      } catch (kvError) {
        console.error(
          "⚠️ KV руу бичихэд алдаа гарлаа, локал руу шилжлээ:",
          kvError,
        );
        localSubmissionsBackup.push(newSubmission);
        submissions = [...localSubmissionsBackup];
      }
    } else {
      console.log("⚠️ Credentials missing. Saving to server memory instead.");
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

// 4. DELETE: Wipe all logs out of database
export async function DELETE() {
  try {
    await kv.del("quiz_submissions");
    localSubmissionsBackup = [];

    return NextResponse.json(
      { message: "Лидэрбоард амжилттай цэвэрлэгдлээ!" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Устгахад алдаа гарлаа", details: error.message },
      { status: 500 },
    );
  }
}
