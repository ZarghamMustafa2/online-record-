import "./globals.css";

export const metadata = {
  title: "QR Code Builder",
  description: "Create your own custom QR codes instantly.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
