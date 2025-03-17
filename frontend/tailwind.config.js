/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // ✅ Next.js App Router 사용 시
    "./pages/**/*.{js,ts,jsx,tsx}", // ✅ Next.js Pages Router 사용 시
    "./components/**/*.{js,ts,jsx,tsx}", // ✅ 컴포넌트 내부 Tailwind 포함
    "./src/**/*.{js,ts,jsx,tsx}", // ✅ src 폴더 내 모든 파일 포함
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
