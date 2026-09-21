document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('.manager-table');
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

  const updateCount = () => {
    const badge = document.getElementById('managerCount');
    if (badge) badge.textContent = table.querySelectorAll('tbody > tr').length + '건';
  };

  // ---- 등록/수정 모달 --------------------------------------------------------
  const modal = document.getElementById('managerModal');
  const modalTitle = document.getElementById('managerModalTitle');
  const idInput = document.getElementById('managerIdInput');
  const nameInput = document.getElementById('managerNameInput');
  const sitesError = document.getElementById('managerSitesError');
  const resetPasswordBtn = document.getElementById('managerResetPassword');
  const deleteBtn = document.getElementById('managerDelete');
  const saveBtn = document.getElementById('managerSaveBtn');
  let editingRow = null;

  const roleInputs = () => [...modal.querySelectorAll('input[name="managerRole"]')];
  const statusInputs = () => [...modal.querySelectorAll('input[name="managerStatus"]')];
  const siteCheckboxes = () => [...modal.querySelectorAll('.managerSiteCheckbox')];

  const setRadioValue = (inputs, value) => { inputs.forEach((el) => { el.checked = el.value === value; }); };
  const getRadioValue = (inputs) => (inputs.find((el) => el.checked) || {}).value || '';

  const openCreateModal = () => {
    editingRow = null;
    modalTitle.textContent = '관리자 등록';
    idInput.value = '';
    idInput.disabled = false;
    nameInput.value = '';
    setRadioValue(roleInputs(), '마스터');
    siteCheckboxes().forEach((cb) => { cb.checked = false; });
    setRadioValue(statusInputs(), '활성');
    sitesError.hidden = true;
    resetPasswordBtn.hidden = true;
    deleteBtn.hidden = true;
    saveBtn.textContent = '등록';
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
  };

  const openEditModal = (row) => {
    editingRow = row;
    modalTitle.textContent = '운영자 수정';
    idInput.value = row.dataset.id;
    idInput.disabled = true;
    nameInput.value = row.dataset.name;
    setRadioValue(roleInputs(), row.dataset.role);
    const sites = (row.dataset.sites || '').split(',').filter(Boolean);
    siteCheckboxes().forEach((cb) => { cb.checked = sites.includes(cb.value); });
    setRadioValue(statusInputs(), row.dataset.status);
    sitesError.hidden = true;
    resetPasswordBtn.hidden = false;
    deleteBtn.hidden = false;
    saveBtn.textContent = '저장';
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    editingRow = null;
  };

  document.getElementById('managerRegisterOpen').addEventListener('click', openCreateModal);
  modal.querySelectorAll('[data-manager-modal-close]').forEach((el) => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('show')) closeModal();
  });

  const buildRowHTML = (data) => `
    <td>${data.id}</td><td>${data.name}</td><td>${data.role}</td><td>${data.sites.join(', ')}</td>
    <td><span class="badge ${data.status === '활성' ? 'done' : 'muted'}">${data.status}</span></td><td>${data.registered}</td>
  `;

  const bindRow = (row) => {
    row.addEventListener('click', () => openEditModal(row));
    row.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openEditModal(row);
      }
    });
  };
  table.querySelectorAll('tbody > tr').forEach(bindRow);

  saveBtn.addEventListener('click', () => {
    const id = idInput.value.trim();
    const name = nameInput.value.trim();
    if (!id || !name) {
      showToast('관리자 ID와 이름을 입력해주세요.');
      return;
    }
    const sites = siteCheckboxes().filter((cb) => cb.checked).map((cb) => cb.value);
    if (sites.length === 0) {
      sitesError.textContent = '사업장을 1개 이상 선택해주세요.';
      sitesError.hidden = false;
      return;
    }
    const data = {
      id,
      name,
      role: getRadioValue(roleInputs()),
      sites,
      status: getRadioValue(statusInputs()),
      registered: editingRow ? editingRow.dataset.registered : '2026-09-21',
    };

    if (editingRow) {
      editingRow.dataset.name = data.name;
      editingRow.dataset.role = data.role;
      editingRow.dataset.sites = data.sites.join(',');
      editingRow.dataset.status = data.status;
      editingRow.innerHTML = buildRowHTML(data);
      showToast(data.id + ' 운영자 정보가 저장되었습니다.');
    } else {
      const row = document.createElement('tr');
      row.className = 'manager-row';
      row.tabIndex = 0;
      row.dataset.page = '1';
      row.dataset.id = data.id;
      row.dataset.name = data.name;
      row.dataset.role = data.role;
      row.dataset.sites = data.sites.join(',');
      row.dataset.status = data.status;
      row.dataset.registered = data.registered;
      row.innerHTML = buildRowHTML(data);
      bindRow(row);
      table.querySelector('tbody').prepend(row);
      updateCount();
      showToast(data.id + ' 관리자가 등록되었습니다.');
    }

    if (window.managerPager) window.managerPager.render();
    closeModal();
  });

  // ---- 비밀번호 초기화 / 계정 삭제 확인 모달 (managerConfirmModal 재사용) --------------
  const confirmModal = document.getElementById('managerConfirmModal');
  const confirmTitle = document.getElementById('managerConfirmTitle');
  const confirmDesc = document.getElementById('managerConfirmDesc');
  const confirmOk = document.getElementById('managerConfirmOk');
  let pending = null;

  const closeConfirm = () => {
    pending = null;
    confirmModal.classList.remove('show');
    confirmModal.setAttribute('aria-hidden', 'true');
  };
  const openConfirm = (type, title, desc) => {
    pending = { type };
    confirmTitle.textContent = title;
    confirmDesc.textContent = desc;
    confirmModal.classList.add('show');
    confirmModal.setAttribute('aria-hidden', 'false');
  };
  confirmModal.querySelectorAll('[data-manager-confirm-cancel]').forEach((el) => el.addEventListener('click', closeConfirm));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && confirmModal.classList.contains('show')) closeConfirm();
  });

  resetPasswordBtn.addEventListener('click', () => {
    if (!editingRow) return;
    openConfirm('reset', '비밀번호를 초기화하시겠습니까?', editingRow.dataset.id + ' 계정의 비밀번호를 고정된 임시 비밀번호로 초기화합니다.');
  });
  deleteBtn.addEventListener('click', () => {
    if (!editingRow) return;
    openConfirm('delete', '계정을 삭제하시겠습니까?', editingRow.dataset.id + ' 운영자 계정을 삭제합니다. 이 작업은 되돌릴 수 없습니다.');
  });

  confirmOk.addEventListener('click', () => {
    if (!pending || !editingRow) { closeConfirm(); return; }
    const { type } = pending;
    const id = editingRow.dataset.id;
    const row = editingRow;
    closeConfirm();

    if (type === 'reset') {
      showToast(id + ' 계정 비밀번호가 임시 비밀번호로 초기화되었습니다.');
    } else if (type === 'delete') {
      row.remove();
      updateCount();
      if (window.managerPager) window.managerPager.render();
      closeModal();
      showToast(id + ' 운영자 계정이 삭제되었습니다.');
    }
  });

  updateCount();

  window.managerPager = (() => {
    const pagination = document.getElementById('managerPagination');
    let currentPage = 1;
    const getRows = () => [...table.querySelectorAll('tbody > tr[data-page]')];
    const getPages = () => [...new Set(getRows().map((r) => Number(r.dataset.page)))].sort((a, b) => a - b);

    function render() {
      const pages = getPages();
      if (!pages.includes(currentPage)) currentPage = pages[0] || 1;
      getRows().forEach((row) => {
        row.style.display = Number(row.dataset.page) === currentPage ? '' : 'none';
      });
      if (!pagination) return;
      pagination.innerHTML = '';
      if (pages.length <= 1) {
        pagination.hidden = true;
        return;
      }
      pagination.hidden = false;
      const mkBtn = (label, page, opts = {}) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'page-btn' + (opts.active ? ' active' : '');
        b.textContent = label;
        if (opts.disabled) b.disabled = true;
        b.addEventListener('click', () => { currentPage = page; render(); });
        return b;
      };
      const idx = pages.indexOf(currentPage);
      pagination.appendChild(mkBtn('이전', pages[Math.max(0, idx - 1)], { disabled: idx <= 0 }));
      pages.forEach((p) => pagination.appendChild(mkBtn(String(p), p, { active: p === currentPage })));
      pagination.appendChild(mkBtn('다음', pages[Math.min(pages.length - 1, idx + 1)], { disabled: idx >= pages.length - 1 }));
    }
    render();
    return { render };
  })();
});
