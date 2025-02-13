import "./globals.css"; // Tailwind CSS 임포트

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="bg-gray-100 text-gray-800">{children}</body>
    </html>
  );
}
