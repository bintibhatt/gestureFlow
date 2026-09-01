import Script from 'next/script';
import './globals.css';

export const metadata = {
  title: 'GestureFlow | Gesture-Controlled Photo Workspace',
  description: 'Browser-based photo capture, browsing, and image editing controlled by computer vision hand gestures.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script src="/mediapipe/hands/hands.js" strategy="beforeInteractive" />
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
