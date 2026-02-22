import "./globals.css";
import { Providers } from "./providers";
import NavBar from "@/components/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <NavBar />
          <main className="mx-auto max-w-5xl">{children}</main>
        </Providers>
      </body>
    </html>
  );
}