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

  // ---- 사업장 구분 사용 여부 ---------------------------------------------------
  // 끄더라도 목록은 사라지지 않는다(디폴트 사업장에 데이터가 계속 쌓이고, 이미 만들어둔
  // 사업장별 데이터도 보존된다) — 전체를 흐리게 표시해 "지금은 미사용"임을 알려줄 뿐,
  // Admin에서의 조회·관리 자체는 항상 가능하다. 신규 사업장 추가만 활성 상태에서 가능하다.
  const multiToggle = document.getElementById('siteMultiToggle');
  const siteTable = document.getElementById('siteTable');
  const multiHelp = document.getElementById('siteMultiHelp');
  const listSub = document.getElementById('siteListSub');
  const newBtn = document.getElementById('site-new');

  const syncMulti = () => {
    const on = multiToggle.checked;
    siteTable.classList.toggle('is-dimmed', !on);
    newBtn.disabled = !on;
    newBtn.title = on ? '' : '사업장을 구분해서 운영해야 새 사업장을 추가할 수 있습니다.';
    multiHelp.textContent = on
      ? '사업장별로 식단·운영 데이터가 각각 쌓입니다. 다시 미사용으로 전환해도 쌓인 데이터는 삭제되지 않습니다.'
      : '미사용 상태에서는 모든 식단·운영 데이터가 디폴트 사업장 하나에 저장됩니다. 아래 목록은 참고용으로 흐리게 표시되며, 임직원 채널에는 디폴트 사업장 데이터만 노출됩니다.';
    listSub.textContent = on
      ? '기본으로 선택된 사업장은 임직원 채널 진입 시 초기값으로 쓰입니다. 사업장명은 언제든 수정할 수 있습니다.'
      : '지금은 사용하지 않는 상태입니다. 디폴트 사업장(항상 존재)만 실제로 운영되며, 나머지는 참고용으로만 표시됩니다.';
  };
  if (multiToggle) {
    multiToggle.addEventListener('change', () => {
      syncMulti();
      showToast(multiToggle.checked ? '사업장 구분 사용으로 전환되었습니다. 임직원 채널에 사업장 선택이 노출됩니다.' : '사업장 구분 미사용으로 전환되었습니다. 임직원 채널에는 디폴트 사업장 데이터만 노출됩니다.');
    });
    syncMulti();
  }

  // ---- 기본(=디폴트) 사업장 잠금 -----------------------------------------------
  // "기본" 라디오로 지정된 사업장이 곧 디폴트 사업장이다 — 항상 사용 상태로 고정되고
  // 삭제할 수 없다. 별도의 "디폴트" 표시는 두지 않고, 기본 라디오를 다른 행으로 옮기면
  // 잠금도 그 행으로 함께 옮겨간다.
  const syncDefaultLock = () => {
    table.querySelectorAll('tbody > tr').forEach((row) => {
      const radio = row.querySelector('input[name="siteDefault"]');
      const useToggle = row.querySelector('.site-use-toggle');
      const deleteBtn = row.querySelector('[data-site-delete]');
      const isDefault = !!(radio && radio.checked);
      useToggle.disabled = isDefault;
      useToggle.title = isDefault ? '기본 사업장은 항상 사용 상태입니다.' : '';
      if (isDefault) useToggle.checked = true;
      deleteBtn.disabled = isDefault;
      deleteBtn.title = isDefault ? '기본 사업장은 삭제할 수 없습니다.' : '';
    });
  };
  table.querySelectorAll('input[name="siteDefault"]').forEach((radio) => {
    radio.addEventListener('change', syncDefaultLock);
  });

  // ---- 사업장 사용/미사용 토글 ------------------------------------------------
  const bindUseToggle = (input) => {
    input.addEventListener('change', () => {
      if (input.disabled) return;
      const name = input.closest('tr').querySelector('.site-name-link').textContent.trim();
      showToast(name + ' 사업장이 ' + (input.checked ? '사용' : '미사용') + '(으)로 변경되었습니다.');
    });
  };
  table.querySelectorAll('.site-use-toggle').forEach(bindUseToggle);
  syncDefaultLock();

  // ---- 사업장명 수정 (레이어 얼럿) ------------------------------------------------
  // 사업장명 자체를 클릭하면 모달이 열리고, 그 안의 입력창+저장 버튼으로 수정한다.
  const renameModal = document.getElementById('siteRenameModal');
  const renameInput = document.getElementById('siteRenameInput');
  const renameError = document.getElementById('siteRenameError');
  const renameSaveBtn = document.getElementById('siteRenameSaveBtn');
  let renamingRow = null;

  const openRenameModal = (row) => {
    renamingRow = row;
    const link = row.querySelector('.site-name-link');
    renameInput.value = link.textContent.trim();
    setFieldError(renameInput, renameError, '');
    renameModal.classList.add('show');
    renameModal.setAttribute('aria-hidden', 'false');
    renameInput.focus();
    renameInput.select();
  };
  const closeRenameModal = () => {
    renamingRow = null;
    renameModal.classList.remove('show');
    renameModal.setAttribute('aria-hidden', 'true');
  };
  renameModal.querySelectorAll('[data-site-rename-close]').forEach((el) => el.addEventListener('click', closeRenameModal));
  window.bindModalDismiss(renameModal, closeRenameModal);
  renameInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') renameSaveBtn.click();
  });
  renameSaveBtn.addEventListener('click', () => {
    if (!renamingRow) return;
    const name = renameInput.value.trim();
    if (!name) {
      setFieldError(renameInput, renameError, '사업장명을 입력해주세요.');
      return;
    }
    const link = renamingRow.querySelector('.site-name-link');
    const previous = link.textContent.trim();
    const duplicate = [...table.querySelectorAll('.site-name-link')].some((el) => el !== link && el.textContent.trim() === name);
    if (duplicate && name !== previous) {
      setFieldError(renameInput, renameError, '이미 등록된 사업장명입니다.');
      return;
    }
    link.textContent = name;
    closeRenameModal();
    if (name !== previous) showToast(previous + ' → ' + name + '(으)로 사업장명이 변경되었습니다. 임직원 채널의 사업장 선택 표시도 함께 바뀝니다.');
  });
  const bindRename = (row) => {
    row.querySelector('[data-site-rename]').addEventListener('click', () => openRenameModal(row));
  };
  table.querySelectorAll('tbody > tr').forEach(bindRename);

  // ---- 사업장 삭제 확인 (기본 사업장 행은 버튼 자체가 disabled라 여기 도달하지 않음) ----
  const deleteModal = document.getElementById('siteDeleteModal');
  const deleteDesc = document.getElementById('siteDeleteDesc');
  const deleteOk = document.getElementById('siteDeleteOk');
  let pendingRow = null;

  const openDeleteConfirm = (row) => {
    pendingRow = row;
    const name = row.querySelector('.site-name-link').textContent.trim();
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
  window.bindModalDismiss(deleteModal, closeDeleteConfirm);
  deleteOk.addEventListener('click', () => {
    if (!pendingRow) return;
    const name = pendingRow.querySelector('.site-name-link').textContent.trim();
    pendingRow.remove();
    updateCount();
    closeDeleteConfirm();
    showToast(name + ' 사업장이 삭제되었습니다.');
  });
  const bindDeleteButton = (button) => {
    button.addEventListener('click', () => {
      if (button.disabled) return;
      openDeleteConfirm(button.closest('tr'));
    });
  };
  table.querySelectorAll('[data-site-delete]').forEach(bindDeleteButton);

  // ---- 사업장 추가 모달 (사업장 구분 사용 중일 때만) --------------------------------
  const modal = document.getElementById('siteModal');
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
  window.bindModalDismiss(modal, closeModal);
  nameInput.addEventListener('input', () => {
    if (nameInput.value.trim()) setFieldError(nameInput, nameError, '');
  });

  submitBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name) {
      setFieldError(nameInput, nameError, '사업장명을 입력해주세요.');
      return;
    }
    const existing = [...table.querySelectorAll('.site-name-link')].some((el) => el.textContent.trim() === name);
    if (existing) {
      setFieldError(nameInput, nameError, '이미 등록된 사업장명입니다.');
      return;
    }

    const row = document.createElement('tr');
    row.dataset.page = '1';
    row.innerHTML = `
      <td><input type="radio" name="siteDefault" aria-label="${name}을(를) 기본 사업장으로 지정"></td>
      <td><button class="link-btn site-name-link" type="button" data-site-rename>${name}</button></td>
      <td><label class="switch-row"><span class="switch"><input type="checkbox" class="site-use-toggle" checked><span class="switch-track" aria-hidden="true"></span></span></label></td>
      <td><button class="btn outline" type="button" data-site-delete>삭제</button></td>
    `;
    table.querySelector('tbody').appendChild(row);
    bindUseToggle(row.querySelector('.site-use-toggle'));
    bindDeleteButton(row.querySelector('[data-site-delete]'));
    bindRename(row);
    row.querySelector('input[name="siteDefault"]').addEventListener('change', syncDefaultLock);
    updateCount();
    closeModal();
    showToast(name + ' 사업장이 추가되었습니다. 허용 도메인은 인증 도메인 설정에서 등록해주세요.');
  });

  updateCount();
});
