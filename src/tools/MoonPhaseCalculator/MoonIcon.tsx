import { useId } from "react";
import type { MoonPhase } from "./utils/moonPhase";

interface Props {
  readonly className?: string;
  readonly phase: MoonPhase;
  readonly size?: number;
}

const CENTER = 50;
const RADIUS = 42;
const TOP = CENTER - RADIUS;
const BOTTOM = CENTER + RADIUS;

function getIlluminatedPath(phase: MoonPhase) {
  const terminatorRadius = Math.abs(
    RADIUS * Math.cos(phase.fraction * Math.PI * 2),
  );
  const outerSweep = phase.waxing ? 1 : 0;
  const sweepChangesAt = phase.waxing ? 0.25 : 0.75;
  const terminatorSweep = phase.fraction < sweepChangesAt ? 0 : 1;
  const terminator =
    terminatorRadius < 0.01
      ? `L ${CENTER} ${TOP}`
      : `A ${terminatorRadius} ${RADIUS} 0 0 ${terminatorSweep} ${CENTER} ${TOP}`;

  // Join the moon's circular limb to its elliptical day/night boundary.
  return [
    `M ${CENTER} ${TOP}`,
    `A ${RADIUS} ${RADIUS} 0 0 ${outerSweep} ${CENTER} ${BOTTOM}`,
    terminator,
    "Z",
  ].join(" ");
}

export default function MoonIcon({ className, phase, size = 64 }: Props) {
  const illuminatedPath = getIlluminatedPath(phase);
  const clipId = `moon-light-${useId().replaceAll(":", "")}`;

  return (
    <svg
      aria-hidden="true"
      className={className}
      height={size}
      viewBox="0 0 100 100"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id={clipId}>
          <path d={illuminatedPath} />
        </clipPath>
      </defs>
      <circle cx={CENTER} cy={CENTER} fill="#243451" r={RADIUS} />
      <path d={illuminatedPath} fill="#fff1c7" />
      <g clipPath={`url(#${clipId})`} fill="#c79b5b" opacity="0.22">
        <circle cx="34" cy="35" r="5" />
        <circle cx="63" cy="57" r="7" />
        <circle cx="41" cy="68" r="3.5" />
        <circle cx="66" cy="29" r="2.5" />
      </g>
      <circle
        cx={CENTER}
        cy={CENTER}
        fill="none"
        r={RADIUS}
        stroke="#8996ad"
        strokeWidth="1.5"
      />
    </svg>
  );
}
