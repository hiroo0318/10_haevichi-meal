# 해비치 요건 반영 시안

개발 전달 시에는 [DEVELOPMENT_HANDOFF.md](DEVELOPMENT_HANDOFF.md)를 함께 확인한다.

`SB/01 해비치 요구사항/1. APP_추가기능, 수정사항.pdf` 회신을 반영한 화면입니다. `Structure` 폴더와 동일한 퍼블리싱 관례(리소스 폴더 구조, reset+style 분리, 코너별 flat html)를 따르되, 개발팀과 협의한 **flex 레이아웃**(하단 탭바 `position:fixed` 폐지)을 여기서 처음 적용했습니다.

## 반영/제외 결정

| 항목 | 결정 | 비고 |
| --- | --- | --- |
| 스플래시 | 반영 | 해비치 임시 워드마크를 중앙 노출하고 1.5초 후 로그인으로 전환. 제공 이미지 수령 시 교체, 실제 앱에서는 세션에 따라 로그인/홈으로 분기 |
| 로그인 디자인 | 반영 | 새 레이아웃(브랜드 영역, 필드 배치) |
| 회원가입 | 반영 | 사내 메일 확인 → 메일 인증 → 비밀번호 등록의 3단계 UI. 실제 도메인 조회·메일 발송은 개발 연동 대상 |
| 자동로그인 | 유지 | 기존 확정 기능(U-01), 요건서의 "간편 로그인"과는 별개 |
| 간편 로그인(네이버/카카오) | 제외 | 개발일정상 추가요건 미구현 |
| 홈 화면 메뉴 통합 | 반영 | 주간 날짜 스트립 + 조식/중식/석식 탭으로 "식단" 탭을 완전히 흡수 |
| 알림섹션 온오프 | 반영 | 공지 문구 클릭과 닫기 버튼을 제공하며, 닫으면 현재 화면에서 숨김 |
| 찜하기 | 제외 | 하트 아이콘 등 관련 요소 화면에서 전부 제거 |
| 상세 레이아웃(반찬별 칼로리·탄단지) | 반영 | **어드민이 식단 등록 시 입력한 값을 표시만 하는 구조** — 개인 "영양기록" 저장 기능이 아니다 |
| 상세 화면 내 코너 전환 | 제외 | 코너별 진입은 홈 카드에서 `?corner=`로 바로 들어오는 방식만 사용, 상세 화면 안에서 코너 A/B를 넘기는 탭은 없음 |
| 영양기록(개인 기록·마이페이지 저장) | 제외 | 개발일정상 추가요건 미구현 |
| 나의 의견 | 반영 | 상세 화면의 의견쓰기 링크는 제외하고, 하단 탭에서 진입하는 `voc.html`에 접수/내역 탭, 유형·내용·사진 첨부·제출 UI를 반영 |
| 공지사항 | 반영 | `notice-popup.html`에 홈 최초 진입 전체 공지 팝업 UI를 분리하고, 홈에는 상단 공지 요약을 제공. notice.html에서는 상단 고정 공지와 최신순 일반 공지, 동일 화면 상세 전환을 제공 |
| 헤더 뎁스 구조 | 반영 | 홈·나의 의견·공지(1뎁스)는 브랜드 헤더를 고정 노출하고, 식단/공지 상세(2뎁스)만 뒤로가기와 화면명 헤더를 사용 |
| 하단 탭바 | 변경 반영 | 홈 / 나의 의견 / 공지 / My 4개 ("식단" 탭 삭제, "VOC"는 "나의 의견"으로 명칭 변경) |
| 브랜드명 | 반영 | "FX By Haevichi" — 워드마크 텍스트는 회사별 공통, 색상만 테마로 분리 |
| 회사별 테마(멀티테넌트) | 반영 | 로그인 후 회사 정보 기준으로 대표 컬러 1개만 적용. 로그인·회원가입은 서비스 공통 스타일을 사용 |
| 홈 사업장 선택 버튼 | 제외 | 기획서(v0.5.2·v0.5.3) 확정사항인 "사업장 선택 UI는 임직원 채널에서 미노출"에 맞춰 홈 헤더의 "현대캐피탈 중구점" 버튼 제거 |
| 홈 날짜 스트립 | 반영 | 8/30~9/12 14일 고정 마크업, 한 화면에 7일만 보이도록 폭 계산. 오늘 날짜 자동 선택·스크롤은 퍼블리싱 범위에서 제외(개발 단계에서 스크립트 적용) |
| 홈 코너 카드 레이아웃 | 반영 | 모든 날짜에서 한 줄 2개 구조를 사용한다. |
| 홈 식단 없음 상태 | 반영 | 9/3은 조식만 식단 없음, 9/4는 하루 전체 식단 없음 검토 데이터로 구성했다. |

