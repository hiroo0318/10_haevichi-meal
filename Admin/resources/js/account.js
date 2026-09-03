document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('.account-table');
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

  const modal = document.getElementById('accountConfirmModal');
  const modalTitle = document.getElementById('accountConfirmTitle');
  const modalDesc = document.getElementById('accountConfirmDesc');
  const modalOk = document.getElementById('accountConfirmOk');
  let pending = null; // { type, row }

  const emailOf = (row) => row.children[0].textContent.trim();

  const closeConfirm = () => {
    pending = null;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
  };
  const openConfirm = (type, row, title, desc) => {
    pending = { type, row };
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
  };

  modal.querySelectorAll('[data-account-confirm-cancel]').forEach((el) => el.addEventListener('click', closeConfirm));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('show')) closeConfirm();
  });

  const setSuspended = (row) => {
    row.dataset.status = '정지';
    row.children[4].innerHTML = '<span class="badge danger">정지</span>';
    row.children[5].innerHTML = '<button class="link-btn" type="button" data-account-restore>해제</button><span aria-hidden="true"> · </span><button class="link-btn danger" type="button" data-account-terminate>강제 탈퇴</button>';
    bindRowActions(row);
  };
  const setNormal = (row) => {
    row.dataset.status = '정상';
    row.children[4].innerHTML = '<span class="badge done">정상</span>';
    row.children[5].innerHTML = '<button class="link-btn" type="button" data-account-reset>초기화</button><span aria-hidden="true"> · </span><button class="link-btn danger" type="button" data-account-suspend>정지</button>';
    bindRowActions(row);
  };

  const updateCount = () => {
    const badge = document.getElementById('accountCount');
    if (badge) badge.textContent = table.querySelectorAll('tbody > tr').length + '건';
  };

  function bindRowActions(row) {
    const email = emailOf(row);
    const resetBtn = row.querySelector('[data-account-reset]');
    const suspendBtn = row.querySelector('[data-account-suspend]');
    const restoreBtn = row.querySelector('[data-account-restore]');
    const terminateBtn = row.querySelector('[data-account-terminate]');

    if (resetBtn) resetBtn.addEventListener('click', () => {
      openConfirm('reset', row, '비밀번호를 초기화하시겠습니까?', email + ' 계정의 비밀번호를 고정된 임시 비밀번호로 초기화합니다.');
    });
    if (suspendBtn) suspendBtn.addEventListener('click', () => {
      openConfirm('suspend', row, '계정을 정지하시겠습니까?', email + ' 계정을 정지하면 즉시 로그인이 차단됩니다.');
    });
    if (terminateBtn) terminateBtn.addEventListener('click', () => {
      openConfirm('terminate', row, '계정을 강제 탈퇴 처리하시겠습니까?', email + ' 계정을 강제 탈퇴 처리합니다. 이 작업은 되돌릴 수 없습니다.');
    });
    // 해제(정지 → 정상)는 접근을 다시 여는 저위험 동작이라 확인 없이 즉시 처리한다.
    if (restoreBtn) restoreBtn.addEventListener('click', () => {
      setNormal(row);
      showToast(email + ' 계정의 정지가 해제되었습니다.');
    });
  }

  modalOk.addEventListener('click', () => {
    if (!pending) return;
    const { type, row } = pending;
    const email = emailOf(row);
    closeConfirm();

    if (type === 'reset') {
      showToast(email + ' 계정 비밀번호가 임시 비밀번호로 초기화되었습니다.');
    } else if (type === 'suspend') {
      setSuspended(row);
      showToast(email + ' 계정이 정지되었습니다.');
    } else if (type === 'terminate') {
      row.remove();
      updateCount();
      showToast(email + ' 계정이 강제 탈퇴 처리되었습니다.');
    }
  });

  table.querySelectorAll('tbody > tr').forEach(bindRowActions);
  updateCount();

  const pager = (() => {
    const pagination = document.getElementById('accountPagination');
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
