"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { destroyCookie } from "nookies";

export default function Records() {
  const [records, setRecords] = useState([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null); // ✅ 삭제할 기록 저장
  const [showDeletePopup, setShowDeletePopup] = useState(false); // ✅ 삭제 팝업 표시 여부



  // ✅ 토큰 검사 (유효하지 않으면 로그인 페이지로 이동)
  useLayoutEffect(() => {
    async function checkToken() {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      console.log("📌 API 요청에 사용된 토큰:", token);
  
      if (!token) {
        console.warn("🚨 토큰 없음 → 로그아웃 처리");
        destroyCookie(null, "token");
        router.push("/login");
        return;
      }
      

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/validateToken`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        });
        const data = await res.json();
        console.log("📌 백엔드 검증 응답:", data);
  
        if (!data || !data.valid) {
          console.warn("🚨 유효하지 않은 토큰 → 로그아웃 처리");
          destroyCookie(null, "token");
          router.push("/login");
        }
        else{
          setLoading(false);
        }
      } catch (error) {
        console.error("❌ 토큰 검증 실패:", error);
        destroyCookie(null, "token");
        router.push("/login");
      }
    }
  
    checkToken();
  }, [router]);
  



  // API에서 구매 기록 불러오기
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/coffee/list`);
        const data = await res.json();
        setRecords(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecords();
  }, []);


  // ✅ 삭제 요청 실행
  const handleConfirmDelete = async () => {
    if (!selectedRecord) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/coffee/${selectedRecord._id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("기록 삭제 실패");

      setRecords(records.filter((record) => record._id !== selectedRecord._id));
      setShowDeletePopup(false); // ✅ 삭제 후 팝업 닫기
      setSelectedRecord(null);
    } catch (err) {
      console.error("커피 기록 삭제 오류:", err);
    }
  };

  // ✅ 삭제 버튼 클릭 시 팝업 표시
  const handleDeleteClick = (record) => {
    setSelectedRecord(record);
    setShowDeletePopup(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-bold text-gray-600">🔄 인증 확인 중...</p>
      </div>
    );
  }

  //---------------Return----------------
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800">
      <h1 className="text-3xl font-bold">☕ 커피 구매 기록</h1>
      <p className="text-gray-600 mt-2">이 페이지에서 커피 구매 기록을 확인할 수 있습니다.</p>

      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => router.push("/")}
        className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md"
      >
        홈으로 돌아가기
      </button>

      {/* ✅ 커피 구매 기록 출력 */}
      <ul className="mt-6 w-full max-w-md">
        {records.length > 0 ? (
          records.map((record) => (
            <li key={record._id} className="p-3 border-b border-gray-300 flex justify-between items-center">
              <span>{record.userName} 님이 {new Date(record.date).toLocaleDateString()} 에 결제하셨습니다.</span>
              <button
                onClick={() => handleDeleteClick(record)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                삭제
              </button>
            </li>
          ))
        ) : (
          <p className="text-gray-500">저장된 기록이 없습니다.</p>
        )}
      </ul>


      {/* ✅ 삭제 확인 팝업 */}
      {showDeletePopup && selectedRecord && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-lg font-semibold mb-4">
              <strong>{selectedRecord.userId?.name}</strong> 님의 결제 기록을 삭제하시겠습니까?
            </p>

            <div className="flex justify-center gap-4">
              {/* ✅ 확인 버튼 */}
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                삭제
              </button>

              {/* ✅ 취소 버튼 */}
              <button
                onClick={() => setShowDeletePopup(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
