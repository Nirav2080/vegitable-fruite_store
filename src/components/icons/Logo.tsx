import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 30"
      width="180"
      height="25"
      {...props}
    >
      <text x="0" y="22" fontFamily="'Poppins', sans-serif" fontSize="22" fontWeight="bold" fill="currentColor">
        Aotearoa Organics
      </text>
    </svg>
  );
}
