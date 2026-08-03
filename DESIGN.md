---
name: AI Blog
description: 에디터를 그대로 옮긴 개인 기술 블로그. 다크가 기본이고 터미널 그린이 액센트다.
colors:
  bg: "#F6F7F6"
  panel: "#ECEEEC"
  editor: "#FBFCFB"
  rule: "#DFE2DF"
  rule-strong: "#C7CEC9"
  ink: "#131813"
  body: "#3B453D"
  meta: "#667065"
  gutter: "#A2ACA4"
  accent: "#15803D"
  keyword: "#6D28D9"
  string: "#A15C07"
  bg-dark: "#080A09"
  panel-dark: "#0D100E"
  editor-dark: "#0A0D0B"
  rule-dark: "#1C221E"
  rule-strong-dark: "#2B342E"
  ink-dark: "#D6E2D8"
  body-dark: "#AEBBB1"
  meta-dark: "#6B7A6E"
  gutter-dark: "#3A463D"
  accent-dark: "#4ADE80"
  keyword-dark: "#7DD3FC"
  string-dark: "#D8B96A"
typography:
  display:
    fontFamily: "'IBM Plex Sans KR', 'Apple SD Gothic Neo', sans-serif"
    fontSize: "clamp(1.6rem, 3.6vw, 2.15rem)"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.025em"
  heading:
    fontFamily: "'IBM Plex Sans KR', 'Apple SD Gothic Neo', sans-serif"
    fontSize: "22px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  article-h3:
    fontFamily: "'IBM Plex Sans KR', 'Apple SD Gothic Neo', sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: "-0.02em"
  lead:
    fontFamily: "'IBM Plex Sans KR', 'Apple SD Gothic Neo', sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "-0.01em"
  article:
    fontFamily: "'IBM Plex Sans KR', 'Apple SD Gothic Neo', sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.8
    letterSpacing: "-0.005em"
  ui:
    fontFamily: "'IBM Plex Sans KR', 'Apple SD Gothic Neo', sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  code:
    fontFamily: "var(--font-plex-mono), 'IBM Plex Mono', ui-monospace, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  item:
    fontFamily: "'IBM Plex Sans KR', 'Apple SD Gothic Neo', sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  chrome:
    fontFamily: "var(--font-plex-mono), 'IBM Plex Mono', ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  panel-label:
    fontFamily: "var(--font-plex-mono), 'IBM Plex Mono', ui-monospace, monospace"
    fontSize: "10px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.14em"
rounded:
  base: "2px"
spacing:
  hairline: "1px"
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "24px"
  xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent}"
    rounded: "{rounded.base}"
    padding: "8px 14px"
    typography: "{typography.item}"
  explorer-item:
    backgroundColor: "transparent"
    textColor: "{colors.meta}"
    rounded: "{rounded.base}"
    padding: "4px 6px"
    typography: "{typography.item}"
  explorer-item-active:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent}"
  tab:
    backgroundColor: "{colors.editor}"
    textColor: "{colors.accent}"
    rounded: "{rounded.none}"
    padding: "8px 12px"
    typography: "{typography.chrome}"
---

## Overview

이 사이트는 **에디터**다. 글은 열려 있는 파일이고, 카테고리는 폴더이고, 하단에는 터미널이 있다.

이전 버전은 사양서 조판이었고 액센트가 버밀리언이었다. 전부 교체됐다. 남은 것은 서체와 2px 반경, 그리고 한글에 Mono를 쓰지 않는다는 규칙뿐이다.

**다크가 기본이다.** 이 디자인의 요점은 검정 위의 터미널 그린이고, 라이트는 같은 셸의 밝은 IDE 테마다. 다른 디자인이 아니라 같은 화면의 다른 테마다.

### 셸의 구조

```
┌──────────────────────────────────────────────┐
│ ● ● ●        이희망 - blog            [DARK] │  타이틀바
├──────────┬───────────────────┬───────────────┤
│ EXPLORER │  파일명.md    +   │  PREVIEW      │  탭
│          ├───────────────────┤  ┌─────────┐  │
│ ▾ posts  │ 1                 │  │ 글리프  │  │
│   글 …   │ 2  본문 …          │  └─────────┘  │
│ ▾ categories                 │  PROPERTIES   │
│   분류 … │                   │  status  …    │
├──────────┴───────────────────┴───────────────┤
│ $ blog --list                     3 posts    │  터미널
└──────────────────────────────────────────────┘
```

## Colors

액센트는 **터미널 그린** 하나다. 다크 `#4ADE80`, 라이트 `#15803D`.

| 역할 | 라이트 | 다크 |
|---|---|---|
| 배경 | `#F6F7F6` | `#080A09` |
| 패널 (탐색기·프로퍼티스·터미널) | `#ECEEEC` | `#0D100E` |
| 에디터 (본문 영역) | `#FBFCFB` | `#0A0D0B` |
| 괘선 | `#DFE2DF` | `#1C221E` |
| 제목 | `#131813` | `#D6E2D8` |
| 본문 | `#3B453D` | `#AEBBB1` |
| 메타 | `#667065` | `#6B7A6E` |
| 줄 번호 | `#A2ACA4` | `#3A463D` |
| 액센트 | `#15803D` | `#4ADE80` |
| keyword | `#6D28D9` | `#7DD3FC` |
| string | `#A15C07` | `#D8B96A` |

**액센트 사용 규칙.** 현재 열린 파일, 본문 링크, 터미널 프롬프트 `$`, 마크다운 기호(`#`). 이 넷뿐이다. 목록의 모든 항목을 초록으로 칠하면 "지금 보고 있는 것"이 사라진다.

