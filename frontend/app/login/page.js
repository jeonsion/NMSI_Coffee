"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import { setCookie, destroyCookie } from "nookies";

export default function Login() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const adminEmails = new Set((process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "").split(","));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsLoggedIn(false);
        destroyCookie(null, "token");
        return;
      }
      setIsLoggedIn(true);
      if (!hasChecked) {
        setHasChecked(true);
        const userIsAdmin = adminEmails.has(user.email);
        setIsAdmin(userIsAdmin);
        setAccessDenied(!userIsAdmin);
        if (userIsAdmin) {
          const token = await user.getIdToken();
          setCookie(null, "token", token, { path: "/", maxAge: 3600 });
          router.replace("/");
        }
      }
    });
    return () => unsubscribe();
  }, [router, adminEmails, hasChecked]);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
    } catch (error) {
        if (error.code !== "auth/cancelled-popup-request" && error.code !== "auth/popup-closed-by-user") {
            console.error("로그인 실패:", error);
          }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      destroyCookie(null, "token");
      setIsLoggedIn(false);
      router.push("/login");
      window.location.reload(); // 로그아웃 후 새로고침 추가

    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  if (accessDenied) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 font-bold mb-4">액세스 권한이 없습니다</p>
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-3xl font-bold">Google 로그인</h1>
      {!isLoggedIn ? (
        <button onClick={handleLogin} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-4">
          로그인
        </button>
      ) : (
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mt-2">
          로그아웃
        </button>
      )}
    </div>
  );
}
