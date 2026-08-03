---
name: AI Blog
description: 포트폴리오와 같은 조판 언어를 쓰되, 읽기를 위해 밀도를 낮춘 개인 기술 블로그
colors:
  paper: "#FBFBFA"
  paper-sunk: "#F4F4F2"
  ink: "#16161A"
  ink-body: "#43434B"
  ink-meta: "#6E6E78"
  rule: "#E3E3E0"
  rule-strong: "#C9C9C4"
  accent: "#D14424"
  accent-hover: "#A83519"
  code-bg: "#F3F3F1"
  paper-dark: "#111112"
  paper-sunk-dark: "#17171A"
  ink-dark: "#F2F2F0"
  ink-body-dark: "#B4B4BC"
  ink-meta-dark: "#84848E"
  rule-dark: "#28282C"
  rule-strong-dark: "#3D3D43"
  accent-dark: "#FF6A45"
  accent-hover-dark: "#FF8A6B"
  code-bg-dark: "#1A1A1E"
typography:
  display:
    fontFamily: "'IBM Plex Sans KR', 'Apple SD Gothic Neo', sans-serif"
    fontSize: "clamp(1.75rem, 4vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  heading:
    fontFamily: "'IBM Plex Sans KR', 'Apple SD Gothic Neo', sans-serif"
    fontSize: "22px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  lead:
    fontFamily: "'IBM Plex Sans KR', 'Apple SD Gothic Neo', sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: "-0.01em"
  article:
    fontFamily: "'IBM Plex Sans KR', 'Apple SD Gothic Neo', sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.8
    letterSpacing: "-0.005em"
  body:
    fontFamily: "'IBM Plex Sans KR', 'Apple SD Gothic Neo', sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "-0.005em"
  small:
    fontFamily: "'IBM Plex Sans KR', 'Apple SD Gothic Neo', sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0.02em"
  label:
    fontFamily: "'IBM Plex Sans KR', 'Apple SD Gothic Neo', sans-serif"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.02em"
  label-mono:
    fontFamily: "var(--font-plex-mono), 'IBM Plex Mono', ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.08em"
rounded:
  base: "2px"
spacing:
  hairline: "1px"
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "32px"
  xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.base}"
    padding: "10px 18px"
    typography: "{typography.small}"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
    textColor: "{colors.paper}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.base}"
    padding: "10px 18px"
    typography: "{typography.small}"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.base}"
    padding: "10px 12px"
    typography: "{typography.body}"
---

## Overview

포트폴리오 사이트(`aiportfolio`)와 **같은 조판 언어**를 쓴다. 같은 서체, 같은 액센트, 같은 괘선, 같은 2px 반경. 두 사이트를 오가는 사람이 같은 손에서 나왔다고 느껴야 한다.

다른 점은 밀도다. 포트폴리오는 훑어보고 판단하는 화면이고, 블로그는 **앉아서 읽는 화면**이다. 그래서 본문이 15px가 아니라 16px이고 행간이 1.75가 아니라 1.8이다.

화면이 두 종류다.

- **공개 블로그** (`/`, `/posts/[id]`, `/categories/[id]`) — 읽기가 전부다. 글에 도달하는 데 방해가 되는 것은 전부 뺀다.
- **어드민** (`/admin/*`) — 작업하는 화면이다. 밀도를 올리고 상태를 분명히 한다. 본인만 본다.

## Colors

포트폴리오와 동일한 팔레트다. 액센트는 **버밀리언 `#D14424`** 하나.

| 역할 | 라이트 | 다크 |
|---|---|---|
| 배경 | `#FBFBFA` | `#111112` |
| 가라앉은 면 | `#F4F4F2` | `#17171A` |
| 제목 | `#16161A` | `#F2F2F0` |
| 본문 | `#43434B` | `#B4B4BC` |
| 메타 | `#6E6E78` | `#84848E` |
| 괘선 | `#E3E3E0` | `#28282C` |
| 액센트 | `#D14424` | `#FF6A45` |
| 코드 배경 | `#F3F3F1` | `#1A1A1E` |

