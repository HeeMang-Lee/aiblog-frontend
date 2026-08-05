/**
 * 글 분량.
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
