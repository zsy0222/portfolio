import "./project-design.css";

/** Abstract editorial artwork, not a screenshot or a visualization of project results. */
export default function ProjectVisual({ variant = 0 }: { variant?: number }) {
  const style = ((variant % 6) + 6) % 6;
  return (
    <div className={`project-visual project-visual-${style}`} aria-hidden="true">
      <span className="project-visual-cross project-visual-cross-a">+</span>
      <span className="project-visual-cross project-visual-cross-b">+</span>
      <svg viewBox="0 0 480 340" fill="none" focusable="false">
        {style === 0 && <>
          <path className="pv-faint" d="M70 170H410M240 40V300" strokeDasharray="3 6" />
          <path className="pv-line" d="M140 80H240V170H340V260M240 170H140V260M240 80H340" />
          <path className="pv-soft-line" d="M140 80V170H340V80M140 260H340" />
          <rect className="pv-paper" x="110" y="50" width="60" height="60" rx="9" />
          <rect className="pv-paper" x="310" y="50" width="60" height="60" rx="9" />
          <rect className="pv-solid" x="200" y="130" width="80" height="80" rx="15" transform="rotate(45 240 170)" />
          <path className="pv-inverse" d="m224 170 11 11 22-24" strokeWidth="3" />
          <circle className="pv-paper" cx="140" cy="260" r="29" />
          <circle className="pv-paper" cx="340" cy="260" r="29" />
          <path className="pv-line" d="M130 74H150M130 86H145M330 74H350M330 86H345" />
          <circle className="pv-fill" cx="140" cy="260" r="5" /><circle className="pv-fill" cx="340" cy="260" r="5" />
        </>}
        {style === 1 && <>
          <g transform="translate(35 13)">
            <path className="pv-paper" d="m65 205 145 70 145-70-145-70Z" />
            <path className="pv-paper" d="m65 170 145 70 145-70-145-70Z" />
            <path className="pv-solid" d="m65 135 145 70 145-70-145-70Z" />
            <path className="pv-inverse" d="m105 137 40-1 32-21 35 17 38-32 27 6 32-12" />
            <path className="pv-inverse pv-dim" d="m120 154 36-15 30 13 46-20 28 4 34-17" />
            <path className="pv-soft-line" d="m65 135 0 70m290-70v70M210 205v70" strokeDasharray="3 5" />
          </g>
          <circle className="pv-ring" cx="245" cy="176" r="138" strokeDasharray="1 8" />
        </>}
        {style === 2 && <>
          <circle className="pv-ring" cx="240" cy="170" r="114" />
          <g className="pv-soft-line"><path d="M130 170H350M240 60V280M162 92l156 156M162 248 318 92" /></g>
          <rect className="pv-solid" x="203" y="133" width="74" height="74" rx="24" />
          <path className="pv-inverse" d="M227 170h26m-13-13v26" strokeWidth="3" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map(i => <g key={i} transform={`rotate(${i * 45} 240 170)`}><rect className="pv-paper" x="225" y="42" width="30" height="30" rx="8" /><circle className="pv-fill" cx="240" cy="57" r="3" /></g>)}
        </>}
        {style === 3 && <>
          <circle className="pv-paper" cx="240" cy="170" r="105" />
          <ellipse className="pv-line" cx="240" cy="170" rx="46" ry="105" />
          <ellipse className="pv-soft-line" cx="240" cy="170" rx="82" ry="105" />
          <path className="pv-line" d="M135 170h210M149 117h182M149 223h182M240 65v210" />
          <ellipse className="pv-line" cx="240" cy="170" rx="166" ry="46" transform="rotate(-28 240 170)" />
          <circle className="pv-solid" cx="103" cy="245" r="11" /><circle className="pv-solid" cx="375" cy="94" r="11" />
          <circle className="pv-paper" cx="270" cy="166" r="15" /><circle className="pv-fill" cx="270" cy="166" r="4" />
        </>}
        {style === 4 && <>
          <path className="pv-line" d="M165 83c-42 0-69 35-62 72-35 29-20 79 15 90 3 30 40 45 65 30 17 26 57 18 57-10V82c-13-30-57-26-75 1Zm150 0c42 0 69 35 62 72 35 29 20 79-15 90-3 30-40 45-65 30-17 26-57 18-57-10V82c13-30 57-26 75 1Z" />
          <path className="pv-soft-line" d="m165 83 19 52-46 31 40 43-12 48m18-122 56 35m-62 39 62 30m75-156-19 52 46 31-40 43 12 48m-18-122-56 35m62 39-62 30" />
          {[[184,135],[138,166],[178,209],[296,135],[342,166],[302,209]].map(([x,y],i)=><circle key={i} className={i % 2 ? "pv-paper" : "pv-solid"} cx={x} cy={y} r={i % 2 ? 10 : 7} />)}
          <circle className="pv-paper" cx="240" cy="170" r="28" /><path className="pv-line" d="M220 170h8l6-12 9 24 7-12h10" />
        </>}
        {style === 5 && <>
          <circle className="pv-ring" cx="240" cy="175" r="114" strokeDasharray="2 7" />
          <g className="pv-line pv-loop" strokeLinecap="round" strokeLinejoin="round">
            <path d="M178 100c29-29 77-34 112-9l32 24m-4-35 4 35-35 3" />
            <path d="M338 163c11 40-8 85-47 104l-36 18m33 13-33-13 15-32" />
            <path d="M205 285c-41-11-69-49-65-93l4-40m-28 23 28-23 21 29" />
          </g>
          <path className="pv-paper" d="M221 199c-12-29 5-57 42-63 3 38-10 62-42 63Z" />
          <path className="pv-line" d="m217 209 28-48" />
        </>}
      </svg>
      <div className="project-visual-foot"><span>STUDY / {String(style + 1).padStart(2, "0")}</span><span>↗</span></div>
    </div>
  );
}
