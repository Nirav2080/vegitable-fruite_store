import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 30"
      width="100"
      height="25"
      {...props}
    >
      <text x="0" y="22" fontFamily="'Poppins', sans-serif" fontSize="24" fontWeight="bold" fill="currentColor">
        FOODIA
      </text>
    </svg>
  );
}
