import { Fragment, type CSSProperties } from "react";

interface TypingTextProps {
  segments: { text: string; accent?: boolean }[];
  /** Kept for existing callers; now controls the short segment stagger. */
  speed?: number;
}

/** Render the complete heading on the server; motion never gates its content. */
export default function TypingText({ segments, speed = 60 }: TypingTextProps) {
  const stagger = Number.isFinite(speed) ? Math.min(80, Math.max(0, speed)) : 60;

  return (
    <span className="motion-heading">
      {segments.map((segment, index) => (
        <span
          key={index}
          className={`motion-heading-segment${segment.accent ? " text-accent font-semibold" : ""}`}
          style={{ "--motion-delay": `${Math.min(index * stagger, 320)}ms` } as CSSProperties}
        >
          {segment.text.split("\n").map((line, lineIndex, lines) => (
            <Fragment key={lineIndex}>
              {line}
              {lineIndex < lines.length - 1 && <br />}
            </Fragment>
          ))}
        </span>
      ))}
    </span>
  );
}
