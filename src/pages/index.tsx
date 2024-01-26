import IOSAnagramCheats from "@/components/IOSAnagramCheats";

export default function Home() {
  return (
    <main
      className={`flex flex-col items-center justify-between p-16`}
    >
      <h1 className="text-6xl mb-12 text-white font-bold text-center">iOS Anagram Cheats</h1>
      <IOSAnagramCheats />
    </main>
  );
}