**액센트 사용 규칙.** 본문 안의 링크, 현재 선택된 카테고리, 인용문 좌측 선, 어드민의 파괴적 동작(삭제) 확인. 이 넷뿐이다. 카테고리 이름이나 날짜에 액센트를 칠하지 않는다. 목록에서 모든 항목이 액센트를 달면 아무것도 강조되지 않는다.

**금지.** 파랑 계열 전부. 특히 이전에 쓰던 토스 팔레트(`#3182f6`, `#191f28`, `#4e5968`). 그라데이션. 태그 배경에 옅은 파랑을 까는 패턴.

## Typography

**IBM Plex Sans KR** + **IBM Plex Mono.** 포트폴리오와 동일하게 한글 청크를 `public/fonts/plex-kr`에 자체 호스팅한다.

**Mono는 한글에 절대 쓰지 않는다.** Plex Mono에 한글 글립이 없어서 한글만 시스템 폰트로 대체되고 공백이 고정폭이라 자간이 벌어진다. Mono는 코드, 날짜, 조회수, 숫자, 라틴 라벨에만.

| 단 | 크기 | 쓰는 곳 |
|---|---|---|
| display | `clamp(1.75rem, 4vw, 2.5rem)` / 600 | 글 상세의 제목 |
| heading | 22px / 600 | 섹션 제목, 어드민 페이지 제목 |
| lead | 18px / 600 | 목록의 글 제목 |
| **article** | **16px / lh 1.8** | **글 본문. 이 사이트의 주인공** |
| body | 15px / lh 1.7 | 목록 요약, 어드민 폼 |
| small | 13px | 메타 정보, 표, 보조 설명 |
| label | 11px / 0.02em | 짧은 표식 |
| label-mono | 11px / 0.08em / Mono | 날짜, 조회수, 라틴 라벨 |

본문 measure는 **68ch**를 넘지 않는다. 한 줄이 길어지면 다음 줄 첫 글자를 찾는 데 눈이 흔들린다.

## Layout

- 글 읽는 폭 `68ch`, 목록과 헤더는 `max-w-[760px]`, 어드민은 `max-w-[1100px]`.
- 좌우 패딩 `20px`(모바일) / `32px`(데스크톱).
- 헤더 높이 `64px` 고정. 한 줄을 넘지 않는다.

**계열이 겹치지 않게 한다.**

| 화면 | 계열 |
|---|---|
| 글 목록 | 괘선으로 구분한 세로 행. 좌측 본문, 우측 썸네일 |
| 대표 글 | 목록 맨 위 전폭 행. 이미지가 위, 제목이 아래 |
| 글 상세 | 단일 열. 제목 블록 + 괘선 + 본문 |
| 카테고리 | 목록과 같은 행 계열, 헤더만 다름 |
| 어드민 목록 | 괘선 표 |
| 어드민 폼 | 라벨 위, 입력 아래의 세로 스택 |

## 홈 히어로

**장식이 허용되는 곳은 홈 상단 하나뿐이다.** 나머지 화면은 계속 조용해야 한다.

글이 없거나 커버 이미지가 없을 때 목록만 있는 홈은 미완성으로 읽힌다. 그래서 홈에만 회전하는 격자(three.js)를 둔다. 규칙은 이렇다.

- **어두운 무대 위에 올린다.** 캔버스를 투명하게 두지 않는다. 블룸과 ACES 톤매핑이 비워진 배경에도 적용돼서, 투명하게 두면 페이지 위에 옅은 사각형이 그대로 보인다. 무대를 주면 라이트 모드에서도 액센트 발광이 산다.
- **액센트는 조명으로 넣는다.** 재질에 색을 칠하지 않는다. 버밀리언 포인트 라이트가 만든 하이라이트를 블룸이 집어 올리는 방식이라, 발광이 브랜드 색을 띤다.
- **iridescence 는 0.15 이하.** 그 위로 올리면 물체 전체가 초록으로 돌아 버밀리언과 싸운다.
- 값을 직접 대입하지 않는다. 포인터든 회전이든 전부 램핑(감쇠 0.075)을 거친다. 튀는 순간 데모처럼 보인다.
- `prefers-reduced-motion` 이면 한 프레임만 그리고 멈춘다.
- 지연 로드한다. 본문이 먼저 그려진 뒤 브라우저에서만 불러온다.
- WebGL 이 없으면 무대만 남기고 넘어간다. 페이지는 그대로 읽힌다.
- 텍스처지 주인공이 아니다. 제목보다 눈에 띄면 잘못된 것이다.

