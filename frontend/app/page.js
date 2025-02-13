"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { destroyCookie } from "nookies";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [autoLogin, setAutoLogin] = useState(false);

  const adminEmails = (process?.env?.NEXT_PUBLIC_ADMIN_EMAILS ?? "").split(",");
  const isAdmin = user?.email && adminEmails.includes(user.email);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        destroyCookie(null, "token");
        router.push("/login");
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogin = () => {
    if (autoLogin) return;
    setAutoLogin(true);
    router.push("/login");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      destroyCookie(null, "token");
      router.push("/login");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">로딩 중...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-4xl font-bold">☕ AI Blue Team 커피 구매 기록</h1>
      {user && <p className="text-md text-gray-500 mt-4">현재 로그인 계정: {user.email}</p>}
      {!isAdmin && (
        <div className="mt-6 flex gap-4">
          <button onClick={() => router.push("/users")} className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md">커피 구매하기</button>
          <button onClick={() => router.push("/records")} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg shadow-md">구매 기록 보기</button>
        </div>
      )}
      <button onClick={handleLogout} className="mt-6 bg-red-500 text-white px-6 py-3 rounded-lg">로그아웃</button>
    </div>
  );
}
