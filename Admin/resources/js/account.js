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

  const emailOf = (row) => row.children[0].textContent.trim();

  const updateCount = () => {
    const badge = document.getElementById('accountCount');
    if (badge) badge.textContent = table.querySelectorAll('tbody > tr').length + '건';
  };

  // ---- 계정 상세 모달 --------------------------------------------------------
  const detailModal = document.getElementById('accountDetailModal');
  const detailCompany = document.getElementById('accountDetailCompany');
  const detailEmail = document.getElementById('accountDetailEmail');
  const detailSabun = document.getElementById('accountDetailSabun');
  const detailJoined = document.getElementById('accountDetailJoined');
  const detailLastLogin = document.getElementById('accountDetailLastLogin');
  const detailStatus = document.getElementById('accountDetailStatus');
  const detailResetBtn = document.getElementById('accountDetailReset');
  const detailWithdrawBtn = document.getElementById('accountDetailWithdraw');
  const detailSaveBtn = document.getElementById('accountDetailSave');
  let activeRow = null;

  const setRowStatus = (row, status) => {
    row.dataset.status = status;
    row.children[7].innerHTML = status === '정상'
      ? '<span class="badge done">정상</span>'
      : '<span class="badge danger">탈퇴</span>';
  };

  const openDetail = (row) => {
    activeRow = row;
    detailCompany.value = row.children[1].textContent.trim();
    detailEmail.value = emailOf(row);
    detailSabun.value = row.dataset.sabun === '-' ? '' : row.dataset.sabun;
    detailJoined.value = row.children[5].textContent.trim();
    detailLastLogin.value = row.children[6].textContent.trim();
    detailStatus.value = row.dataset.status;
    const isWithdrawn = row.dataset.status === '탈퇴';
    detailWithdrawBtn.disabled = isWithdrawn;
    detailWithdrawBtn.textContent = isWithdrawn ? '탈퇴 처리됨' : '탈퇴 처리';
    detailModal.classList.add('show');
    detailModal.setAttribute('aria-hidden', 'false');
  };
  const closeDetail = () => {
    activeRow = null;
    detailModal.classList.remove('show');
    detailModal.setAttribute('aria-hidden', 'true');
  };

  detailModal.querySelectorAll('[data-account-detail-close]').forEach((el) => el.addEventListener('click', closeDetail));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && detailModal.classList.contains('show')) closeDetail();
  });

  table.querySelectorAll('tbody > tr').forEach((row) => {
    row.addEventListener('click', () => openDetail(row));
    row.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openDetail(row);
      }
    });
  });

  detailSaveBtn.addEventListener('click', () => {
    if (!activeRow) return;
    activeRow.dataset.sabun = detailSabun.value.trim() || '-';
    const email = emailOf(activeRow);
    closeDetail();
    showToast(email + ' 계정 정보가 저장되었습니다.');
  });

  // ---- 초기화 · 탈퇴 처리 확인 모달 (accountConfirmModal 재사용) ----------------------
  const confirmModal = document.getElementById('accountConfirmModal');
  const confirmTitle = document.getElementById('accountConfirmTitle');
  const confirmDesc = document.getElementById('accountConfirmDesc');
  const confirmOk = document.getElementById('accountConfirmOk');
  let pending = null; // { type }

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

  confirmModal.querySelectorAll('[data-account-confirm-cancel]').forEach((el) => el.addEventListener('click', closeConfirm));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && confirmModal.classList.contains('show')) closeConfirm();
  });

  detailResetBtn.addEventListener('click', () => {
    if (!activeRow) return;
    openConfirm('reset', '비밀번호를 초기화하시겠습니까?', emailOf(activeRow) + ' 계정의 비밀번호를 고정된 임시 비밀번호로 초기화합니다.');
  });
  detailWithdrawBtn.addEventListener('click', () => {
    if (!activeRow || activeRow.dataset.status === '탈퇴') return;
    openConfirm('withdraw', '계정을 탈퇴 처리하시겠습니까?', emailOf(activeRow) + ' 계정을 탈퇴 처리하면 즉시 로그인이 차단됩니다. 이 작업은 되돌릴 수 없습니다.');
  });

  confirmOk.addEventListener('click', () => {
    if (!pending || !activeRow) { closeConfirm(); return; }
    const { type } = pending;
    const email = emailOf(activeRow);
    const row = activeRow;
    closeConfirm();

    if (type === 'reset') {
      showToast(email + ' 계정 비밀번호가 임시 비밀번호로 초기화되었습니다.');
    } else if (type === 'withdraw') {
      setRowStatus(row, '탈퇴');
      closeDetail();
      showToast(email + ' 계정이 탈퇴 처리되었습니다.');
    }
  });

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