`keyword`와 `string`은 **코드에만** 쓴다. UI 요소에 문법 강조 색을 칠하지 않는다.

**금지.** 버밀리언과 파랑 계열(이전 버전의 잔재). 네온 글로우를 텍스트에 거는 것. 그라데이션.

## Typography

**IBM Plex Sans KR** + **IBM Plex Mono**. 한글 청크는 `public/fonts/plex-kr`에 자체 호스팅한다.

### Mono는 한글에 절대 쓰지 않는다

Plex Mono에 한글 글립이 없다. 한글에 `font-mono`를 걸면 한글만 시스템 폰트로 대체되고 공백이 고정폭이라 `측정된  결과`처럼 벌어진다.

**Mono를 쓰는 곳은 정해져 있다.** 파일 경로, 줄 번호, 터미널, 프로퍼티스의 키, 패널 라벨, 코드 블록, 날짜와 숫자. 전부 라틴 문자와 숫자다.

**한글이 한 글자라도 섞이면 Sans다.** 탐색기의 글 제목, 프로퍼티스의 값, 본문 전부.

### 타입 램프

에디터 UI는 촘촘하고 본문은 넉넉하다. 두 밀도가 한 화면에 공존한다.

| 단 | 크기 | 서체 | 쓰는 곳 |
|---|---|---|---|
| display | `clamp(1.6rem, 3.6vw, 2.15rem)` / 600 | Sans | 글 상세의 제목 |
| heading | 22px / 600 | Sans | 섹션 제목 |
| article-h3 | 18px / 600 | Sans | 본문 안의 소제목 |
| lead | 17px / 600 | Sans | 목록의 글 제목 |
| **article** | **16px / lh 1.8** | Sans | **본문. 이 사이트의 주인공** |
| ui | 14px / lh 1.7 | Sans | 목록 요약, 안내 문구 |
| code | 13px | **Mono** | 코드 블록, 표 |
| item | 12px | Sans | 탐색기 항목, 프로퍼티스 값 |
| chrome | 11px | **Mono** | 줄 번호, 탭, 터미널, 프로퍼티스 키 |
| panel-label | 10px / `0.14em` | **Mono** | `EXPLORER`, `PREVIEW`, `PROPERTIES` |

본문 measure는 **68ch**를 넘지 않는다.

## Layout

- 셸 최대 폭 `1240px`. 데스크톱에서는 화면에서 살짝 띄워 창처럼 보이게 하고, 모바일에서는 가장자리까지 채운다.
- 3열: 탐색기 `220px` / 에디터 `1fr` / 우측 패널 `248px`.
- **`lg` 미만에서 우측 패널을 숨긴다.** 아래로 쌓으면 본문이 한 화면만큼 밀린다.
- **`md` 미만에서 탐색기는 서랍이 된다.** 타이틀바의 버튼으로 연다.

## Elevation & Depth

**그림자가 없다.** 패널 구분은 배경 명도 차이와 1px 괘선으로만 한다. 에디터가 가장 밝고(다크에서는 가장 어둡고), 패널이 그다음, 바깥 배경이 그 밖이다.

카드를 만들지 않는다. 이 화면에 떠 있는 표면은 없다.

## Shapes

**반경은 2px 하나다.** 에디터의 패널은 각지다. `rounded-full`까지 2px로 매핑해 두었다.

## Components

**탐색기 항목.** 활성 항목만 액센트 색과 옅은 액센트 배경을 갖는다. 나머지는 메타색이고 호버에서 잉크색으로 올라온다.

**탭.** 현재 파일 하나만 보여준다. 여러 탭을 흉내 내지 않는다. 안 열리는 탭은 거짓말이다.

**줄 번호.** 본문 왼쪽 거터에 Mono로. 장식이 아니라 위치 표시이므로 선택되지 않게 `select-none`.

**터미널 바.** 두 줄. 첫 줄은 이 페이지에 해당하는 명령, 둘째 줄은 결과. **실제로 그 페이지가 하는 일과 일치해야 한다.** 목록 페이지에서 `--status=published`라고 적었으면 실제로 발행 글만 보여야 한다.

**프리뷰.** 코드 문자로 이루어진 3D. 문자 아틀라스를 런타임에 캔버스로 그려 쓰므로 자산을 받지 않는다. `prefers-reduced-motion`이면 한 프레임만 그린다. WebGL이 없으면 빈 패널로 둔다.

## Do's and Don'ts

**한다**

- 다크를 기본으로 두고 라이트를 함께 확인한다.
- Mono는 라틴과 숫자에만.
- 액센트는 현재 위치, 링크, 프롬프트, 마크다운 기호에만.
- 본문은 16px / lh 1.8 / 68ch. **셸이 에디터여도 글은 읽으라고 있는 것이다.**
- 터미널 문구는 실제 동작과 맞춘다.

**하지 않는다**

- **스캔라인·CRT 곡률·글로우를 본문 텍스트에 걸기.** 해커 감성은 셸에서 내고 문장은 건드리지 않는다. 가는 가로줄은 가독성을 직접 해치고 저시력 사용자에게는 읽기를 불가능하게 만든다.
- 한글에 `font-mono`.
- 열리지 않는 가짜 탭, 동작하지 않는 가짜 버튼, 의미 없는 가짜 로그.
- 카드와 그림자.
- 버밀리언·파랑 계열.
- 줄표(`—`, `–`). 하이픈만 쓴다.
- 이모지를 아이콘 자리에 쓰기.
