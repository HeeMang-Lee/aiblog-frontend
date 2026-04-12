import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-border-primary">404</h1>
        <p className="mt-4 text-lg text-text-secondary">
          페이지를 찾을 수 없습니다.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
