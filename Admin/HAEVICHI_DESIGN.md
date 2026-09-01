# 해비치(Haevichi) 디자인 가이드 — 식단 어드민용

haevichi.com 실측 기반. 브랜드 톤(에디토리얼 럭셔리, 차분한 네이비/그레이)을 유지하되,
어드민 도구 특성상 정보 밀도·가독성·작업 속도를 우선한 실용 버전.

## 1. 컬러

| 용도 | 값 | 비고 |
|---|---|---|
| Primary (accent) | `#156AAF` (rgb(21,106,175)) | 링크, 버튼, 활성 상태 |
| Text - Body | `#666666` | 본문 텍스트 |
| Text - Heading | `#333333` | 소제목 |
| Text - Strong | `#000000` | 큰 타이틀(OFFERS, EVENT 등 섹션 헤더) |
| Border/Divider | `#F2F2F3` | 옅은 회색 구분선 |
| Muted | `#909090` / `#7F7F7F` | 캡션, prev/next, 비활성 |
| Background | `#FFFFFF` | 기본 배경 |
| Button 텍스트 | `#FFFFFF` on dark/accent bg | |

어드민 확장 제안(브랜드에 없는 상태색은 표준값 사용):
- Success `#2E7D32`, Warning `#B26A00`, Danger `#C62828`

## 2. 타이포그래피

- 본문/UI: `"Open Sans", "Noto Sans KR", sans-serif` — 폼, 테이블, 버튼, 메뉴 전부 이 폰트로 통일
- 세리프(minion-pro)는 마케팅 사이트 전용 장식 헤딩이므로 **어드민에는 사용하지 않음** (가독성·로딩 이슈)

권장 스케일 (어드민 기준으로 축소):
| 요소 | size | weight | letter-spacing |
|---|---|---|---|
| 페이지 타이틀 | 24px | 600 | -0.3px |
| 섹션 타이틀 | 18px | 600 | normal |
| 본문/테이블 | 14px | 400 | normal |
| 캡션/라벨 | 12px | 600 (버튼과 동일) | normal |

## 3. 컴포넌트 톤

- 버튼: 배경 accent(#156AAF) 또는 다크, 텍스트 흰색, weight 600, size 12px, 라운드 소폭(4px)
- 카드/테이블 row: 옅은 `#F2F2F3` 구분선, 배경 흰색, hover 시 아주 옅은 accent tint
- 여백: 브랜드 사이트처럼 넓은 여백은 유지하되 어드민 테이블은 밀도 위해 py 8-12px로 축소
- prev/next 같은 네비게이션 아이콘은 무채색(#7F7F7F~#909090), 클릭 시 accent

## 4. 어드민 적용 가이드 (식단 관리 페이지)

- 사이드/상단 네비: 다크 네이비 or 화이트+accent underline (브랜드 nav 톤 참고)
- 데이터 테이블(식단 목록/편집): 흰 배경 + `#F2F2F3` 줄 구분, 본문 14px `#666`, 강조 값은 `#333` 이상
- 상태 뱃지(제공중/중단/승인대기 등): accent 계열 outline 뱃지, 상태색은 위 확장 제안 사용
- CTA 버튼(저장/등록/삭제): Primary(#156AAF) / Danger(#C62828) 구분
- 폰트는 Open Sans + Noto Sans KR 조합 그대로 사용 (한글 혼용 최적화되어 있음)

---
출처: haevichi.com 실측 (컴퓨티드 스타일 스캔), 2026-08-31
