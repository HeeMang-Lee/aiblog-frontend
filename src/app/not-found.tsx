import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-5">
      <div className="w-full max-w-[760px]">
        <p className="font-mono tnum text-[11px] tracking-[0.08em] text-meta">
          404
        </p>
        <h1 className="mt-3 text-[22px] font-semibold tracking-[-0.02em] text-ink">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="mt-2 text-[15px] text-body">
          주소가 바뀌었거나 글이 삭제됐을 수 있습니다.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-xs bg-ink px-5 py-2.5 text-[13px] font-medium tracking-[0.02em] text-paper transition-colors hover:bg-accent-hover"
        >
          글 목록으로
        </Link>
      </div>
    </div>
  );
}
