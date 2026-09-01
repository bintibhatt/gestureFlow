export default function GestureFlowMark({ className = 'w-9 h-9' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="gestureFlowGradient" x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2DD4BF" />
          <stop offset="0.5" stopColor="#3B82F6" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <path
        d="M25 15c0-3.3 5-3.3 5 0v16.2m0 0V11.5c0-3.3 5-3.3 5 0v22.7m0 0V20.5c0-3.3 5-3.3 5 0v16.7m0 0 4.4-6.6c1.8-2.7 6-0.1 4.2 2.7l-6.6 10.1C39.2 47.8 35.1 50 29.8 50h-3.5c-4.1 0-7.3-2.8-8.1-6.8L15.5 30c-.7-3.4 4.2-4.6 5-1.2l2.1 9.1V21.5c0-3.3 5-3.3 5 0V15Z"
        stroke="url(#gestureFlowGradient)"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13 22.5c3.5-7 9.2-10.8 16-12" stroke="#22D3EE" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      <path d="M10 31.5c1.4-2.4 2.5-3.9 4.2-5.4" stroke="#22D3EE" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
      <path d="M41 51c5.2-1.4 9.4-4.7 12-9.3" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}
