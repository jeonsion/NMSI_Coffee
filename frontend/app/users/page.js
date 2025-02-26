"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { destroyCookie } from "nookies";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null); // ✅ 삭제용
  const [popupMessage, setPopupMessage] = useState(""); // ✅ 팝업 메시지 관리
  const [paymentSuccess, setPaymentSuccess] = useState(false); // ✅ 결제 성공 여부
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
  
  


  // ✅ API에서 사용자 목록 불러오기
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`);
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("사용자 목록 불러오기 오류:", err);
      }
    };

    fetchUsers();
  }, []);

  const isValidName = (name) => /^[A-Za-z가-힣\s]+$/.test(name);


  // ✅ 새로운 사용자 추가하기
  const handleAddUser = async () => {
    if (!name.trim()) {
      setPopupMessage("이름을 입력하세요!"); // ✅ 팝업 메시지 설정
      return;
    }

    if (!isValidName(name)) {
      setPopupMessage(
        <>
          올바른 이름을 입력하세요! (한글 또는 영어만 가능)
          <br />
          ex) "이순신", "Kim Minseok"
        </>
      );
            return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error("사용자 추가 실패");

      const newUser = await res.json();
      setUsers([...users, newUser]); // ✅ 새 사용자 목록에 추가
      setName(""); // 입력 필드 초기화
    } catch (err) {
      console.error("사용자 추가 오류:", err);
      setPopupMessage("사용자 추가 중 오류가 발생했습니다.");
    }
  };
  
  // ✅ 사용자 삭제
  const handleDeleteUser = async (userId) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("사용자 삭제 실패");

      setUsers(users.filter((user) => user._id !== userId)); // ✅ UI에서 즉시 삭제
      setShowDeletePopup(false); // ✅ 삭제 후 팝업 닫기
      setSelectedRecord(null);
    } catch (err) {
      console.error("사용자 삭제 오류:", err);
    }
  };

  const handleDeleteClick = (user) => {
    setSelectedRecord(user); // ✅ 삭제할 사용자 정보 저장
    setShowDeletePopup(true); // ✅ 팝업 표시
  };


  // ✅ 삭제 요청 실행
  const handleConfirmDelete = async () => {
    if (!selectedRecord || !selectedRecord._id) {
      console.error("❌ 삭제할 사용자 ID가 없습니다.");
      return;
    }
  
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/users/${selectedRecord._id}`;
      console.log("📌 삭제 요청 URL:", apiUrl);
  
      const res = await fetch(apiUrl, { method: "DELETE" });
  
      console.log("📌 서버 응답 상태 코드:", res.status);
  
      if (!res.ok) throw new Error("사용자 삭제 실패");
  
      setUsers(users.filter((user) => user._id !== selectedRecord._id));
      setShowDeletePopup(false);
      setSelectedRecord(null);
    } catch (err) {
      console.error("❌ 사용자 삭제 오류:", err);
    }
  };
    
  
  
    // ✅ 결제 기록 추가 (중복 검사 포함)
    const handleConfirmPayment = async () => {
      if (!selectedUser) return console.error("❌ 오류: 선택된 사용자가 없습니다!");
  
      console.log("✅ 결제 요청 시작 - 사용자 ID:", selectedUser._id);
  
      try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/coffee`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId: selectedUser._id }),
          });
  
          console.log("✅ 응답 상태 코드:", res.status);
  
          const data = await res.json();
          console.log("✅ 응답 데이터:", data);
  
          if (!res.ok) {
              setPopupMessage("❌ 오늘 이미 결제한 사람이 있습니다!");
              setPaymentSuccess(false);
              return;
          }
  
          setPopupMessage(`✅ ${selectedUser.name} 님이 결제자로 등록되었습니다!`);
          setPaymentSuccess(true);
      } catch (err) {
          console.error("❌ 결제 기록 추가 오류:", err);
      }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-bold text-gray-600">🔄 인증 확인 중...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800">
      <h1 className="text-3xl font-bold">👥 사용자 목록</h1>

      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => router.push("/")}
        className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md"
      >
        홈으로 돌아가기
      </button>

      {/* ✅ 사용자 목록 출력 + 선택 및 삭제 버튼 추가 */}
      <ul className="mt-6 w-full max-w-md">
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user._id} className="p-3 border-b border-gray-300 flex justify-between items-center">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedUser(user)
                    setPopupMessage(""); // ✅ 팝업 메시지 초기화
                    setPaymentSuccess(false); // ✅ 성공 상태 초기화
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                >
                  선택
                </button>
                <span>{user.name}</span>
              </div>
              <button
                onClick={() => handleDeleteClick(user)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                삭제
              </button>
            </li>
          ))
        ) : (
          <p className="text-gray-500">등록된 사용자가 없습니다.</p>
        )}
      </ul>

      {/* ✅ 사용자 추가 입력 폼 */}
      <div className="mt-6 flex">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름 입력"
          className="border border-gray-400 p-2 rounded-md mr-2"
        />
        <button
          onClick={handleAddUser}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md"
        >
          추가하기
        </button>
      </div>

      {/* ✅ 결제 확인 팝업 */}
      {selectedUser && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className={`text-lg font-semibold mb-4 ${paymentSuccess ? "text-green-600" : "text-black"}`}>
              {popupMessage || `${selectedUser.name} 님이 오늘 커피를 결제했습니까?`}
            </p>

            {/* ✅ 결제 성공 또는 중복 결제 시 "확인" 버튼 비활성화 */}
            {!paymentSuccess && popupMessage === "" && (
              <button
                onClick={handleConfirmPayment}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mr-3"
              >
                확인
              </button>
            )}

            {/* ✅ 구매내역 보기 버튼 (결제 성공 또는 이미 결제된 경우에만 표시) */}
            {popupMessage && (
              <button
                onClick={() => router.push("/records")}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mr-3"
              >
                구매내역 보기
              </button>
            )}

            {/* ✅ 닫기 버튼 (결제 성공 후에도 표시) */}
            <button
              onClick={() => {
                setSelectedUser(null);
                setPopupMessage(""); // ✅ 팝업 메시지 초기화
              }}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
            >
              닫기
            </button>
          </div>
        </div>
      )}

    {/* ✅ 삭제 확인 팝업 */}
    {showDeletePopup && selectedRecord && (
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-lg font-semibold mb-4">
            <strong>{selectedRecord.name}</strong> 님을 삭제하시겠습니까?
          </p>

          <div className="flex justify-center gap-4">
            {/* ✅ 삭제 버튼 */}
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

  {/* ✅ 일반 메시지 팝업 (이름 입력, 오류 메시지 등) */}
  {popupMessage && !selectedUser && !showDeletePopup && (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-lg font-semibold mb-4">{popupMessage}</p>

        {/* ✅ 닫기 버튼 */}
        <button
          onClick={() => setPopupMessage("")} // ✅ 팝업 닫기
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
        >
          닫기
        </button>
      </div>
    </div>
  )}



    </div>    
  );
}
