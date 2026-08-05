/**
 * 글 분량과 발췌.
 *
 * 마크다운 원문을 그대로 세면 안 된다. 노션은 이미지를 서명이 붙은 S3 링크로
 * 주는데 그 주소 하나가 1,700자 가까이 된다. 이미지 여섯 장이면 만 자가 넘어서
 * 실제 본문이 3,500자인 글의 분량이 14,000자로 잡힌다. 사람이 읽지 않는 글자는
 * 세지 않는다.
 */

/** 사람이 실제로 읽는 부분만 남긴다. 주소와 마크다운 기호는 버린다. */
function readableText(markdown: string): string {
  return (
    markdown
      // 이미지는 통째로. 대체 텍스트도 화면에 안 보인다.
      .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
      // 링크는 보이는 글자만 남기고 주소는 버린다.
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      // 마크다운을 거치지 않은 벌거벗은 주소.
      .replace(/<?https?:\/\/[^\s>)]+>?/g, ' ')
      // 표의 구분선은 글자가 아니다.
      .replace(/^\s{0,3}\|[-:\s|]+\|\s*$/gm, ' ')
      // 머리표와 제목 기호.
      .replace(/^[ \t]*[-*+>]\s+/gm, ' ')
      .replace(/^#{1,6}\s+/gm, ' ')
      // 남은 강조 기호.
      .replace(/[*_~`>|]/g, ' ')
  );
}

export function countWords(markdown: string): number {
  const text = readableText(markdown).trim();
  return text ? text.split(/\s+/).length : 0;
}

/**
 * 검색 결과에 뜨는 설명문. 노션의 요약 속성이 비어 있을 때 본문에서 뽑는다.
 *
 * 설명이 아예 없으면 구글이 본문에서 제멋대로 잘라 쓴다. 대개 첫 문단이
 * 아니라 검색어가 걸린 아무 데나 잡히므로, 우리가 정해 주는 편이 낫다.
 *
 * 155자에서 자른다. 그보다 길면 검색 결과에서 어차피 잘린다.
 */
export function excerpt(markdown: string, limit = 155): string {
  const text = readableText(markdown)
    // 코드 블록은 설명문에 어울리지 않는다.
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length <= limit) return text;

  const cut = text.slice(0, limit);
  // 문장이 끝나는 자리가 가까우면 거기서 끊는다.
  const sentence = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('다. '));
  if (sentence > limit * 0.6) return cut.slice(0, sentence + 1).trim();

  const space = cut.lastIndexOf(' ');
  return `${(space > limit * 0.6 ? cut.slice(0, space) : cut).trim()}…`;
}
