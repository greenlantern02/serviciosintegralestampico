export function SiLogo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse cx="22" cy="30" rx="18" ry="22" fill="#F5E200" />
      <path
        d="M14 20 Q22 14 30 20 Q38 26 30 34 Q22 40 30 46"
        stroke="#3BBFC0"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="42" cy="18" r="4" fill="#1D3F5E" />
      <rect x="40" y="25" width="4" height="16" rx="2" fill="#1D3F5E" />
    </svg>
  );
}
