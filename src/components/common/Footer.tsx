export default function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex max-w-[760px] flex-col gap-6 px-5 py-12 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <p className="text-[15px] font-semibold tracking-[-0.01em] text-ink">
            이희망
          </p>
          <p className="mt-1.5 text-[13px] text-meta">
            백엔드와 AI 협업에 대해 씁니다.
          </p>
        </div>

        <div className="flex items-end gap-6 text-[11px] tracking-[0.08em] text-meta">
          <a
            href="https://github.com/HeeMang-Lee"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-ink"
          >
            GitHub
          </a>
          <span className="font-mono tnum">{new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