**환경맵 없이 금속을 쓰지 않는다.** `metalness: 1` 인데 반사할 것이 없으면 검은 덩어리가 된다. HDRI 파일을 받지 않고 `RoomEnvironment` 로 해결한다.

이 예외를 다른 페이지로 넓히지 않는다. 글 상세에 3D를 넣으면 읽는 것을 방해한다.

## Elevation & Depth

**깊이가 없다.** 그림자, 카드, 떠 있는 표면을 쓰지 않는다.

이전 버전은 `bg-card`, `bg-card-hover`, `rounded-xl` 썸네일, `rounded-2xl` 히어로로 이루어져 있었다. 전부 제거됐다.

위계는 **1px 괘선**, **여백**, **타이포 굵기와 크기**로만 만든다. `paper-sunk`는 코드 블록과 어드민의 표 헤더처럼 "여기는 입력이 아니라 배경"임을 알려야 할 때만 쓴다.

## Shapes

**반경은 2px 하나다.** 버튼, 입력, 썸네일, 코드 블록, 태그 전부 동일하다. Tailwind의 `rounded-full`과 `rounded-2xl`까지 2px로 매핑해 두었으므로 실수로 써도 알약이 되살아나지 않는다.

알약형 카테고리 필터(`rounded-full`)는 이 사이트의 이전 버전이 쓰던 것이고, 금지다.

## Components

**글 목록 행.** 항목 사이에 `border-t` 하나. 마지막 항목 아래에 닫는 선을 넣지 않는다. 호버에서 배경을 칠하지 않는다. 제목에만 액센트가 들어온다. 한 번에 하나만 켜지므로 액센트 규칙을 깨지 않는다.

**카테고리는 헤더가 소유한다.** 목록 페이지에 필터 줄을 따로 두지 않는다. 이전 버전은 헤더의 햄버거 메뉴와 홈의 알약 필터가 같은 카테고리를 두 번 보여줬다. 데스크톱에서는 헤더에 밑줄 탭으로 펼치고, 모바일에서만 햄버거로 접는다.

**메타 줄.** `카테고리 · 날짜 · 조회수`. 날짜와 조회수는 Mono, 카테고리는 Sans. 가운뎃점은 한 줄에 필요한 만큼만 쓴다.

**카테고리 필터.** 알약이 아니라 밑줄 탭이다. 선택된 항목만 잉크색 + 2px 하단 액센트 선, 나머지는 메타색.

**버튼.** 기본은 잉크 채움 + 종이색 글자, 호버에서 액센트. 유령 버튼은 1px 괘선. 삭제처럼 되돌릴 수 없는 동작만 액센트 테두리를 쓴다.

**폼.** 라벨은 입력 위에. 플레이스홀더를 라벨 대신 쓰지 않는다. 에러는 입력 아래에 액센트색으로. 포커스 링은 제거하지 않는다.

**빈 상태와 로딩.** 스피너 대신 최종 레이아웃과 같은 모양의 골격을 보여준다. 빈 상태는 무엇을 하면 채워지는지 한 줄로 알린다.

## Do's and Don'ts

**한다**

- 본문 16px, 행간 1.8, 최대 68ch.
- 구획은 1px 괘선과 여백으로.
- 날짜와 숫자는 Mono, 한글은 Sans.
- 액센트는 본문 링크, 선택된 카테고리, 인용 선, 삭제 확인에만.
- 다크 모드를 함께 확인하고 넘긴다.

**하지 않는다**

- 카드. `bg-card` + `rounded-xl` 블록을 다시 만들지 않는다.
- 알약. `rounded-full` 카테고리 필터와 태그 배지.
- 토스 팔레트(`#3182f6` 계열)와 파랑 액센트.
- Geist, Inter, Roboto, Pretendard, 시스템 기본 스택.
- 한글에 `font-mono`.
- 이모지를 아이콘 자리에 쓰기.
- 줄표(`—`, `–`). 하이픈만 쓴다.
- 목록의 모든 항목에 액센트 칠하기.