## 코드 구조

```
해비치 요건 반영 시안/
├─ login.html / signup.html / home.html / menu-detail.html / voc.html / voc-list.html / notice.html / my.html / my-password.html / my-policy.html / terms.html / privacy.html / withdraw.html / app-version.html
└─ resources/
   ├─ css/reset.css · style.css · theme-hyundaicapital.css · theme-haevichi.css
   ├─ js/common.js       (페이지별 블록을 주석으로 구분, MEALS 데이터 포함)
   └─ images/icon · images/menu
```

- `.page`는 `display:flex; flex-direction:column`이고 `.content`가 `flex:1; overflow-y:auto`로 스크롤을 담당, `.tabbar`는 `position:fixed` 없이 흐름의 마지막 요소다. 실기기 키보드·안전영역 대응 이슈(이전 논의 참고)가 구조적으로 해결된다.
- `menu-detail.html?meal=lunch&corner=b` 형태의 쿼리로 특정 끼니·코너에 바로 진입할 수 있다.
- 데스크톱 미리보기 카드 스타일은 `(hover:hover) and (pointer:fine)` 조건으로 제한해, 하이브리드 앱 WebView·터치 기기에서는 발동하지 않는다.

## 회사별 테마(멀티테넌트) 구조

여러 고객사에 같은 화면 코드를 재사용하기 위한 색상 관리 구조다. **어드민이 관리해야 하는 값은 회사별 대표 컬러 1개뿐**이다.

- `style.css`는 로그인 전 공통 화면을 위한 기본 서비스 컬러를 제공한다. 로그인 후 컴포넌트는 `var(--brand-primary)` / `var(--brand-primary-light)` / `var(--brand-primary-bg)` 토큰을 참조하며, 회사별 테마가 이 값을 덮어쓴다.
- 밝은 톤·배경 톤은 어드민이 따로 입력하지 않고 `color-mix(in srgb, var(--brand-primary), white N%)`로 `style.css`가 자동 계산한다 — 관리 대상이 늘어나지 않는다.
- 회사별 값은 `theme-*.css` 파일 한 줄로 분리한다.
  - `theme-hyundaicapital.css` — `--brand-primary: #1976D2;` (기존 인터랙션 블루)
  - `theme-haevichi.css` — `--brand-primary: #3D7A45;` (해비치 요구사항 회신 PDF 1페이지 "FUNCTION OBJECTIVE" 배너의 녹색 계열 참고 **잠정값** — 정식 브랜드 가이드 확정 시 이 한 줄만 교체)
- 스플래시·로그인·회원가입은 `reset.css`와 `style.css`만 로드하는 공통 화면이다. 아직 회사 정보가 확정되지 않았으므로 회사별 `theme-*.css`를 적용하지 않는다.
- 로그인 후 화면의 `<head>`는 `style.css` 다음에 회사별 `<link id="themeLink" href="resources/css/theme-*.css">`를 로드한다. 실제 서비스에서는 로그인 세션의 회사 정보를 기준으로 서버 또는 앱 셸이 해당 테마를 적용한다.
- 이 폴더에서는 로그인 후 화면을 비교할 수 있도록 URL에 `?theme=haevichi`를 붙이면(`common.js`) 데모용으로 테마가 전환된다. 예: `home.html?theme=haevichi`
- 로그인 버튼(`.btn-dark`)은 의도적으로 테마 대상에서 제외했다 — PDF 목업상 항상 짙은 고정색이라, 회사색과 무관하게 두는 편이 톤 대비상 안전하다.
- 탭바 아이콘은 색이 없는 shape-only svg(`resources/images/icon/ic-*.svg`)를 `mask-image` + `background-color:currentColor`로 찍는 방식으로 바꿔, 활성/비활성 아이콘 파일을 따로 두지 않고도 `--brand-primary`를 자동으로 따라가게 했다.

