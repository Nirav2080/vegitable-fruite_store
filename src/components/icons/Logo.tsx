import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 280 45"
      width="224"
      height="36"
      {...props}
    >
      <text x="140" y="22" textAnchor="middle" fontFamily="var(--font-pt-sans), sans-serif" fontSize="22" fontWeight="bold" fill="currentColor">
        RICHMOND VEGE MART
      </text>
      <text x="140" y="38" textAnchor="middle" fontFamily="var(--font-pt-sans), sans-serif" fontSize="10" letterSpacing="2" fill="currentColor">
        A SYMPHONY OF FLAVOURS
      </text>
    </svg>
  );
}
