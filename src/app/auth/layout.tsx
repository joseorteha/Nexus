import "../globals.css";

export default function AuthLayout({ children }: { children: React.ReactNode }) {

    
  return (
    <html lang="en">
      <head>
        <title>Nexus Auth</title>
      </head>
      <body className="">{children}</body>
    </html>
  );
}
