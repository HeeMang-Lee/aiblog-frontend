'use client';

import dynamic from 'next/dynamic';

/**
 * three.js is ~150KB and nothing above the fold depends on it, so the scene is
 * loaded only in the browser and only after the text has painted. The stage
 * below reserves its box and is painted the same colour the renderer clears
 * to, so the panel looks finished before and after the scene arrives.
 */
const HeroScene = dynamic(() => import('./HeroScene'), {
  ssr: false,
  loading: () => null,
});

export default function Hero() {
  return (
    <section className="border-b border-rule">
      <div className="mx-auto grid max-w-[760px] items-center gap-8 px-5 py-12 md:grid-cols-[1fr_320px] md:gap-12 md:px-8 md:py-16">
        <div>
          <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.25] tracking-[-0.025em] text-ink">
            백엔드와 AI 협업
          </h1>
          <p className="mt-4 max-w-[46ch] text-[16px] leading-[1.7] text-body">
            만들면서 배운 것을 기록합니다. 실측한 숫자와 그때 내린 판단을
            남겨 둡니다.
          </p>
        </div>

        {/* The canvas is cleared to a colour rather than left transparent:
            bloom and ACES tone mapping both act on the empty background, so a
            see-through canvas tints the page into a visible rectangle. The
            clear colour tracks `--stage`, which sits just under the page tone,
            so the panel reads as a shallow inset in either theme. */}
        <div className="aspect-square w-full overflow-hidden rounded-xs bg-stage md:aspect-auto md:h-[320px]">
          <HeroScene />
        </div>
      </div>
    </section>
  );
}
