"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path); // 클릭한 버튼에 따라 해당 경로로 이동
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-4xl font-bold flex items-center gap-2">
        ☕ AI Blue Team 커피 구매 기록
      </h1>
      <p className="text-lg text-gray-600 mt-2">
        커피 구매 기록을 관리하고, 공정하게 순번을 정하는 웹앱입니다.
      </p>
      
      {/* 버튼 추가 */}
      <div className="mt-6 flex gap-4">
        <button 
          onClick= {() => handleNavigation("/users")}

          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md">
          커피 구매하기
        </button>
        <button
          onClick= {() => handleNavigation("/records")}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-lg shadow-md">
          구매 기록 보기
        </button>
      </div>
    </div>
  );
}
