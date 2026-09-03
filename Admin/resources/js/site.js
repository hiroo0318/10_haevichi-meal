document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('.site-table');
  if (!table) return;
  const toast = document.querySelector('.toast');
  let timer;
  const showToast = (message) => {
    if (!toast) return;
    toast.querySelector('span').textContent = message;
    toast.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove('show'), 2600);
  };

  const countBadge = document.getElementById('siteCount');
  const updateCount = () => {
    if (countBadge) countBadge.textContent = table.querySelectorAll('tbody > tr').length + '건';
  };

  // 사업장 구분 사용 여부 — 끄면 사업장 목록·노출 설정을 통째로 숨기고 단일 매장 안내만 보여준다.
  const multiToggle = document.getElementById('siteMultiToggle');
  const multiSection = document.getElementById('siteMultiSection');
  const singleNote = document.getElementById('siteSingleNote');
  const syncMulti = () => {
    const on = multiToggle.checked;
    multiSection.hidden = !on;
    singleNote.hidden = on;
  };
  if (multiToggle) {
    multiToggle.addEventListener('change', () => {
      syncMulti();
      showToast(multiToggle.checked ? '사업장 구분 사용으로 전환되었습니다. 임직원 채널에 사업장 선택이 노출됩니다.' : '사업장 구분 미사용으로 전환되었습니다. 임직원 채널에 사업장 선택이 노출되지 않습니다.');
    });
    syncMulti();
  }

  // 사업장 사용/미사용 토글
  const bindUseToggle = (input) => {
    input.addEventListener('change', () => {
      const name = input.closest('tr').children[1].textContent.trim();
      showToast(name + ' 사업장이 ' + (input.checked ? '사용' : '미사용') + '(으)로 변경되었습니다.');
    });
  };
  table.querySelectorAll('.site-use-toggle').forEach(bindUseToggle);

  // 사업장 삭제 확인
  const deleteModal = document.getElementById('siteDeleteModal');
  const deleteDesc = document.getElementById('siteDeleteDesc');
  const deleteOk = document.getElementById('siteDeleteOk');
  let pendingRow = null;

  const openDeleteConfirm = (row) => {
    pendingRow = row;
    const name = row.children[1].textContent.trim();
    deleteDesc.textContent = name + ' 사업장을 삭제하면 이 사업장의 식단·코너 등 설정도 함께 제거됩니다. 이 작업은 되돌릴 수 없습니다.';
    deleteModal.classList.add('show');
    deleteModal.setAttribute('aria-hidden', 'false');
  };
  const closeDeleteConfirm = () => {
    pendingRow = null;
    deleteModal.classList.remove('show');
    deleteModal.setAttribute('aria-hidden', 'true');
  };
  deleteModal.querySelectorAll('[data-site-delete-cancel]').forEach((el) => el.addEventListener('click', closeDeleteConfirm));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && deleteModal.classList.contains('show')) closeDeleteConfirm();
  });
  deleteOk.addEventListener('click', () => {
    if (!pendingRow) return;
    const name = pendingRow.children[1].textContent.trim();
    pendingRow.remove();
    updateCount();
    closeDeleteConfirm();
    showToast(name + ' 사업장이 삭제되었습니다.');
  });
  const bindDeleteButton = (button) => {
    button.addEventListener('click', () => openDeleteConfirm(button.closest('tr')));
  };
  table.querySelectorAll('[data-site-delete]').forEach(bindDeleteButton);

  // 사업장 추가 모달
  const modal = document.getElementById('siteModal');
  const newBtn = document.getElementById('site-new');
  const nameInput = document.getElementById('siteNameInput');
  const nameError = document.getElementById('siteNameError');
  const submitBtn = document.getElementById('siteSubmitBtn');

  const setFieldError = (input, errorEl, message) => {
    input.classList.toggle('error', !!message);
    if (!errorEl) return;
    errorEl.textContent = message || '';
    errorEl.hidden = !message;
  };

  const openModal = () => {
    nameInput.value = '';
    setFieldError(nameInput, nameError, '');
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
  };
  const closeModal = () => {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
  };

  if (newBtn) newBtn.addEventListener('click', openModal);
  modal.querySelectorAll('[data-site-modal-close]').forEach((el) => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('show')) closeModal();
  });
  nameInput.addEventListener('input', () => {
    if (nameInput.value.trim()) setFieldError(nameInput, nameError, '');
  });

  submitBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name) {
      setFieldError(nameInput, nameError, '사업장명을 입력해주세요.');
      return;
    }
    const existing = [...table.querySelectorAll('tbody > tr td:nth-child(2)')].some((td) => td.textContent.trim() === name);
    if (existing) {
      setFieldError(nameInput, nameError, '이미 등록된 사업장명입니다.');
      return;
    }

    const row = document.createElement('tr');
    row.dataset.page = '1';
    row.innerHTML = `
      <td><input type="radio" name="siteDefault" aria-label="${name}을(를) 기본 사업장으로 지정"></td>
      <td>${name}</td>
      <td><label class="switch-row"><span class="switch"><input type="checkbox" class="site-use-toggle" checked><span class="switch-track" aria-hidden="true"></span></span></label></td>
      <td><button class="btn outline" type="button" data-site-delete>삭제</button></td>
    `;
    table.querySelector('tbody').appendChild(row);
    bindUseToggle(row.querySelector('.site-use-toggle'));
    bindDeleteButton(row.querySelector('[data-site-delete]'));
    updateCount();
    closeModal();
    showToast(name + ' 사업장이 추가되었습니다. 허용 도메인은 인증 도메인 설정에서 등록해주세요.');
  });

  updateCount();
});
