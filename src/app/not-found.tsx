import Link from 'next/link';

/**
 * Deliberately outside the editor shell: the shell's explorer needs a Notion
 * round trip, and a 404 should not depend on a network call that may itself
 * be the reason the page is missing.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-bg px-5">
      <div className="w-full max-w-[560px] overflow-hidden rounded-xs border border-rule">
        <div className="flex h-9 items-center border-b border-rule bg-panel px-3">
          <p className="flex-1 text-center font-mono text-[11px] text-meta">
            404
          </p>
        </div>

        <div className="bg-editor px-5 py-8">
          <p className="font-mono text-[13px] leading-[1.8] text-meta">
            <span className="text-accent">$</span> cat {'<'}requested{'>'}
          </p>
          <p className="mt-1 font-mono text-[13px] leading-[1.8] text-string">
            No such file or directory
          </p>

          <p className="mt-6 text-[14px] leading-[1.7] text-body">
            주소가 바뀌었거나 글이 삭제됐을 수 있습니다.
          </p>

          <Link
            href="/"
            className="mt-6 inline-block rounded-xs bg-accent-soft px-3.5 py-2 font-mono text-[12px] text-accent transition-colors hover:text-ink"
          >
            cd ~
          </Link>
        </div>
      </div>
    </div>
  );
}
