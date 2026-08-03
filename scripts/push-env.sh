#!/usr/bin/env bash
#
# .env.local 의 값을 Vercel 프로젝트 환경변수로 올린다.
#
# 값은 이 파일에 들어 있지 않다. 실행 시점에 .env.local 에서 읽어 바로
# Vercel 로 보내므로 시크릿이 저장소나 로그에 남지 않는다.
#
#   bash scripts/push-env.sh
#
set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -f .env.local ]; then
  echo "  .env.local 이 없습니다." >&2
  exit 1
fi

# 올릴 키만 지정한다. VERCEL_OIDC_TOKEN 처럼 CLI 가 만든 값은 제외한다.
KEYS=(
  NOTION_TOKEN
  NOTION_DATABASE_ID
  UPSTASH_REDIS_REST_URL
  UPSTASH_REDIS_REST_TOKEN
  NEXT_PUBLIC_SITE_URL
)

for KEY in "${KEYS[@]}"; do
  VALUE="$(grep -E "^${KEY}=" .env.local | head -1 | cut -d= -f2- | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"

  if [ -z "$VALUE" ]; then
    echo "  건너뜀  ${KEY} (비어 있음)"
    continue
  fi

  for ENVIRONMENT in production preview development; do
    # 같은 키가 이미 있으면 add 가 실패하므로 먼저 지우고 다시 넣는다.
    npx --yes vercel@latest env rm "$KEY" "$ENVIRONMENT" --yes >/dev/null 2>&1 || true
    printf '%s' "$VALUE" | npx --yes vercel@latest env add "$KEY" "$ENVIRONMENT" >/dev/null 2>&1
  done

  echo "  등록    ${KEY} (${#VALUE}자)"
done

echo
echo "완료. 이제 배포하면 됩니다."
