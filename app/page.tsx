"use client";

import React, { useState, useEffect } from "react";
import Leaderboard from "./components/Leaderboard";

// 30 асуултын сан
const questionsData = [
  // === JAVASCRIPT (1-10) ===
  {
    id: 1,
    category: "JavaScript",
    question: "JavaScript дээр 'NaN' гэж юу гэсэн үг вэ?",
    options: [
      "Not a Number",
      "Null and Null",
      "New Absolute Number",
      "None of the above",
    ],
    answer: 0,
  },
  {
    id: 2,
    category: "JavaScript",
    question: "Дараах кодын үр дүн юу байх вэ? console.log(2 + '2' - 1);",
    options: ["21", "3", "22", "NaN"],
    answer: 0,
  },
  {
    id: 3,
    category: "JavaScript",
    question: "typeof [] үйлдлийн үр дүн юу гарах вэ?",
    options: ["array", "object", "null", "undefined"],
    answer: 1,
  },
  {
    id: 4,
    category: "JavaScript",
    question: "=== болон == операторуудын гол ялгаа юу вэ?",
    options: [
      "=== нь зөвхөн утгыг харьцуулна",
      "=== нь утга болон өгөгдлийн төрлийг хоёуланг нь харьцуулна",
      "== нь илүү хурдан ажилладаг",
      "Ямар ч ялгаа байхгүй",
    ],
    answer: 1,
  },
  {
    id: 5,
    category: "JavaScript",
    question: "Дараах аргуудын аль нь array-ийн төгсгөлд элемент нэмдэг вэ?",
    options: ["pop()", "shift()", "push()", "unshift()"],
    answer: 2,
  },
  {
    id: 6,
    category: "JavaScript",
    question: "Дараах кодын үр дүн юу байх вэ? console.log([] == ![]);",
    options: ["true", "false", "undefined", "SyntaxError"],
    answer: 0,
  },
  {
    id: 7,
    category: "JavaScript",
    question: "Promise-ийн боломжит 3 төлөв аль нь вэ?",
    options: [
      "pending, fulfilled, rejected",
      "start, processing, end",
      "waiting, success, fail",
      "ready, active, paused",
    ],
    answer: 0,
  },
  {
    id: 8,
    category: "JavaScript",
    question:
      "Array-ийн бүх элементийг нэг утга руу хөрвүүлэн хураангуйлахад аль аргыг ашигладаг вэ?",
    options: ["map()", "filter()", "reduce()", "forEach()"],
    answer: 2,
  },
  {
    id: 9,
    category: "JavaScript",
    question:
      "Хоёр нөхцөл хоёулаа үнэн (true) байхыг шалгах логик оператор аль нь вэ?",
    options: ["||", "!", "&&", "++"],
    answer: 2,
  },
  {
    id: 10,
    category: "JavaScript",
    question:
      "Asynchronous кодыг synchronous мэт бичихэд аль түлхүүр үгсийг хамт ашигладаг вэ?",
    options: ["then / catch", "try / catch", "async / await", "get / post"],
    answer: 2,
  },
  {
    id: 11,
    category: "React",
    question:
      "React дээр Component-ийн төлөвийг (state) хадгалахад аль Hook-ийг ашигладаг вэ?",
    options: ["useEffect", "useState", "useContext", "useReducer"],
    answer: 1,
  },
  {
    id: 12,
    category: "React",
    question: "React дээр Click үйлдлийг хэрхэн зөв сонсож бичих вэ?",
    options: [
      "onclick={handleClick}",
      'onClick="handleClick()"',
      "onClick={handleClick}",
      'onclick="handleClick()"',
    ],
    answer: 2,
  },
  {
    id: 13,
    category: "React",
    question:
      "Component анх ачаалагдах үед ямар нэг код ажиллуулах бол useEffect-ийн dependency array-д юу бичих вэ?",
    options: [
      "null",
      "Утга бичихгүй хоосон үлдээх [ ]",
      "[stateName]",
      "Array бичих шаардлагагүй",
    ],
    answer: 1,
  },
  {
    id: 14,
    category: "React",
    question: "React-д 'props' гэж юу вэ?",
    options: [
      "Дээд (parent) компонентоос доод (child) компонент руу дамжуулж буй өгөгдөл",
      "Компонентийн дотоод өөрчлөгддөг төлөв",
      "Нэг төрлийн глобал хувьсагч",
      "Зөвхөн функц дуудах комманд",
    ],
    answer: 0,
  },
  {
    id: 15,
    category: "React",
    question:
      "Array ашиглан олон элемент зурах үед 'key' prop өгөхгүй бол юу болох вэ?",
    options: [
      "Аппликэйшн шууд гацна",
      "React warning өгөх ба performance-д муугаар нөлөөлнө",
      "Элементүүд огт харагдахгүй",
      "CSS загвар алдагдана",
    ],
    answer: 1,
  },
  {
    id: 16,
    category: "React",
    question: "React-д Context API-ийг голчлон юунд ашигладаг вэ?",
    options: [
      "Хурдан хуудас шилжихэд",
      "Prop drilling-ээс зайлсхийж, глобал төлөвийг удирдах хуваалцахад",
      "Анимаци оруулахад",
      "Арын албаны API-тай холбогдоход",
    ],
    answer: 1,
  },
  {
    id: 17,
    category: "React",
    question:
      "Нөхцөл үнэн (true) байвал компунентыг харуулах хамгийн богино бичиглэл аль нь вэ?",
    options: [
      "condition && <Component/>",
      "condition ? <Component/>",
      "if (condition) <Component/>",
      "condition || <Component/>",
    ],
    answer: 0,
  },
  {
    id: 18,
    category: "React",
    question: "useState-ийн утгыг хэрхэн зөв шинэчилдэг вэ?",
    options: [
      "state = new_value",
      "Шинэчлэх функцээр (setState) дамжуулж",
      "forceUpdate() ашиглаж",
      "Шууд утга оноож",
    ],
    answer: 1,
  },
  {
    id: 19,
    category: "React",
    question: "React-д 'StrictMode' ямар үүрэгтэй вэ?",
    options: [
      "Кодыг автоматаар форматлах",
      "Аппликэйшний болзошгүй алдаа, хуучирсан функцуудыг илрүүлэхэд туслах",
      "Хэрэглэгчийн нууц үгийг шалгах",
      "Аппликэйшнийг production горимд шилжүүлэх",
    ],
    answer: 1,
  },
  {
    id: 20,
    category: "React",
    question: "Аль нь зөв JSX бичиглэл вэ?",
    options: [
      "<div class='box'>",
      "<div className='box'>",
      "<div classname='box'>",
      "<div ComponentClass='box'>",
    ],
    answer: 1,
  },
  {
    id: 21,
    category: "API",
    question: "HTTP 404 статус код ямар утгатай вэ?",
    options: ["Internal Server Error", "Unauthorized", "Not Found", "Success"],
    answer: 2,
  },
  {
    id: 22,
    category: "API",
    question:
      "REST API-д шинэ өгөгдөл үүсгэхэд ихэвчлэн аль HTTP аргыг (method) ашигладаг вэ?",
    options: ["GET", "POST", "PUT", "DELETE"],
    answer: 1,
  },
  {
    id: 23,
    category: "API",
    question: "HTTP статус кодуудын 5xx ангилал юуг илэрхийлдэг вэ?",
    options: [
      "Амжилттай болсон хүсэлтүүд",
      "Хэрэглэгч (Client) талын алдаа",
      "Сүлжээний шилжилт",
      "Сервер (Server) талын алдаа",
    ],
    answer: 3,
  },
  {
    id: 24,
    category: "API",
    question:
      "Браузер өөр домэйноос нөөц хүсэх үед аюулгүй байдлыг хангах ямар механизм ажилладаг вэ?",
    options: ["CORS", "JWT", "HTTPS", "SSH"],
    answer: 0,
  },
  {
    id: 25,
    category: "API",
    question:
      "Вэбд нэвтэрсэн хэрэглэгчийг баталгаажуулахад өргөн ашиглагддаг token-д суурилсан технологи аль нь вэ?",
    options: ["JSON", "JWT", "AJAX", "HTML5"],
    answer: 1,
  },
  {
    id: 26,
    category: "API",
    question: "HTTP 201 статус код юуг илэрхийлдэг вэ?",
    options: [
      "OK (Амжилттай)",
      "Created (Амжилттай үүсгэгдлээ)",
      "Bad Request",
      "No Content",
    ],
    answer: 1,
  },
  {
    id: 27,
    category: "API",
    question:
      "Нууц үг, API түлхүүр зэрэг эмзэг мэдээллийг хаана хадгалах нь хамгийн аюулгүй вэ?",
    options: [
      ".js файл дотор",
      ".env файл дотор",
      "HTML файл дотор",
      "README файл дотор",
    ],
    answer: 1,
  },
  {
    id: 28,
    category: "API",
    question:
      "Браузер дээр API-аас өгөгдөл татахад ашигладаг native JavaScript функц аль нь вэ?",
    options: ["axios()", "fetch()", "getAjax()", "request()"],
    answer: 1,
  },
  {
    id: 29,
    category: "API",
    question: "JSON гэж юу гэсэн үг вэ?",
    options: [
      "JavaScript Object Notation",
      "Java Sync Online Network",
      "JavaScript Output Node",
      "Joint Selected Object Number",
    ],
    answer: 0,
  },
  {
    id: 30,
    category: "API",
    question:
      "HTTP Header-ийн 'Content-Type: application/json' ямар үүрэгтэй вэ?",
    options: [
      "Хүсэлтийн хурдыг тохируулна",
      "Дамжуулж буй өгөгдлийн хэлбэр нь JSON гэдгийг серверт мэдэгдэнэ",
      "Хэрэглэгчийг нэвтрүүлнэ",
      "Өгөгдлийг шифрлэнэ",
    ],
    answer: 1,
  },
];

