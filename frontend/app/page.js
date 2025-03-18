"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { destroyCookie, parseCookies } from "nookies";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null); // ✅ 초기값을 null로 설정

  // ✅ 자동 로그인 유지 및 토큰 검증 추가
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        console.warn("⚠️ 로그인 정보 없음, 로그아웃 처리");
        destroyCookie(null, "token");
        router.push("/login");
        return;
      }

      // ✅ 서버에서 토큰 검증 요청
      try {
        const cookies = parseCookies();
        const token = cookies.token;

        if (!token) {
          console.warn("⚠️ 토큰 없음, 로그아웃 처리");
          destroyCookie(null, "token");
          router.push("/login");
          return;
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/validateToken`, {
          method: "GET",
          headers: { 
            "Content-Type": "application/json",
            "auth-token": token,
          },
        });

        if (!response.ok) {
          console.warn("⚠️ 유효하지 않은 토큰, 로그아웃 처리");
          destroyCookie(null, "token");
          router.push("/login");
          return;
        }

        console.log("✅ 유효한 토큰 확인됨");
        setUser(currentUser);
      } catch (error) {
        console.error("❌ 토큰 검증 실패:", error);
        destroyCookie(null, "token");
        router.push("/login");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // ✅ `user` 값이 업데이트될 때마다 `isAdmin` 상태 업데이트
  useEffect(() => {
    if (user?.email) {
      const adminEmails = (process?.env?.NEXT_PUBLIC_ADMIN_EMAILS ?? "").split(",");
      console.log("🔍 Admin Emails (배포 환경):", adminEmails);
      console.log("🔍 Current User Email:", user.email);
      
      const isAdminUser = adminEmails.includes(user.email);
      console.log("🔍 isAdmin 상태:", isAdminUser);
  
      setIsAdmin(isAdminUser);
    }
  }, [user]);
  


  // ✅ 로그아웃 함수
  const handleLogout = async () => {
    try {
      await signOut(auth);
      destroyCookie(null, "token");
      console.log("✅ 로그아웃 완료, 새로고침");
      window.location.reload(); // 🚀 즉시 로그아웃 반영
    } catch (error) {
      console.error("❌ 로그아웃 실패:", error);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">로딩 중...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-4xl font-bold">☕ AI Blue Team 커피 구매 기록</h1>
      {user && <p className="text-md text-gray-500 mt-4">현재 로그인 계정: {user.email}</p>}

      {/* ✅ `user`가 설정될 때까지 버튼이 렌더링되지 않도록 수정 */}
      {/* {user && !isAdmin && (
        <div className="mt-6 flex gap-4">
          <button onClick={() => router.push("/users")} className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md">
            커피 구매하기
          </button>
          <button onClick={() => router.push("/records")} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg shadow-md">
            구매 기록 보기
          </button>
        </div>
      )} */}
      {/* ✅ 로딩이 끝나고, 유저가 존재하며, 관리자가 아닐 때만 버튼 표시 */}
      {user && (
      <div className="mt-6 flex gap-4">
        <button onClick={() => router.push("/users")} className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md">
          커피 구매하기
        </button>
        <button onClick={() => router.push("/records")} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg shadow-md">
          구매 기록 보기
        </button>
      </div>
    )}



      <button onClick={handleLogout} className="mt-6 bg-red-500 text-white px-6 py-3 rounded-lg">로그아웃</button>
    </div>
  );
}
