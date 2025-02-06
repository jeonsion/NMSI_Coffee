"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null); // ✅ 삭제용
  const [popupMessage, setPopupMessage] = useState(""); // ✅ 팝업 메시지 관리
  const [paymentSuccess, setPaymentSuccess] = useState(false); // ✅ 결제 성공 여부
  const [showDeletePopup, setShowDeletePopup] = useState(false); // ✅ 삭제 팝업 표시 여부


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

  // ✅ 새로운 사용자 추가하기
  const handleAddUser = async () => {
    if (!name.trim()) return alert("이름을 입력하세요!");

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
    if (!selectedRecord) return;
  
    console.log("삭제 요청하는 ID:", selectedRecord._id); // ✅ 디버깅용 로그
  
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${selectedRecord._id}`, {
        method: "DELETE",
      });
  
      console.log("서버 응답 상태 코드:", res.status); // ✅ 응답 상태 코드 출력
  
      if (!res.ok) throw new Error("사용자 삭제 실패");
  
      setUsers(users.filter((user) => user._id !== selectedRecord._id));
      setShowDeletePopup(false);
      setSelectedRecord(null);
    } catch (err) {
      console.error("사용자 삭제 오류:", err);
    }
  };
  
  
    // ✅ 결제 기록 추가 (중복 검사 포함)
  const handleConfirmPayment = async () => {
    if (!selectedRecord) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/coffee`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUser._id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPopupMessage("❌ 오늘 이미 결제한 사람이 있습니다!"); // ✅ 팝업에서 메시지 표시
        setPaymentSuccess(false);
        return;
      }

      setPopupMessage(`✅ ${selectedUser.name} 님이 결제자로 등록되었습니다!`); // ✅ 성공 메시지 변경
      setPaymentSuccess(true); // ✅ 성공 상태 설정
    } catch (err) {
      console.error("결제 기록 추가 오류:", err);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800">
      <h1 className="text-3xl font-bold">👥 사용자 목록</h1>

      {/* ✅ 뒤로가기 버튼 */}
      <button
        onClick={() => router.push("/")} // ✅ 홈으로 이동
        className="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md"
      >
        ⬅ 뒤로가기
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
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg mr-3"
              >
                구매내역 보기
              </button>
            )}

            {/* ✅ 닫기 버튼 (결제 성공 후에도 표시) */}
            <button
              onClick={() => setSelectedUser(null)}
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


    </div>

    
  );
}
