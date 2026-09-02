# 해비치 급식 App Front 퍼블리싱 개발 가이드

임직원용 해비치 급식 App의 Front 퍼블리싱 결과물입니다. HTML 화면 구조, 공통 스타일, 페이지 이동과 검토용 UI 인터랙션을 포함합니다.

- 기준 기획서: `SB/해비치_급식App_화면기획서_v0.5.3.html`
- 범위: 임직원 사용자 화면
- 제외: `PUBLISH/Admin` 관리자 화면
- 시작 화면 목록: `index.html`

## 화면 진입 흐름

```text
splash.html → login.html → home.html
                    └→ signup.html (3단계)

home.html
├─ menu-detail.html
├─ voc.html / voc-list.html
├─ notice.html
├─ my.html 및 하위 설정 화면
└─ notice-popup.html (홈 최초 진입 전체 공지 팝업 UI)
```

`notice-popup.html`은 팝업 UI를 검토하기 위한 독립 HTML입니다. 실제 서비스에서는 공지 데이터의 노출 조건에 따라 홈 화면 위에 같은 구조로 오버레이합니다.

## 파일 구조

```text
해비치 요건 반영 시안/
├─ splash.html                앱 시작 스플래시
├─ login.html                 로그인
├─ signup.html                회원가입 3단계
├─ home.html                  홈 / 식단 통합 조회
├─ notice-popup.html          홈 최초 진입 전체 공지 팝업 UI
├─ menu-detail.html           식단 상세
├─ voc.html / voc-list.html   나의 의견 접수 / 내역
├─ notice.html                공지 목록 / 상세
├─ my.html                    My 메인
├─ my-password.html           비밀번호 변경
├─ my-policy.html             약관·개인정보처리방침 목록
├─ terms.html / privacy.html  이용약관 / 개인정보처리방침
├─ app-version.html           앱 버전·오픈소스 라이선스
├─ withdraw.html              회원 탈퇴
└─ resources/
   ├─ css/reset.css
   ├─ css/style.css
   ├─ css/theme-hyundaicapital.css
   ├─ css/theme-haevichi.css
   ├─ js/common.js
   └─ images/
```

## 반드시 유지할 UI 구현 원칙

### 하단 탭바

하단 탭바는 `position: fixed`가 아닌 flex 레이아웃의 일반 흐름 요소입니다.

```text
.page (flex column)
├─ header / 상단 영역
├─ .content (flex: 1, 내부 스크롤)
└─ .tabbar (일반 흐름 요소)
```

- `.page`가 화면 높이를 갖고, `.content`만 세로 스크롤을 담당합니다.
- 탭바는 홈·나의 의견·공지·My 1뎁스 화면에만 노출합니다.
- 식단 상세, 공지 상세, My 하위 화면에는 탭바를 노출하지 않습니다.

### 회사 테마

- 스플래시·로그인·회원가입은 공통 화면이며 `reset.css`, `style.css`만 사용합니다.
- 로그인 후 화면은 세션의 회사 정보에 따라 `theme-*.css`를 적용합니다.
- 컴포넌트 색상은 `--brand-primary`, `--brand-primary-light`, `--brand-primary-bg` 토큰을 사용합니다.
- 퍼블리싱 비교용 `?theme=haevichi` 전환은 로그인 후 화면에서만 동작합니다.

### 정적 퍼블리싱 처리

- `resources/js/common.js`의 `MEALS`, `DATE_MEAL_STATUS`, 공지·의견 데이터는 화면 검토용 샘플입니다.
- `window.location.href` 기반 페이지 이동은 데모용이며, 실제 라우팅으로 교체합니다.
- 로그인, 회원가입, 비밀번호 변경, 회원 탈퇴의 입력 검증은 UI 검토용입니다. 실제 인증·검증은 서버 로직으로 처리합니다.
- `notice-popup.html`의 `오늘 하루 보지 않기`는 UI만 구현되어 있습니다. 홈 진입 시 팝업 노출과 당일 미노출 처리는 서비스의 공지 데이터 및 저장 정책으로 연결합니다.

## 화면별 연동 지점

| 화면 | 퍼블리싱 UI | 개발 연동 |
| --- | --- | --- |
| 스플래시 | 해비치 워드마크, 로그인 전환 | 앱 시작 시 세션 확인 후 로그인 또는 홈 분기 |
| 로그인 / 회원가입 | 이메일·비밀번호·메일 인증 단계 UI | 인증, 회원가입, 자동로그인 |
| 홈 / 식단 | 날짜·끼니·코너·빈 상태 | 사업장·날짜별 식단, 평가 데이터 |
| 식단 상세 | 메뉴·영양·별점 UI | 식단 상세, 평가 등록 |
| 나의 의견 | 접수·내역·사진 첨부 UI | 의견 접수·내역, 파일 업로드, 답변 상태 |
| 공지 | 전체 공지 팝업, 목록·상세 | 공지 목록·상세, 팝업 노출 조건, 오늘 하루 미노출 |
| My | 프로필·계정 메뉴 UI | 사용자 프로필, 로그아웃, 비밀번호 변경, 회원 탈퇴 |
| 약관 / 앱 버전 | 문서·버전·라이선스 UI | 운영 데이터 및 앱 배포 정보 |

## 점검

- HTML 링크·이미지 경로와 `resources/js/common.js` 문법을 정적 점검했습니다.
- 새 화면 또는 공통 컴포넌트를 추가할 때에는 동일한 `resources/css/style.css`, `resources/js/common.js` 구조를 사용합니다.
