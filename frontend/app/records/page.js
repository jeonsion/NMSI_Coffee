"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Records() {
  const [records, setRecords] = useState([]);
  const router = useRouter();

  // API에서 구매 기록 불러오기
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/coffee", {
          cache: "no-store", // 최신 데이터 유지
        });
        if (!res.ok) throw new Error("데이터를 불러오지 못했습니다.");
        const data = await res.json();
        setRecords(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRecords();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800">
      <h1 className="text-3xl font-bold">☕ 커피 구매 기록</h1>
      <p className="text-gray-600 mt-2">이 페이지에서 커피 구매 기록을 확인할 수 있습니다.</p>

      {/* 구매 기록 목록 */}
      <ul className="mt-6 w-full max-w-md">
        {records.length > 0 ? (
          records.map((record) => (
            <li key={record._id} className="p-3 border-b border-gray-300">
              {record.userId?.name || "알 수 없음"} 님이 {new Date(record.date).toLocaleDateString()}에 커피를 샀습니다.
            </li>
          ))
        ) : (
          <p className="text-gray-500">구매 기록이 없습니다.</p>
        )}
      </ul>

      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => router.push("/")}
        className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md"
      >
        홈으로 돌아가기
      </button>
    </div>
  );
}
