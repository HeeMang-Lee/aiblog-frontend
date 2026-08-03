#!/usr/bin/env node
/**
 * 노션 연결 진단.
 *
 * 연결이 안 될 때 노션은 "권한 없음" 한 줄만 돌려주고 원인을 알려주지 않는다.
 * 토큰, 워크스페이스, 표 접근 권한, 속성 스키마를 순서대로 짚어서
 * 어느 단계에서 막혔는지 짚어준다.
 *
 *   npm run notion:check
 */
import { readFileSync } from 'node:fs';
import { Client } from '@notionhq/client';

const RESET = '[0m';
const DIM = '[2m';
const RED = '[31m';
const GREEN = '[32m';
const YELLOW = '[33m';

const ok = (m) => console.log(`${GREEN}  통과${RESET}  ${m}`);
const fail = (m) => console.log(`${RED}  실패${RESET}  ${m}`);
const warn = (m) => console.log(`${YELLOW}  주의${RESET}  ${m}`);
const hint = (m) => console.log(`${DIM}        ${m}${RESET}`);

/** .env.local 을 읽는다. Next 가 아닌 맨 node 로 도는 스크립트라 직접 파싱한다. */
function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    try {
      const text = readFileSync(file, 'utf8');
      for (const line of text.split('\n')) {
        const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
        if (!match) continue;
        const [, key, rawValue] = match;
        if (process.env[key]) continue;
        process.env[key] = rawValue.trim().replace(/^["']|["']$/g, '');
      }
    } catch {
      // 파일이 없으면 넘어간다.
    }
  }
}

function extractNotionId(input) {
  if (!input) return undefined;
  const withoutQuery = input.split('?')[0];
  const matches = withoutQuery.match(
    /[0-9a-f]{32}|[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}/gi,
  );
  if (!matches?.length) return undefined;
  return matches[matches.length - 1].replace(/-/g, '');
}

loadEnv();

console.log('\n노션 연결 진단\n' + '─'.repeat(52));

/* 1. 환경변수 --------------------------------------------------------- */
const token = process.env.NOTION_TOKEN;
const rawDb = process.env.NOTION_DATABASE_ID;

if (!token) {
  fail('NOTION_TOKEN 이 없습니다.');
  hint('.env.example 을 .env.local 로 복사하고 시크릿을 넣으세요.');
  process.exit(1);
}
if (!token.startsWith('ntn_') && !token.startsWith('secret_')) {
  warn('NOTION_TOKEN 이 ntn_ 이나 secret_ 으로 시작하지 않습니다.');
  hint('통합 페이지의 "Internal Integration Secret" 값이 맞는지 확인하세요.');
} else {
  ok(`NOTION_TOKEN 확인 (${token.slice(0, 8)}...)`);
}

if (!rawDb) {
  fail('NOTION_DATABASE_ID 가 없습니다.');
  process.exit(1);
}
const databaseId = extractNotionId(rawDb);
if (!databaseId) {
  fail('NOTION_DATABASE_ID 에서 ID를 못 찾았습니다.');
  hint(`받은 값: ${rawDb}`);
  hint('노션 표에서 "링크 복사"한 주소를 그대로 붙여넣으세요.');
  process.exit(1);
}
ok(`데이터베이스 ID 추출: ${databaseId}`);

const notion = new Client({ auth: token });

/* 2. 토큰이 살아 있는가 ------------------------------------------------ */
try {
  const me = await notion.users.me({});
  ok(`토큰 유효. 통합 이름: "${me.name ?? '(이름 없음)'}"`);
} catch (error) {
  fail('토큰이 거부됐습니다.');
  hint(error?.message ?? String(error));
  hint('시크릿을 다시 복사하거나 통합을 새로 만드세요.');
  process.exit(1);
}

/* 3. 표에 접근할 수 있는가 --------------------------------------------- */
let database;
try {
  database = await notion.databases.retrieve({ database_id: databaseId });
  const title = database.title?.map((t) => t.plain_text).join('') || '(제목 없음)';
  ok(`표에 접근됨: "${title}"`);
} catch (error) {
  const code = error?.code ?? '';

  if (code === 'object_not_found') {
    fail('표를 찾을 수 없습니다. 통합이 이 표에 연결되지 않았습니다.');
    console.log('');
    hint('해결 방법 두 가지 중 하나를 하세요.');
    hint('');
    hint('  [방법 A] 통합 쪽에서 (권장)');
    hint('    1. https://www.notion.so/profile/integrations');
    hint('    2. 만든 통합 클릭 → "액세스(Access)" 탭');
    hint('    3. "페이지 선택" → 표를 고르고 저장');
    hint('');
    hint('  [방법 B] 표 쪽에서');
    hint('    1. 표 페이지 우측 상단 ···');
    hint('    2. "연결 항목 추가"');
    hint('    3. 추천 목록 말고 검색창에 통합 이름을 직접 입력');
    hint('');
    hint('  표가 다른 페이지 안에 끼워 넣은 인라인 표라면,');
    hint('  표가 아니라 그 표를 담고 있는 상위 페이지를 연결해야 합니다.');
  } else if (code === 'validation_error') {
    fail('ID는 찾았지만 데이터베이스가 아닙니다.');
    hint('일반 페이지 링크를 넣으셨을 수 있습니다. 표 자체의 링크가 필요합니다.');
    hint(error?.message ?? '');
  } else {
    fail(`표 조회 실패 (${code || 'unknown'})`);
    hint(error?.message ?? String(error));
  }
  process.exit(1);
}