interface Team {
  name: string;
  color: string;
  border: string;
}

interface BackendResult {
  team: Team;
  rank: number;
  totalParticipants: number;
  isCaptain: boolean;
}

function App() {
  const [userName, setUserName] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [activeUsers, setActiveUsers] = useState(0);
  const [backendResult, setBackendResult] = useState<BackendResult | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Лайв хэрэглэгчдийн тоог авах
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/quiz");
        if (res.ok) {
          const data = await res.json();
          setActiveUsers(data.activeUsers);
        }
      } catch (e) {
        console.error("Stats error:", e);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    setAnswers({ ...answers, [questionId]: optionIdx });
  };

  const handleNext = () => {
    if (currentIdx < questionsData.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const calculateScore = () => {
    let score = 0;
    questionsData.forEach((q) => {
      if (answers[q.id] === q.answer) {
        score++;
      }
    });
    return score;
  };

  const handleFinish = async () => {
    setLoading(true);
    setSubmitError(null);
    const finalScore = calculateScore();

    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userName, score: finalScore }),
      });

      if (res.ok) {
        const data = await res.json();
        setBackendResult(data);
        // Дата бааз руу амжилттай хадгалагдсаны дараа л үр дүнгийн хуудсыг нээнэ
        setShowResult(true);
      } else {
        // Хэрэв сервер 500 эсвэл өөр алдаа өгвөл
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Сервер датаг хүлээж авсангүй.");
      }
    } catch (err: any) {
      console.error("API Error:", err);
      setSubmitError(
        "Үр дүнг хадгалахад алдаа гарлаа. Таны оноо харагдах боловч багт хуваарилагдах боломжгүй байна.",
      );
      // Алдаа гарсан ч гэсэн хэрэглэгчид өөрийнх нь оноог харуулахын тулд үр дүнгийн хуудсыг нээнэ
      setShowResult(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentIdx(0);
    setShowResult(false);
    setIsStarted(false);
    setUserName("");
    setBackendResult(null);
  };

  const currentQuestion = questionsData[currentIdx];
  const totalQuestions = questionsData.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = ((answeredCount / totalQuestions) * 100).toFixed(0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-8 flex flex-col items-center">
      {/* Толгой хэсэг */}
      <header className="w-full max-w-5xl my-4 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Full-Stack Dev Assessment
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          JS, React, API, Node.js & Middleware • {activeUsers} хүн лайв байна
        </p>
      </header>

      {/* Grid Бүтэц: Дэлгэц том үед 2 багана, тест эхэлбэл бүтэн дэлгэц */}
      <div
        className={`w-full max-w-5xl grid grid-cols-1 ${!isStarted ? "md:grid-cols-2" : "md:grid-cols-1"} gap-8 items-start mt-6`}
      >
        {/* ЗҮҮН ТАЛ / ҮНДСЭН КАРД (Асуулт ба Тест өгөх хэсэг) */}
        <main className="w-full bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-2xl transition-all duration-300">
          {!isStarted ? (
            <div className="py-10 text-center">
              <h2 className="text-xl font-semibold mb-3 text-slate-200">
                Шалгалт эхлэхээс өмнө нэрээ оруулна уу
              </h2>
              <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto">
                Тест нийт 30 асуулттай. Таны онооноос хамаарч тэнцвэржүүлэн
                багуудад автоматаар хуваарилна.
              </p>
              <div className="flex flex-col items-center gap-4">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Таны бүтэн нэр..."
                  className="w-full max-w-xs px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 outline-none transition-all text-white"
                />
                <button
                  disabled={!userName.trim()}
                  onClick={() => setIsStarted(true)}
                  className="w-full max-w-xs py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 font-bold transition-all disabled:opacity-30 disabled:pointer-events-none shadow-lg shadow-cyan-950/20"
                >
                  Шалгалтыг эхлүүлэх
                </button>
              </div>
            </div>
          ) : !showResult ? (
            <div>
              {/* Төлөв болон Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <span>
                    {userName} • {currentQuestion.category}
                  </span>
                  <span>
                    Асуулт {currentIdx + 1} / {totalQuestions}
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300"
                    style={{
                      width: `${((currentIdx + 1) / totalQuestions) * 100}%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-slate-500 text-xs mt-1">
                  <span>Хариулсан: {answeredCount}</span>
                  <span>Гүйцэтгэл: {progressPercent}%</span>
                </div>
              </div>

              {/* Асуулт */}
              <div className="mb-8 min-h-[70px]">
                <h2 className="text-lg md:text-xl font-medium leading-relaxed text-slate-100">
                  {currentQuestion.id}. {currentQuestion.question}
                </h2>
              </div>

              {/* Хариултууд */}
              <div className="space-y-3 mb-8">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = answers[currentQuestion.id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() =>
                        handleSelectOption(currentQuestion.id, idx)
                      }
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between ${
                        isSelected
                          ? "border-cyan-500 bg-cyan-950/30 text-cyan-200 font-medium"
                          : "border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-800/50 text-slate-300"
                      }`}
                    >
                      <span className="pr-4">{option}</span>
                      <div
                        className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center ${isSelected ? "border-cyan-500 bg-cyan-500" : "border-slate-600"}`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-slate-950"></div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Товчлуурууд */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <button
                  onClick={handlePrev}
                  disabled={currentIdx === 0}
                  className="px-5 py-2.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-sm font-medium disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  Өмнөх
                </button>

                {currentIdx < totalQuestions - 1 ? (
                  <button
                    onClick={handleNext}
                    className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-medium border border-slate-700"
                  >
                    Дараах
                  </button>
                ) : (
                  <button
                    onClick={handleFinish}
                    className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-sm font-semibold shadow-lg shadow-emerald-950/20"
                  >
                    Тестийг дуусгах
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Үр дүн харах хэсэг */
            <div className="text-center py-4">
              <h2 className="text-2xl font-bold text-slate-100">
                Тестийн үр дүн
              </h2>

              {loading ? (
                <div className="my-6 animate-pulse text-cyan-500">
                  Багийг тооцоолж байна...
                </div>
              ) : (
                backendResult && (
                  <div
                    className={`my-4 p-6 rounded-2xl border-2 bg-slate-950/50 ${backendResult.team.border}`}
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">
                      Таны хуваарилагдсан баг:
                    </p>
                    <h3
                      className={`text-3xl font-black ${backendResult.team.color}`}
                    >
                      {backendResult.team.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2">
                      Та {backendResult.totalParticipants} хүнээс{" "}
                      {backendResult.rank}-р байранд орлоо.
                    </p>
                  </div>
                )
              )}

              {submitError && (
                <div className="my-4 p-4 rounded-xl bg-rose-950/30 border border-rose-500/50 text-rose-400 text-sm">
                  ⚠️ {submitError}
                </div>
              )}

              <div className="my-8 inline-block bg-slate-950/40 rounded-3xl p-8 border border-slate-800 min-w-[240px]">
                <span className="text-6xl font-extrabold text-cyan-400">
                  {calculateScore()}
                </span>
                <span className="text-slate-500 text-2xl">
                  {" "}
                  / {totalQuestions}
                </span>
                <p className="text-sm font-semibold text-slate-400 mt-2">
                  {((calculateScore() / totalQuestions) * 100).toFixed(1)}%
                  Амжилттай
                </p>
              </div>

              {/* Нарийвчилсан хариултын түүх */}
              <div className="text-left space-y-4 max-h-[400px] overflow-y-auto mb-8 pr-2 border-t border-b border-slate-800 py-4">
                <h3 className="font-semibold text-slate-300 text-lg mb-2 sticky top-0 bg-slate-900 pb-2">
                  Асуултуудын дүн:
                </h3>
                {questionsData.map((q, index) => {
                  const userAnswerIdx = answers[q.id];
                  const isCorrect = userAnswerIdx === q.answer;
                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-xl border ${isCorrect ? "border-emerald-950 bg-emerald-950/10" : "border-rose-950 bg-rose-950/10"}`}
                    >
                      <p className="font-medium text-slate-200 text-sm mb-2">
                        {index + 1}. {q.question}
                      </p>
                      <div className="text-xs space-y-1">
                        <p>
                          <span className="text-slate-400">Таны хариулт: </span>
                          <span
                            className={
                              isCorrect
                                ? "text-emerald-400 font-medium"
                                : "text-rose-400 font-medium"
                            }
                          >
                            {userAnswerIdx !== undefined
                              ? q.options[userAnswerIdx]
                              : "Хариулаагүй"}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p>
                            <span className="text-slate-400">
                              Зөв хариулт:{" "}
                            </span>
                            <span className="text-emerald-400 font-medium">
                              {q.options[q.answer]}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Буцах товчлуур */}
              <button
                onClick={handleReset}
                className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 font-medium transition duration-200 text-sm w-full sm:w-auto"
              >
                Дахин эхлэх
              </button>
            </div>
          )}
        </main>

        {/* БАРУУН ТАЛ: Нүүр хуудас дээр шууд харагдах Лидэрбоард */}
        {/* Хэрэглэгч тестээ эхлүүлээгүй үед л хажууд нь харагдана, эхэлмэгц дэлгэцээ чөлөөлнө */}
        {!isStarted && (
          <aside className="w-full">
            <Leaderboard />
          </aside>
        )}
      </div>
    </div>
  );
}

export default App;
