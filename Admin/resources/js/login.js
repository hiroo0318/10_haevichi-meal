document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  if (!form) return;
  const idInput = document.getElementById('loginId');
  const pwInput = document.getElementById('loginPw');
  const idError = document.getElementById('loginIdError');
  const pwError = document.getElementById('loginPwError');

  // ID·비밀번호 관련 안내는 시스템 오류(토스트)와 구분해 인풋 바로 아래 얼럿 문구로 노출한다.
  const setFieldError = (input, errorEl, message) => {
    input.classList.toggle('error', !!message);
    if (!errorEl) return;
    errorEl.textContent = message || '';
    errorEl.hidden = !message;
  };

  [[idInput, idError], [pwInput, pwError]].forEach(([input, errorEl]) => {
    input.addEventListener('input', () => {
      if (input.value.trim()) setFieldError(input, errorEl, '');
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let hasError = false;

    if (!idInput.value.trim()) {
      setFieldError(idInput, idError, '관리자 ID를 입력해주세요.');
      hasError = true;
    } else {
      setFieldError(idInput, idError, '');
    }

    if (!pwInput.value.trim()) {
      setFieldError(pwInput, pwError, '비밀번호를 입력해주세요.');
      hasError = true;
    } else {
      setFieldError(pwInput, pwError, '');
    }

    if (hasError) return;
    // 데모: 실제 인증 없이 대시보드로 이동한다. 성공 시 권한별 메뉴 노출은 개발 단계에서 처리한다.
    window.location.href = 'dashboard.html';
  });
});