/* 4. 데이터 소스 ------------------------------------------------------- */
const dataSourceId = database.data_sources?.[0]?.id;
if (!dataSourceId) {
  // databases.retrieve 는 껍데기를 돌려주면서도 성공한다. 안을 볼 권한이
  // 없으면 data_sources 가 빈 배열로 온다. 즉 여기까지 왔다는 건 표는
  // 찾았지만 통합에 권한이 없다는 뜻이다.
  fail('표는 찾았지만 통합에 권한이 없습니다.');
  console.log('');

  if (database.is_inline) {
    hint('이 표는 다른 페이지 안에 끼워 넣은 "인라인 표"입니다.');
    hint('인라인 표는 표가 아니라 표를 담고 있는 페이지를 연결해야 합니다.');
    hint('');
    hint('  1. 표가 들어 있는 페이지를 엽니다 (표가 아니라 그 바깥 페이지)');
    hint('  2. 우측 상단 ··· → "연결 항목 추가"');
    hint('  3. 추천 목록 말고 검색창에 통합 이름을 직접 입력');
    hint('');
    hint('  또는 표 제목 옆 ⋮⋮ → "전체 페이지로 열기" 로 바꾼 뒤 연결해도 됩니다.');
  } else {
    hint('  1. https://www.notion.so/profile/integrations');
    hint('  2. 통합 클릭 → "액세스(Access)" 탭 → "페이지 선택"');
    hint('  3. 이 표 또는 표가 들어 있는 페이지를 고르고 저장');
  }

  hint('');
  hint('연결 후 다시 이 명령을 돌리세요. 반영에 몇 초 걸릴 수 있습니다.');
  process.exit(1);
}
ok(`데이터 소스 확인: ${dataSourceId}`);

/* 5. 속성 스키마 ------------------------------------------------------- */
let dataSource;
try {
  dataSource = await notion.dataSources.retrieve({ data_source_id: dataSourceId });
} catch (error) {
  fail('데이터 소스 조회 실패');
  hint(error?.message ?? String(error));
  process.exit(1);
}

const properties = Object.entries(dataSource.properties ?? {});
console.log(`\n${DIM}  표의 속성 ${properties.length}개${RESET}`);
for (const [name, value] of properties) {
  console.log(`${DIM}    - ${name} (${value.type})${RESET}`);
}

const normalize = (n) => n.replace(/\s+/g, '').toLowerCase();
const names = properties.map(([n]) => normalize(n));
const hasTitle = properties.some(([, v]) => v.type === 'title');
const has = (...candidates) => candidates.some((c) => names.includes(normalize(c)));

console.log('');
hasTitle ? ok('제목 속성 있음') : fail('제목(title) 속성이 없습니다.');

if (has('Status', '상태')) {
  ok('상태 속성 있음');
} else {
  warn('Status / 상태 속성이 없습니다. 모든 글이 초안 취급되어 사이트에 안 나옵니다.');
}

for (const [label, candidates] of [
  ['카테고리', ['Category', '카테고리', '분류', '주제/카테고리', '주제']],
  ['슬러그', ['Slug', '슬러그', 'Path']],
  ['요약', ['Summary', '요약', 'Description', '설명', 'Excerpt']],
  ['발행일', ['Date', '발행일', '날짜', '게시날짜', '게시일', 'Published', 'PublishedAt']],
  ['태그', ['Tags', '태그']],
]) {
  has(...candidates)
    ? ok(`${label} 속성 있음`)
    : console.log(`${DIM}  생략  ${label} 속성 없음 (선택 사항)${RESET}`);
}

/* 6. 실제 글 -------------------------------------------------------- */
let rows;
try {
  rows = await notion.dataSources.query({ data_source_id: dataSourceId, page_size: 100 });
} catch (error) {
  fail('글 조회 실패');
  hint(error?.message ?? String(error));
  process.exit(1);
}

// 노션 한국어 블로그 템플릿은 상태에 이모지를 붙인다("게시됨 🚀").
// "출판 준비 완료"는 일부러 뺐다. 발행 준비는 발행이 아니다.
const PUBLISHED = [
  'published', 'publish', 'live', '발행', '발행됨', '공개', '게시됨', '게시완료',
];
const strip = (v) =>
  v.replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, '')
   .replace(/\s+/g, '')
   .toLowerCase();

const statusOf = (page) => {
  for (const [name, value] of Object.entries(page.properties ?? {})) {
    if (!['status', '상태'].includes(normalize(name))) continue;
    if (value.type === 'select') return value.select?.name ?? null;
    if (value.type === 'status') return value.status?.name ?? null;
  }
  return null;
};

const published = rows.results.filter((page) => PUBLISHED.includes(strip(statusOf(page) ?? '')));

console.log('');
ok(`행 ${rows.results.length}개 조회됨`);

if (rows.results.length === 0) {
  warn('표가 비어 있습니다. 글을 한 줄 추가해 보세요.');
} else if (published.length === 0) {
  const seen = [...new Set(rows.results.map(statusOf).filter(Boolean))];
  warn('발행 상태인 글이 없습니다. 사이트에는 아무것도 안 나옵니다.');
  hint(`표에 있는 상태 값: ${seen.length ? seen.join(', ') : '(비어 있음)'}`);
  hint(`발행으로 인식하는 값: ${PUBLISHED.join(', ')}`);
} else {
  ok(`발행된 글 ${published.length}개`);
}

console.log('\n' + '─'.repeat(52));
console.log('진단 완료. npm run dev 로 확인하세요.\n');
