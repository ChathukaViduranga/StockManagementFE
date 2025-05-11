import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "SR M&M",
  description: "Stock Management system for SR Mobile & Music",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
