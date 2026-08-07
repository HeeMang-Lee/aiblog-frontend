/**
 * A fixed-window request limit held in the instance's own memory.
 *
 * Deliberately not backed by Redis. The point of the limit is to stop a caller
 * from burning the counter's command budget, and a Redis-backed limiter would
 * spend commands on exactly the requests it turns away.
 *
 * 무엇을 막고 무엇을 못 막는지 분명히 해 둔다. 이건 단순 반복 호출을 끊는
 * 속도 방지턱이지 예산 보증이 아니다. 서버리스는 인스턴스가 여럿이고 각자
 * 자기 창을 세므로, 여러 인스턴스에 나눠 때리면 그 배수만큼 통과한다.
 * 예산을 실제로 묶는 것은 Upstash 콘솔의 상한이다.
 */

/** 한 창의 길이. */
const WINDOW_MS = 60_000;

/**
 * 한 창에 허용하는 요청 수.
 *
 * 한 번 볼 때 요청 하나가 나가므로 사람이 아무리 빨리 눌러도 이 근처에
 * 닿지 않는다. 반복 호출은 분당 수천 번이라 20 이든 30 이든 똑같이 걸린다.
 * 그래서 공격자 쪽이 아니라 실제 독자 쪽에 여유를 두고 잡았다.
 */
const MAX_REQUESTS = 30;

/** 서로 다른 주소가 쏟아져도 지도가 무한히 자라지 않게 묶는다. */
const MAX_TRACKED = 5_000;

const hits = new Map<string, { count: number; resetAt: number }>();

/** 만료된 항목을 걷어낸다. 그래도 가득이면 통째로 비운다. */
function sweep(now: number): void {
  for (const [key, entry] of hits) {
    if (now >= entry.resetAt) hits.delete(key);
  }

  // 전부 살아 있으면 위 반복이 아무것도 못 지운다. 창이 한 번 밀릴 뿐이고,
  // 지도가 끝없이 자라게 두는 것보다 낫다.
  if (hits.size >= MAX_TRACKED) hits.clear();
}

export function allowRequest(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now >= entry.resetAt) {
    if (hits.size >= MAX_TRACKED) sweep(now);
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  entry.count += 1;
  return entry.count <= MAX_REQUESTS;
}
