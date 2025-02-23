"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { setCookie, destroyCookie, parseCookies } from "nookies";

export default function Login() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // ✅ 모달 상태
  const [popupMessage, setPopupMessage] = useState(""); // ✅ 모달 메시지

  // ✅ JWT 토큰 검증 함수
  const validateToken = async () => {
    try {
      const cookies = parseCookies();
      const token = cookies.token;

      if (!token) {
        console.warn("⚠️ 토큰 없음, 로그인 페이지로 이동");
        setIsLoggedIn(false);
        return; // ❗ 여기서 router.push("/login")을 실행하지 않음
      }

      console.log("🔍 서버에 토큰 검증 요청:", token);
      const response = await fetch("http://localhost:5001/api/auth/validateToken", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });

      if (!response.ok) {
        console.warn("❌ 유효하지 않은 토큰, 로그아웃 처리");
        destroyCookie(null, "token");
        setIsLoggedIn(false);
        return; // ❗ 여기서 router.push("/login")을 실행하지 않음
      }

      console.log("✅ 유효한 토큰 확인됨");
      setIsLoggedIn(true);
    } catch (error) {
      console.error("❌ 토큰 검증 실패:", error);
      setIsLoggedIn(false);
    }
  };

  // ✅ Google 로그인 → 백엔드에서 JWT 발급 요청
const handleLogin = async () => {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" }); // ✅ 항상 계정 선택 창 띄우기
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // ✅ 관리자 이메일 목록 확인 (env에서 가져오기)
    const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "").split(",");

    if (!adminEmails.includes(user.email)) {
      console.warn("⚠️ 관리자 계정이 아니므로 로그인 불가:", user.email);
      await signOut(auth); // ✅ 로그인된 계정 로그아웃 처리
      setPopupMessage("관리자 계정이 아닙니다. 접근이 제한됩니다.");
      setShowPopup(true); // ✅ 모달 표시
      return; // ✅ 로그인 절차 중단
    }

    // ✅ JWT 토큰 요청 (백엔드)
    const response = await fetch("http://localhost:5001/api/auth/generateToken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email }),
    });

    const data = await response.json();
    if (response.ok) {
      setCookie(null, "token", data.token, { path: "/", maxAge: 3600 });
      setIsLoggedIn(true);
      setAccessDenied(false);
      router.push("/");
    } else {
      console.error("토큰 요청 실패:", data.error);
    }
  } catch (error) {
    if (error.code === "auth/cancelled-popup-request" || error.code === "auth/popup-closed-by-user") {
      console.warn("⚠️ 로그인 팝업이 취소되었습니다. (무시 가능)");
      return;
    }
    console.error("❌ 로그인 실패:", error);
  }
};  

  // ✅ 로그아웃
  const handleLogout = async () => {
    await signOut(auth);
    destroyCookie(null, "token");
    setIsLoggedIn(false);
    console.log("✅ 로그아웃 완료");
    router.push("/login");
  };

  // ✅ 페이지 로드시 JWT 토큰 검증 실행
  useEffect(() => {
    validateToken();
  }, []);

  // ✅ 로그인되지 않았고, 토큰이 없으면 /login으로 이동
  useEffect(() => {
    const cookies = parseCookies();
    if (!cookies.token && !isLoggedIn) {
      console.warn("🚨 로그인되지 않음, /login으로 이동");
      router.push("/login");
    }
  }, [isLoggedIn]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      {/* 🔥 로그인 제한 모달 */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold text-red-600">🚫 로그인 제한</h2>
            <p className="text-gray-700 mt-2">{popupMessage}</p>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              확인
            </button>
          </div>
        </div>
      )}
  
      {/* 기존 UI */}
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
