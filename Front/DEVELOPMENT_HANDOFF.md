# 해비치 급식 App 퍼블리싱 개발 전달 가이드

작성일: 2026-09-16
**개발 착수 기준은 `service-v3/` 입니다.** Front 루트와 `service-v2/`는 이전 검토본이며 인계 대상이 아닙니다.

## 1. 전달 범위

`PUBLISH/Front/service-v3/`는 임직원용 해비치 급식 App의 사용자 화면 퍼블리싱 결과물입니다.
화면 구조, 컴포넌트 스타일, 화면 이동과 검토용 클라이언트 인터랙션을 포함합니다.

- 기준 문서: 해비치 디자인 의견 `1. APP_기준 설정.pdf` (2026.09.15)
- 대상: 임직원 사용자 화면
- 제외: `PUBLISH/Admin` 어드민 화면
- 폴더는 독립 실행됩니다. HTML·CSS·JS·폰트·이미지를 모두 `service-v3/resources/` 안에서 참조하며, Front 루트의 `resources/`를 쓰지 않습니다.

| 함께 볼 문서 | 내용 |
| --- | --- |
| [`service-v3/TYPOGRAPHY_SCALE.md`](service-v3/TYPOGRAPHY_SCALE.md) | 타이포그래피 적용 기준. **6장이 개발용**입니다 |

## 2. 폴더 구조

```text
service-v3/
├─ splash.html                앱 시작 스플래시
├─ login.html                 로그인
├─ signup.html                회원가입 (4단계)
├─ password-reset.html        비밀번호 재설정 (3단계)
├─ home.html                  홈 / 주간 식단 조회
├─ menu-detail.html           식단 상세
├─ voc.html                   나의 의견 접수
├─ voc-list.html              나의 의견 내역
├─ notice.html                공지 목록
├─ notice-detail.html         공지 상세 (독립 2뎁스 URL)
├─ notice-popup.html          홈 최초 진입 전체 공지 팝업 미리보기
├─ alert-popup.html           공통 일반 알럿 미리보기 (확인형 / 선택형)
├─ my.html                    My 메인
├─ my-password.html           비밀번호 변경
├─ my-policy.html             약관·개인정보처리방침 목록
├─ terms.html / privacy.html  이용약관 / 개인정보처리방침
├─ app-version.html           앱 버전·오픈소스 라이선스
├─ withdraw.html              회원 탈퇴
└─ resources/
   ├─ css/
   │  ├─ reset.css            최소 리셋
   │  ├─ style.css            초기 퍼블리싱 구조·레이아웃 (수정 대상 아님 — 3장)
   │  ├─ theme-haevichi.css   회사 대표색 1개
   │  ├─ service.css          로그인 후 화면 디자인 시스템 + 타이포 스케일
   │  └─ auth.css             인증 화면 전용
   ├─ js/
   │  ├─ common.js            로그인 후 화면 동작
   │  ├─ auth.js              인증 화면 동작
   │  └─ theme-oncolor.js     대표색 위 글자색 결정 (head에서 동기 로드 — 4-3)
   ├─ fonts/PretendardVariable.woff2
   └─ images/                 brand / icon / menu
```

## 3. CSS 구조 — 가장 먼저 읽을 것

### 로드 순서

**뒤에 오는 파일이 앞을 덮습니다.** 순서를 바꾸면 화면이 깨집니다.

```html
<!-- 로그인 후 서비스 화면 -->
<link rel="stylesheet" href="resources/css/reset.css">
<link rel="stylesheet" href="resources/css/style.css">
<link rel="stylesheet" href="resources/css/theme-haevichi.css" id="themeLink">
<link rel="stylesheet" href="resources/css/service.css">
<script src="resources/js/theme-oncolor.js"></script>   <!-- 반드시 head, 동기 로드 -->

<!-- 인증 화면 (회사 확정 전 화면이므로 테마를 연결하지 않음) -->
<link rel="stylesheet" href="resources/css/reset.css">
<link rel="stylesheet" href="resources/css/style.css">
<link rel="stylesheet" href="resources/css/auth.css">
```

### `style.css`는 수정하지 않습니다

