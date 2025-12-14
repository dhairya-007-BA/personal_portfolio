import "./globals.css";
import Image from "next/image";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="fixed top-0 w-full bg-bg/90 backdrop-blur z-50 border-b border-white/10">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
            <span className="font-semibold tracking-wide">
              Dhairya Singhal
            </span>

            <Image
              src="/logo.png"
              alt="DS BA Logo"
              width={40}
              height={40}
              className="cursor-pointer"
            />
          </div>
        </header>

        <main className="pt-24">{children}</main>
      </body>
    </html>
  );
}
