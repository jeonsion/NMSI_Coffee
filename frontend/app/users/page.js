"use client";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800">
      <h1 className="text-3xl font-bold">👥 사용자 목록</h1>
      <ul className="mt-4">
        {users.map((user) => (
          <li key={user._id} className="text-lg">
            {user.name}
          </li>
        ))}
      </ul>
      <a href="/" className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md">
        홈으로 돌아가기
      </a>
    </div>
  );
}