## 발견/수정한 버그

- **탭바 아이콘 미노출**: `span.icon`이 기본 `display:inline`이라 `width/height`가 적용되지 않아 아이콘이 0 크기로 사라졌던 문제 — `display:block` 추가로 해결.
- **아이콘 마스크 경로 오류**: CSS 커스텀 프로퍼티(`--icon`) 안의 상대경로 `url()`은 그 값을 정의한 HTML 파일이 아니라 **`var()`를 실제로 쓰는 CSS 파일(`resources/css/style.css`) 기준**으로 해석된다는 스펙을 놓쳐, `resources/images/icon/...` 경로가 `resources/css/resources/images/icon/...`로 잘못 풀렸던 문제 — `../images/icon/...`로 수정.
- **PC 크롬에서 리스트 영역 가로 스크롤**: `.content`에 `overflow-y:auto`만 지정하고 `overflow-x`를 지정하지 않으면 스펙상 `overflow-x`도 자동으로 `auto`가 되어, 카드 폭의 미세한 오차만으로 가로 스크롤이 열리던 문제 — `.content`·`.login-content`에 `overflow-x:hidden` 명시로 해결.

## 모바일 사이즈 점검 (홈·상세)

iOS/Android 권장 최소 탭 타겟(약 44px)과 최소 가독 크기(약 11px) 기준으로 점검 후 반영.

- `.back-btn`(상세 뒤로가기) 34px → 44px
- `.stars button`(별점) 히트 영역 확보를 위해 padding 추가
- `h1.detail-name`에 `margin:0` 명시(브라우저 기본 h1 마진 상속으로 생기던 의도치 않은 여백 제거), `.detail-top`에 `flex-wrap` 추가(긴 메뉴명 대응)
- `.macro-value small`(탄단지 단위) 10.5px → 11.5px
- `.meal-tab`(조/중/석 탭) padding 11px → 13px
- `.corner-list--grid2 .corner-name` 14px → 15px
- `.place-switch`(사업장 선택, 이후 제거됨) padding-y 8px → 10px

## 미확정/후속 확인 사항

- 해비치 정식 브랜드 컬러(정확한 hex) 확정 필요 — 현재 `theme-haevichi.css`의 녹색은 PDF 이미지를 보고 추정한 잠정값
- 로고 그래픽 요소(워드마크 이미지화 여부) 확정 필요
- 상세 화면의 반찬별 칼로리·탄단지 데이터는 어드민 식단 관리 화면(A-03)에 입력 필드 추가가 필요함 — 개발 범위에 별도 반영
- 사진 첨부의 실제 파일 업로드 방식, 허용 형식·용량 제한은 개발 단계에서 확정 필요 (퍼블리싱에는 최대 3장 UI만 반영)
- 로그인 후 세션의 회사 정보를 기준으로 회사별 `theme-*.css`를 적용하는 방식을 개발에서 확정해야 한다. 비로그인 화면에는 회사 테마를 적용하지 않는다.
- `SB/해비치_급식App_화면기획서_v0.5.3.html`(2026-09-01) 확인 결과, 홈 화면 정책 문구는 "인사 문구와 사업장 선택 영역을 노출하지 않는다"라고 되어 있는데 같은 화면의 목업 텍스트에는 "오늘 뭐드실래요?" 인사 문구가 남아있어 문서 자체에 모순이 있음 — 인사 문구를 유지할지 여부는 이상경 님 확인 필요 (현재 이 폴더의 홈 화면은 인사 문구를 유지한 상태)