`style.css`는 초기 퍼블리싱본이 공유하는 파일입니다. 현재 디자인 값은 `service.css` · `auth.css`가
**같은 선택자로 덮어쓰는** 구조이며, 특이도를 맞추고 로드 순서로만 이깁니다.

```css
/* style.css — 이전 값 */
.corner-list--grid2 .corner-desc{ font-size:11.5px; }

/* service.css — 같은 특이도, 뒤에 오므로 이김 */
.corner-desc,.corner-list--grid2 .corner-desc{ font-size:var(--fs-body-sm); font-weight:400; }
```

- 값을 바꿀 때는 **`service.css` · `auth.css`**를 수정합니다.
- `style.css`에는 반영되지 않은 이전 값(반 px, 굵기 700~900)이 남아 있습니다. 확인은 반드시 브라우저 개발자도구의 **최종 계산값(Computed)** 기준으로 합니다.
- 개발 프레임워크로 옮길 때 `style.css`의 값을 그대로 가져가지 마십시오.

### 폰트

전 화면 Pretendard Variable 한 종입니다. `font-weight:45 920` 가변 폰트라 굵기별 파일이 필요 없습니다.

`@font-face`는 **`service.css`와 `auth.css`에 각각** 선언되어 있습니다. 인증 화면은 `service.css`를
로드하지 않기 때문입니다. `style.css`의 `--font`에는 Pretendard가 없으므로, 두 파일이 각각 덮습니다.

> 새 CSS 파일을 만들고 그 파일만 로드하는 화면이 생긴다면 `@font-face`와 `--font`를 함께 선언해야 합니다.

## 4. 반드시 유지할 구현 원칙

### 4-1. 하단 탭바 — `position:fixed` 아님

개발 의견을 반영해 탭바는 flex 흐름의 마지막 요소입니다.

```text
.page (flex column, 화면 높이)
├─ header (필요한 화면만)
├─ .content (flex:1 + 내부 스크롤)
└─ .tabbar (일반 흐름 요소)
```

- `.content`만 `overflow-y:auto`로 스크롤합니다.
- 모바일 WebView 키보드·안전영역 이슈를 줄이기 위한 구조입니다. fixed 탭바로 되돌리지 마십시오.
- 항목은 **홈 / 나의 의견 / 공지 / My** 4개로 고정입니다.
- 현재 선택 상태 클래스는 `.is-active`이며, 같은 항목에 `aria-current="page"`를 함께 둡니다.
- 2뎁스 화면은 상위 항목을 활성 표시합니다. 식단 상세 → `홈`, 공지 상세 → `공지`.

**탭바 노출 화면 (7개)**

| 노출 | `home` · `menu-detail` · `voc` · `voc-list` · `notice` · `notice-detail` · `my` |
| --- | --- |
| **미노출** | 인증 4개 화면, `my-password`, `my-policy`, `terms`, `privacy`, `app-version`, `withdraw`, 팝업 2개 |

식단 상세·공지 상세는 2뎁스지만 탭바를 노출합니다. PDF 주석(식단 상세 12번, 공지 12번)에 Bottom Navigation이 명시되어 있기 때문입니다.

### 4-2. 탭바 아이콘 — data URI 마스크

아이콘은 `service.css`에 **data URI로 인라인**되어 있습니다. 외부 `.svg` 파일이 아닙니다.

- CSS `mask`는 `background-image`와 달리 동일 출처 제한을 받습니다. `file://`로 HTML을 직접 열면 외부 `.svg` 마스크가 차단되어 아이콘이 사라집니다.
- 색은 `currentColor`가 담당하므로 **활성/비활성 아이콘 파일을 따로 두지 않습니다.**
- 아이콘 원본은 `resources/images/icon/ic-home|voc|notice|my.svg`입니다. 원본을 고치면 `service.css`의 data URI도 함께 갱신해야 합니다(갱신 방법은 해당 위치 주석 참고).
- 번들러를 쓰는 환경으로 옮기면 외부 파일 참조로 되돌려도 됩니다. 단, 정적 파일을 직접 여는 검토 환경이 남아 있다면 data URI를 유지하십시오.

### 4-3. 테마 / 브랜드 컬러

- 회사별 관리 값은 **`--brand-primary` 1개**입니다. `service.css`가 파생색을 계산합니다.

```css
/* resources/css/theme-{company-code}.css */
:root { --brand-primary: <회사 대표색>; }
```

