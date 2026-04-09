import Head from "next/head";
import { Geist, Geist_Mono } from "next/font/google";
import { useState, useEffect, useRef } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SPEEDS = [1, 2, 3, 4, 10];

export default function Home() {
  const [started, setStarted] = useState(false);
  const [count, setCount] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [autoScroll, setAutoScroll] = useState(true);
  const audioRef = useRef(null);
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!started || count >= 1000000) return;
    const timer = setTimeout(() => {
      setCount((c) => c + 1);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.playbackRate = speed;
        audioRef.current.play();
      }
    }, 1000 / speed);
    return () => clearTimeout(timer);
  }, [count, started, speed]);

  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [count, autoScroll]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
    setAutoScroll(atBottom);
  };

  const bucks = Array.from({ length: count }, (_, i) => `${i + 1}. buck`);

  return (
    <>
      <Head>
        <title>1 Million Bucks</title>
        <meta name="Creator" content="Aldin Sarac"></meta>
      </Head>
      <div
        className={`${geistSans.className} ${geistMono.className} flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black`}
      >
        <main className="flex h-screen w-full max-w-3xl flex-col gap-8 py-16 px-16 bg-white dark:bg-black">
          <audio ref={audioRef} src="/1mbucks/buck.mp3" />

          <h1 className="text-3xl font-semibold text-center text-black dark:text-white">
            1 Million Bucks
          </h1>

          <div className="flex justify-center gap-2 flex-shrink-0">
            {SPEEDS.map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  speed === s
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "border border-black/20 text-black hover:bg-black/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {!started ? (
            <div className="flex flex-1 items-center justify-center">
              <button
                onClick={() => setStarted(true)}
                className="rounded-full bg-black px-8 py-3 text-lg font-medium text-white dark:bg-white dark:text-black"
              >
                Start
              </button>
            </div>
          ) : (
            <div
              ref={containerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto"
            >
              <ul className="flex flex-col gap-2">
                {bucks.map((buck) => (
                  <li key={buck} className="text-lg text-black dark:text-zinc-50">
                    {buck}
                  </li>
                ))}
              </ul>
              <div ref={bottomRef} />
            </div>
          )}
        </main>
      </div>
    </>
  );
}