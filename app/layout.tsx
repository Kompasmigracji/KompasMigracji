export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ua">
      <body>{children}</body>
    </html>
  );
}