| 토큰 | 계산식 | 역할 |
| --- | --- | --- |
| `--brand-primary` | 회사 대표색 | 선택 상태, 주요 CTA, 필독 배지 |
| `--brand-primary-bg` | `color-mix(srgb, primary 7%, #FEFFFF)` | 공지 바, 주요 공지 배경 |
| `--brand-primary-pressed` | `color-mix(srgb, primary 88%, #171A1F)` | 버튼 누름 상태 |

**대표색 위 글자색 — `--brand-on-primary`**

대표색이 밝으면 흰 글자가 읽히지 않습니다. 글자색은 고정하지 않고 토큰으로 공급합니다.

| 경로 | 조건 | 동작 |
| --- | --- | --- |
| A | 테마 파일이 `--brand-on-primary`를 지정 | 그 값을 그대로 사용. 스크립트 개입 없음 |
| B | 지정 없음 | `theme-oncolor.js`가 대표색의 CIE `L*`로 판정. `L* < 55` → `#FFFFFF`, 그 외 → `#171A1F` |

- `L* 52`가 흰 글자와 `#171A1F` 글자의 대비가 같아지는 교차점입니다. 55는 경계 부근을 흰 글자 쪽으로 약하게 치우치게 한 값입니다.
- **런타임에 대비를 비교해 고르는 방식은 쓰지 않습니다.** 회색 계열은 흰색·검정 대비가 둘 다 4 언저리라 대표색이 조금만 달라져도 결과가 뒤집힙니다.
- 해비치 `#70747A`는 `L* 48.7`이라 A·B 어느 경로로도 `#FFFFFF`입니다.
- `theme-oncolor.js`는 **`<head>`에서 테마 링크 뒤에 동기 로드**해야 합니다. 본문 스크립트처럼 `</body>` 앞에 두면 첫 페인트 이후 글자색이 한 번 튑니다.
- 테마 링크를 런타임에 교체하면 CSS가 비동기로 다시 로드되므로, 스크립트가 `load` 이벤트에서 다시 판정합니다.
- 적용 대상은 `service.css`의 대표색 배경 6곳입니다: 선택 날짜 · 끼니 탭 · 접수/내역 탭 · 필독 배지 · 주요 버튼 · 확인 버튼(팝업/알럿).
- **인증 화면은 대상이 아닙니다.** 회사 확정 전 화면이라 테마를 쓰지 않고 `--auth-cta` 고정색을 씁니다.

- 일반 카드·본문·구분선은 **중립 토큰**을 씁니다. 대표색이 바뀌어도 정보 위계가 흔들리지 않게 하기 위함입니다.
- 서비스 고유 색 `--service-primary-blue: #156AAF`는 회사 테마와 **분리된 고정색**입니다(화면 제목, 답변 완료 상태, 로그아웃·회원 탈퇴).
- 로그인 성공 후 세션의 회사 코드로 해당 `theme-*.css`를 연결합니다. 하위 URL 직접 진입 시에도 세션 기준으로 적용합니다.
- 인증 화면은 회사 확정 전이므로 테마를 적용하지 않습니다.
- `?theme=haevichi` 쿼리는 퍼블리싱 비교용입니다. **현재 모든 서비스 화면이 `theme-haevichi.css`를 정적으로 링크하고 있으므로 이 스위처는 실질 동작이 없습니다.** 운영에서는 서버/앱 셸이 링크를 주입하는 방식으로 교체합니다.

### 4-4. 타이포그래피

- 크기는 `service.css`의 `:root` 토큰(`--fs-caption` ~ `--fs-display`)을 참조합니다. 개별 화면에서 px를 직접 쓰지 않습니다.
- 굵기는 **400 / 600 두 단계만** 사용합니다.
- 상세 기준과 레벨별 용도는 [`TYPOGRAPHY_SCALE.md` 6장](service-v3/TYPOGRAPHY_SCALE.md)을 보십시오.

### 4-5. 메뉴 이미지 — 원본 비율 유지

- 홈 카드와 식단 상세 대표 이미지 모두 **업로드 원본 비율을 그대로** 씁니다. 고정 비율 크롭을 적용하지 않습니다.
- 카드·히어로 높이는 등록된 이미지 비율을 따릅니다. 현재 샘플은 4종 모두 1672×941(16:9)입니다.

