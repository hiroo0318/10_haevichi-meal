document.addEventListener('DOMContentLoaded', () => {
  const toast = document.querySelector('.toast');
  let timer;
  const showToast = (message) => {
    if (!toast) return;
    toast.querySelector('span').textContent = message;
    toast.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove('show'), 2600);
  };

  // 엑셀 업로드 — 파일 선택 즉시 처리한다(별도 "업로드" 버튼 없음). 엑셀 안에 일자·사업장 등이
  // 이미 담겨 있어 선택 후 확인할 추가 값이 없으므로, 이미지 등록·로고 업로드와 같은 단일 단계로 통일했다.
  const excelInput = document.getElementById('menuExcelInput');
  if (excelInput) {
    excelInput.addEventListener('change', () => {
      const file = excelInput.files[0];
      if (!file) return;
      showToast(file.name + ' — 등록 완료 4건, 오류 1건(7행 메뉴명 필수값을 확인하세요).');
      excelInput.value = '';
    });
  }

  // 게시상태(노출/임시저장) 인라인 토글 — 비노출로 끄는 동작만 확인을 받는다.
  // 텍스트(노출/임시저장) 표시는 CSS가 checkbox 상태에 따라 자동으로 전환하므로 JS는 확인·토스트만 처리한다.
  // 네이티브 confirm()은 임베디드 미리보기 환경에서 차단될 수 있어, 앱 자체 모달(scope-modal 재사용)로 확인받는다.
  const publishConfirmModal = document.getElementById('publishConfirmModal');
  const publishConfirmDesc = document.getElementById('publishConfirmDesc');
  const publishConfirmOk = document.getElementById('publishConfirmOk');
  let pendingToggle = null;

  const openPublishConfirm = (input, name) => {
    pendingToggle = input;
    if (publishConfirmDesc) {
      publishConfirmDesc.textContent = name + ' 메뉴를 비노출로 전환하시겠습니까? 전환 즉시 사용자 화면에서 보이지 않습니다.';
    }
    publishConfirmModal.classList.add('show');
    publishConfirmModal.setAttribute('aria-hidden', 'false');
  };
  const closePublishConfirm = (revert) => {
    if (revert && pendingToggle) pendingToggle.checked = true;
    pendingToggle = null;
    publishConfirmModal.classList.remove('show');
    publishConfirmModal.setAttribute('aria-hidden', 'true');
  };

  document.querySelectorAll('[data-publish-toggle]').forEach((input) => {
    const row = input.closest('tr');
    const menuName = row ? row.querySelector('td:nth-child(4)') : null;
    const name = menuName ? menuName.textContent.trim() : '메뉴';

    input.addEventListener('change', () => {
      if (!input.checked) {
        if (publishConfirmModal) {
          openPublishConfirm(input, name);
        } else {
          showToast(name + ' 메뉴가 임시저장(으)로 변경되었습니다.');
        }
        return;
      }
      showToast(name + ' 메뉴가 노출(으)로 변경되었습니다.');
    });
  });

  if (publishConfirmModal) {
    publishConfirmModal.querySelectorAll('[data-publish-confirm-cancel]').forEach((el) => {
      el.addEventListener('click', () => closePublishConfirm(true));
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && publishConfirmModal.classList.contains('show')) closePublishConfirm(true);
    });
    if (publishConfirmOk) {
      publishConfirmOk.addEventListener('click', () => {
        const input = pendingToggle;
        const row = input ? input.closest('tr') : null;
        const menuName = row ? row.querySelector('td:nth-child(4)') : null;
        const name = menuName ? menuName.textContent.trim() : '메뉴';
        closePublishConfirm(false);
        showToast(name + ' 메뉴가 임시저장(으)로 변경되었습니다.');
      });
    }
  }
});
