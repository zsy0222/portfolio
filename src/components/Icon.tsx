import type { SVGProps } from "react";

const paths = {
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>,
  moon: <path d="M20.5 13.2A8.5 8.5 0 0 1 10.8 3.5a8.5 8.5 0 1 0 9.7 9.7Z" />,
  "arrow-right": <path d="M4 12h16m-6-6 6 6-6 6" />,
  "arrow-left": <path d="M20 12H4m6-6-6 6 6 6" />,
  "arrow-up": <path d="M12 20V4m-6 6 6-6 6 6" />,
  "arrow-down": <path d="M12 4v16m-6-6 6 6 6-6" />,
  "arrow-up-right": <path d="M6 18 18 6M6 6h12v12" />,
  copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  "chevron-right": <path d="m9 5 7 7-7 7" />,
  "chevron-down": <path d="m5 9 7 7 7-7" />,
  zoom: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5M7.5 10.5h6m-3-3v6" /></>,
};

export type IconName = keyof typeof paths;

export default function Icon({ name, className = "", ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.65}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"
      className={`ui-icon ${className}`}>
      {paths[name]}
    </svg>
  );
}