## 5. 화면별 개발 인수 기준

| 화면 | 퍼블리싱 상태 | 개발 구현 대상 |
| --- | --- | --- |
| 스플래시 | 브랜드 메시지 + 로고, 1.5초 후 로그인 이동(`location.replace`) | 앱 시작 시 세션 확인 후 로그인 또는 홈 분기 |
| 로그인 | 입력·오류 상태·자동로그인 UI, 제출 시 홈 이동 | 로그인 API, 세션, 자동로그인 저장, 실패 횟수 정책 |
| 회원가입 | 메일 → 인증번호 → 추가 정보 → 비밀번호 **4단계**, 완료 시 홈 이동 | 허용 도메인 조회, 메일 발송·인증, 가입 API, 단계 히스토리 |
| 비밀번호 재설정 | 메일 → 인증번호 → 새 비밀번호 **3단계**, 완료 시 로그인 이동 | 메일 발송·인증, 비밀번호 변경 API |
| 홈 | 주간 이동·날짜·끼니 탭·2열 코너 카드·식단 없음 상태·의견 쓰기 | 사업장/날짜별 식단 API, 오늘 날짜 기준 초기 선택, 메뉴 식별값을 포함한 VOC 진입 |
| 식단 상세 | 대표 이미지·메뉴별 kcal·영양 정보·의견 쓰기 | 식단 상세 API, 메뉴 식별값을 포함한 VOC 진입 |
| 나의 의견 접수 | 분류 칩·본문 500자·사진 3장 첨부·완료 알럿 | 접수 API, 파일 업로드, 용량·형식 서버 검증 |
| 나의 의견 내역 | 상태 배지·답변 영역·첨부 확대 | 내역 API, 답변 연동 |
| 공지 | 홈 최초 진입 팝업, 목록(중요/전체), 독립 상세 URL | 공지 API, 팝업 노출 기간·대상, 오늘 하루 미노출 저장, 상세 ID 라우팅 |
| My | 이메일·소속·메뉴·로그아웃·회원 탈퇴 | 사용자 프로필 API, 로그아웃 |
| 비밀번호 변경 | 현재 비밀번호 → 새 비밀번호 2단계 | 현재 비밀번호 검증, 변경 API |
| 약관/개인정보 | 목록·개별 상세·이전 버전 선택 UI | 확정 문안·버전·시행일 연동 |
| 앱 버전 | 버전·오픈소스 라이선스 영역 | 앱/빌드 버전, 라이브러리·라이선스 목록 |
| 회원 탈퇴 | 비밀번호·사유·주의 확인 UI. 비밀번호와 동의가 모두 채워져야 버튼 활성 | 본인 확인, 탈퇴 API, 보존/파기 정책, 세션 종료. **버튼 활성 조건을 유지할 것** |

## 6. JS 처리 원칙

두 파일 모두 **화면의 요소 존재 여부를 먼저 확인한 뒤 해당 화면 로직만 실행**합니다. 서로 참조하지 않습니다.

| 파일 | 담당 |
| --- | --- |
| `auth.js` | 스플래시, 로그인, 회원가입, 비밀번호 재설정 |
| `common.js` | 홈, 식단 상세, 나의 의견, 공지, My 및 설정 |

- `common.js`의 `MEALS`, `DATE_MEAL_STATUS`, 공지·의견 샘플값은 **API 데이터로 교체**합니다.
- `window.location.href` 기반 이동은 데모용입니다. 개발 라우팅 방식에 맞게 교체합니다.
- 회원가입·비밀번호 변경의 단계형 UX는 유지하되, 브라우저 뒤로가기를 지원한다면 단계 상태를 History API 또는 라우터 상태와 연동합니다.

## 7. 데모용으로 넣은 동작 — 반드시 교체

