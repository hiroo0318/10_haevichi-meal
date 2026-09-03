document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('.notice-table');
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

  const modal = document.getElementById('noticeModal');
  const modalTitle = document.getElementById('noticeModalTitle');
  const titleInput = document.getElementById('noticeTitleInput');
  const contentInput = document.getElementById('noticeContentInput');
  const startInput = document.getElementById('noticeStartInput');
  const endInput = document.getElementById('noticeEndInput');
  const pinnedInput = document.getElementById('noticePinnedInput');
  const popupInput = document.getElementById('noticePopupInput');
  const popupStartInput = document.getElementById('noticePopupStartInput');
  const popupEndInput = document.getElementById('noticePopupEndInput');
  const deleteBtn = document.getElementById('noticeDeleteBtn');
  const submitBtn = document.getElementById('noticeSubmitBtn');
  const countBadge = document.querySelector('.panel-title .accent');
  const scopeAllInput = document.getElementById('noticeScopeAll');
  const scopeSiteInput = document.getElementById('noticeScopeSite');
  const scopeSitesBlock = document.getElementById('noticeScopeSites');
  const scopeSitesError = document.getElementById('noticeScopeSitesError');
  const siteCheckboxes = () => [...scopeSitesBlock.querySelectorAll('.noticeSiteCheckbox')];

  let editingRow = null;

  const toDot = (isoDate) => isoDate ? isoDate.slice(5).replace('-', '.') : '';

  // 노출 대상(전체/특정 사업장) — 전체 선택 시 사업장 체크박스는 비활성화만 하고 영역은 계속 보여준다.
  const syncScope = () => {
    const specific = scopeSiteInput.checked;
    siteCheckboxes().forEach((cb) => { cb.disabled = !specific; });
    scopeSitesBlock.classList.toggle('is-disabled', !specific);
    if (!specific && scopeSitesError) { scopeSitesError.hidden = true; }
  };
  scopeAllInput.addEventListener('change', syncScope);
  scopeSiteInput.addEventListener('change', syncScope);

  const updateCount = () => {
    if (countBadge) countBadge.textContent = table.querySelectorAll('tbody > tr.notice-row').length + '건';
  };

  const openCreateModal = () => {
    editingRow = null;
    modalTitle.textContent = '공지 등록';
    titleInput.value = '';
    contentInput.value = '';
    startInput.value = '';
    endInput.value = '';
    pinnedInput.checked = false;
    popupInput.checked = false;
    popupInput.dispatchEvent(new Event('change'));
    popupStartInput.value = '';
    popupEndInput.value = '';
    scopeAllInput.checked = true;
    siteCheckboxes().forEach((cb) => { cb.checked = false; });
    syncScope();
    deleteBtn.hidden = true;
    submitBtn.textContent = '등록';
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
  };

  const openEditModal = (row) => {
    editingRow = row;
    modalTitle.textContent = '공지 수정';
    titleInput.value = row.dataset.title;
    contentInput.value = row.dataset.content;
    startInput.value = row.dataset.start;
    endInput.value = row.dataset.end;
    pinnedInput.checked = row.dataset.pinned === 'true';
    popupInput.checked = row.dataset.popup === 'true';
    popupInput.dispatchEvent(new Event('change'));
    popupStartInput.value = row.dataset.popupStart || '';
    popupEndInput.value = row.dataset.popupEnd || '';
    const scopeSites = (row.dataset.scopeSites || '').split(',').filter(Boolean);
    const isSiteScope = row.dataset.scope === 'sites';
    scopeAllInput.checked = !isSiteScope;
    scopeSiteInput.checked = isSiteScope;
    siteCheckboxes().forEach((cb) => { cb.checked = scopeSites.includes(cb.value); });
    syncScope();
    deleteBtn.hidden = false;
    submitBtn.textContent = '저장';
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    editingRow = null;
  };

  const newNoticeBtn = document.getElementById('notice-new');
  if (newNoticeBtn) newNoticeBtn.addEventListener('click', openCreateModal);

  table.querySelectorAll('.notice-row').forEach((row) => {
    row.addEventListener('click', () => openEditModal(row));
    row.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openEditModal(row);
      }
    });
  });

  modal.querySelectorAll('[data-notice-modal-close]').forEach((el) => {
    el.addEventListener('click', closeModal);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('show')) closeModal();
  });

  const buildRowHTML = (data) => {
    const status = data.end && data.end < '2026-09-08' ? '종료' : '노출중';
    const badgeClass = status === '노출중' ? 'done' : 'muted';
    const scopeLabel = data.scope === 'sites' ? data.scopeSites.join(', ') : '전체';
    return `
      <td class="notice-title">${data.title}</td>
      <td>${toDot(data.start)} ~ ${toDot(data.end)}</td>
      <td>${scopeLabel}</td>
      <td>${data.pinned ? 'Y' : 'N'}</td>
      <td>${data.popup ? 'Y' : 'N'}</td>
      <td><span class="badge ${badgeClass}">${status}</span></td>
    `;
  };

  submitBtn.addEventListener('click', () => {
    if (!titleInput.value.trim() || !contentInput.value.trim()) {
      showToast('제목과 내용을 입력해주세요.');
      return;
    }
    const scopeSites = siteCheckboxes().filter((cb) => cb.checked).map((cb) => cb.value);
    if (scopeSiteInput.checked && scopeSites.length === 0) {
      scopeSitesError.textContent = '노출할 사업장을 1개 이상 선택해주세요.';
      scopeSitesError.hidden = false;
      return;
    }
    const data = {
      title: titleInput.value.trim(),
      content: contentInput.value.trim(),
      start: startInput.value,
      end: endInput.value,
      pinned: pinnedInput.checked,
      popup: popupInput.checked,
      popupStart: popupInput.checked ? popupStartInput.value : '',
      popupEnd: popupInput.checked ? popupEndInput.value : '',
      scope: scopeSiteInput.checked ? 'sites' : 'all',
      scopeSites: scopeSiteInput.checked ? scopeSites : [],
    };

    if (editingRow) {
      editingRow.dataset.title = data.title;
      editingRow.dataset.content = data.content;
      editingRow.dataset.start = data.start;
      editingRow.dataset.end = data.end;
      editingRow.dataset.pinned = String(data.pinned);
      editingRow.dataset.popup = String(data.popup);
      editingRow.dataset.popupStart = data.popupStart;
      editingRow.dataset.popupEnd = data.popupEnd;
      editingRow.dataset.scope = data.scope;
      editingRow.dataset.scopeSites = data.scopeSites.join(',');
      editingRow.innerHTML = buildRowHTML(data);
      showToast('공지가 저장되었습니다.');
    } else {
      const row = document.createElement('tr');
      row.className = 'notice-row';
      row.tabIndex = 0;
      row.dataset.page = '1';
      row.dataset.title = data.title;
      row.dataset.content = data.content;
      row.dataset.start = data.start;
      row.dataset.end = data.end;
      row.dataset.pinned = String(data.pinned);
      row.dataset.popup = String(data.popup);
      row.dataset.popupStart = data.popupStart;
      row.dataset.popupEnd = data.popupEnd;
      row.dataset.scope = data.scope;
      row.dataset.scopeSites = data.scopeSites.join(',');
      row.innerHTML = buildRowHTML(data);
      row.addEventListener('click', () => openEditModal(row));
      row.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openEditModal(row);
        }
      });
      table.querySelector('tbody').prepend(row);
      updateCount();
      showToast('공지가 등록되었습니다.');
    }

    if (window.noticePager) window.noticePager.render();
    closeModal();
  });

  deleteBtn.addEventListener('click', () => {
    if (!editingRow) return;
    editingRow.remove();
    updateCount();
    if (window.noticePager) window.noticePager.render();
    showToast('공지가 삭제되었습니다.');
    closeModal();
  });
});
