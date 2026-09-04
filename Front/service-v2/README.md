# 서비스 화면 2

기존 `Front` 서비스 화면과 `style.css`·`common.js`를 변경하지 않고, 신규 서비스 UI를 별도로 관리하는 퍼블리싱 영역입니다.

## 화면 분류

- `meal/`: 조식·중식·석식 홈과 메뉴 상세. 현재 서비스 화면 2가 적용된 영역입니다.
- `voc/`: 의견 접수와 나의 의견 내역. 기존 접수·첨부·처리 상태 기능을 서비스 화면 2 UI로 적용합니다.
- `notice/`: 공지 목록·상세, 전체 공지 팝업, 일반 알럿입니다.
- `my/`: My, 비밀번호 변경, 약관·개인정보처리방침, 앱 버전, 회원 탈퇴입니다.

## 리소스 기준

서비스 화면 2 전용 코드는 기존 공용 리소스 경로에 명확한 이름으로 둡니다.

- `../resources/css/service-v2.css`: 서비스 화면 2 전용 레이아웃·컴포넌트 스타일
- `../resources/js/service-v2.js`: 서비스 화면 2 전용 데모 데이터·인터랙션
- `../resources/js/auth.js`: 인증 화면 전용이므로 서비스 화면 2에서는 사용하지 않음
- `../resources/css/reset.css`, `theme-haevichi.css`: 기존 공통 리셋·사업장 테마를 그대로 사용
- `../resources/fonts`, `../resources/images`: 기존 공통 폰트·이미지 자산을 그대로 사용

## 개발 인계 원칙

서비스 화면 2를 확정하면 개발팀은 `service-v2.css`와 `service-v2.js`, 그리고 이 폴더의 HTML만 기준으로 사용합니다. 기존 `style.css`, `common.js`, 기존 HTML은 서비스 화면 1로 유지합니다.
