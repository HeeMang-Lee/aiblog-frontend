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
  comment: "#5F685E"
  win-close: "#EC6A5E"
  win-min: "#F3BF4F"
  win-max: "#61C454"
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
  comment-dark: "#728275"
  win-close-dark: "#FF5F57"
  win-min-dark: "#FEBC2E"
  win-max-dark: "#28C840"
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

`keyword`와 `string`, `comment`는 **코드에만** 쓴다. UI 요소에 문법 강조 색을 칠하지 않는다.

**문법 강조는 새 색을 들이지 않는다.** `rehype-highlight`가 붙이는 `hljs-*` 클래스를 이미 있는 토큰에만 매핑한다. 키워드와 내장 타입은 `keyword`, 문자열과 숫자는 `string`, 함수와 클래스 이름은 `accent`, 속성과 변수는 `ink`, 데코레이터는 `meta`, 주석은 `comment`. 그래서 라이트와 다크가 자동으로 따라온다. 외부 하이라이트 테마 CSS를 가져오지 않는다 - 가져오면 팔레트 밖의 색이 통째로 들어온다.

**주석에 `gutter`를 쓰지 않는다.** `gutter`는 줄 번호처럼 읽지 않아도 되는 것의 색이라 편집면 위에서 대비가 1.97:1(다크) / 2.28:1(라이트)에 그친다. 주석은 장식이 아니라 읽어야 하는 내용이므로 `comment`(4.80:1 / 5.63:1)를 따로 뒀다.

**코드 블록은 에디터 판으로 보인다.** 언어 이름을 단 머리띠(`panel` 배경) + 코드 면(`editor` 배경)의 두 층이다. 이 사이트의 껍데기가 에디터인데 코드 블록이 평범한 글처럼 나오면 그게 실수로 읽힌다. 긴 줄은 접지 않고 가로로 흘린다 - 코드는 줄바꿈 위치가 의미다.

**Mono 뒤에 한글 서체를 명시한다.** IBM Plex Mono에는 한글 글립이 없어서, 지정하지 않으면 코드 블록 안의 한글 주석이 아무 시스템 폰트로 떨어진다. 라틴과 숫자는 그대로 Mono로 나가고 한글만 본문 서체를 빌린다.

**창 제어 점은 예외다.** 좌측 상단의 빨강·노랑·초록 세 점만 다른 색조를 쓴다. 이건 장식이 아니라 한눈에 읽히는 관습이라 액센트 규칙 밖에 둔다. 다크 `#FF5F57 / #FEBC2E / #28C840`, 라이트는 살짝 눌러서 `#EC6A5E / #F3BF4F / #61C454`. **동작하지 않으므로 버튼이 아니라 `aria-hidden` 장식으로 둔다.** 누를 수 있게 보이게 만들면 그때부터 거짓말이 된다.

**금지.** 버밀리언과 파랑 계열(이전 버전의 잔재). 네온 글로우를 텍스트에 거는 것. 그라데이션. 창 제어 점 외의 다른 색조.

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

본문 measure는 **90ch**를 넘지 않는다. `ch`는 숫자 `0`의 폭이라 한글은 그 두 배를 차지한다. 90ch는 한글로 한 줄 49자다.

## Layout

- **셸은 뷰포트를 꽉 채운다.** 폭 상한도 바깥 여백도 두지 않는다. 띄워 놓으면 창이 떠 있는 것처럼 보이고 그만큼 글 읽는 자리가 깎인다.
- 3열: 탐색기 `220px` / 에디터 `1fr` / 우측 패널 `248px`.
- **글 기둥은 에디터 칸 안에서 가운데로 둔다(`92ch`).** 셸이 넓어진 만큼 왼쪽에 붙여 두면 오른쪽이 통째로 빈다. 목록의 줄은 예외로, 행 전체가 클릭 대상이라 끝까지 채운다.
- **`lg` 미만에서 우측 패널을 숨긴다.** 아래로 쌓으면 본문이 한 화면만큼 밀린다.
- **`md` 미만에서 탐색기는 서랍이 된다.** 타이틀바의 버튼으로 연다.

## Elevation & Depth

**그림자가 없다.** 패널 구분은 배경 명도 차이와 1px 괘선으로만 한다. 에디터가 가장 밝고(다크에서는 가장 어둡고), 패널이 그다음, 바깥 배경이 그 밖이다.

카드를 만들지 않는다. 이 화면에 떠 있는 표면은 없다.

## Shapes

**반경은 2px 하나다.** 에디터의 패널은 각지다. `rounded-full`까지 2px로 매핑해 두었다.

**예외는 창 제어 점 셋뿐이다.** 이것만 완전한 원(`rounded-[50%]`)이다. 잠금이 `rounded-full`도 2px로 눌러버려서 그냥 쓰면 사각형이 된다. 이 화면에서 둥근 것은 이 셋이 전부여야 한다.

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
- 본문은 16px / lh 1.8 / 90ch. **셸이 에디터여도 글은 읽으라고 있는 것이다.**
- 터미널 문구는 실제 동작과 맞춘다.

**하지 않는다**

- **스캔라인·CRT 곡률·글로우를 본문 텍스트에 걸기.** 해커 감성은 셸에서 내고 문장은 건드리지 않는다. 가는 가로줄은 가독성을 직접 해치고 저시력 사용자에게는 읽기를 불가능하게 만든다.
- 한글에 `font-mono`.
- 열리지 않는 가짜 탭, 동작하지 않는 가짜 버튼, 의미 없는 가짜 로그.
- 카드와 그림자.
- 버밀리언·파랑 계열.
- 줄표(`—`, `–`). 하이픈만 쓴다.
- 이모지를 아이콘 자리에 쓰기.