| 위치 | 데모 동작 | 교체 내용 |
| --- | --- | --- |
| 로그인 | 비밀번호에 `0000` 입력 시 실패 문구 | 인증 API 응답으로 분기 |
| 로그인 | 그 외 값이면 무조건 성공 → `home.html` | 인증 성공·세션 생성 후 이동. 뒤로가기 방지를 위해 `location.replace` 권장 |
| 로그인 | 자동로그인 체크박스가 표시만 됨 | 세션 유지 처리 연결 |
| 회원가입 | 도메인 판정이 클라이언트 정규식(`test`로 시작하거나 `gmail`·`naver`·`daum` 차단) | **허용 도메인은 반드시 서버에서 검증** |
| 회원가입 | 인증번호는 6자리 숫자면 통과 | 실제 발송·검증 API |
| 회원가입 | 완료 시 `home.html` 이동 | **정책 확인 필요** — 가입 후 다시 로그인을 받는다면 `login.html`로 변경 |
| 비밀번호 변경·회원 탈퇴 | 실제 검증 없음 | 인증된 사용자·현재 비밀번호를 서버에서 검증 |
| 공지 팝업 | 오늘 하루 미노출이 저장되지 않음 | 저장소 연동 |

## 8. 운영 데이터 확정 필요 항목

- 이용약관 전문 및 시행일
- 개인정보처리방침 전문, 실제 버전, 적용 기간, 개정 이력
- 개인정보 보호책임자·문의처
- 앱 버전 정책 및 배포 버전
- 실제 사용 오픈소스 라이브러리명, 버전, 라이선스 전문
- 회원 탈퇴 후 데이터 보존·파기·재가입 정책
- 비밀번호 정책과 로그인 실패 제한 정책
- 메뉴 이미지 최소 해상도, 한 끼당 카드 수

## 9. 해비치 협의 중인 항목

디자인 확정 전이므로, 아래는 값이 바뀔 수 있습니다.

| 항목 | 현재 | 협의 내용 |
| --- | --- | --- |
| 주요 버튼 색 | `#70747A` | PDF 색상표는 `#70747A`인데 전후 비교 시안의 로그인 버튼은 거의 검정입니다 |
| 홈 카드 영역 배경 | 흰색 | PDF 홈 11번의 `BG #F4F5F6` 적용 범위. 식단 상세에는 적용했습니다 |
| 타이포 스케일 | PDF 대비 +2px | `TYPOGRAPHY_SCALE.md` 전달 후 회신 대기 |
| 상세 대표 제목 | 20 / 600 | PDF 기준(`Main 15`)과 다르게 적용한 항목 |
| 탭 선택 굵기 | 선택 시 600 | PDF는 색으로만 구분 |

## 10. 구현 시 유의사항

- 회원가입 허용 도메인과 이메일 인증은 반드시 서버에서 검증합니다.
- 비밀번호 변경·회원 탈퇴는 프런트 입력값만으로 처리하지 않습니다.
- 개인정보처리방침의 예시 버전·본문은 정식 고지용 데이터가 아닙니다. 배포 전 확정 문안으로 교체합니다.
- 새 하위 화면을 추가할 때 탭바 노출 여부는 4-1 기준으로 판단합니다.
- 회사가 추가되어도 수정 대상은 `theme-{company-code}.css` 한 파일입니다. 컴포넌트 CSS와 타이포는 손대지 않습니다.

## 11. 정적 점검 결과

2026-09-16 기준 `service-v3/` 점검 결과입니다.

| 점검 | 결과 |
| --- | --- |
| 자산 경로(css·js·svg·png·woff2) 16건 | 참조 전부 실재. 깨진 경로 없음 |
| 페이지별 중복 `id` | 없음 |
| JS가 참조하는 마크업 `id` | 누락 없음 |
| 존재하지 않는 화면을 가리키는 링크·스크립트 분기 | 없음 |
| `auth.js` · `common.js` · `theme-oncolor.js` 문법 검사 | 통과 |
| 테마를 쓰는 15개 화면의 `theme-oncolor.js` 연결 | 누락 없음 |
| 화면당 **노출되는** `h1` | 1개 |

`signup.html`(4개) · `password-reset.html`(3개) · `my-password.html`(2개)은 마크업상 `h1`이 여러 개지만,
활성 단계를 제외한 `section`에 `hidden`이 걸려 있어 한 번에 하나만 노출됩니다. `hidden` 요소는
접근성 트리에서도 제외되므로 단계 전환형 폼의 정상 구조입니다.

`splash.html`과 `alert-popup.html`에는 `h1`이 없습니다. 각각 시작 화면과 컴포넌트 미리보기 페이지입니다.
