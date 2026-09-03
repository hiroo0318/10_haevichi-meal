document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('.domain-table');
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

  const countBadge = document.getElementById('domainCount');
  const updateCount = () => {
    if (countBadge) countBadge.textContent = table.querySelectorAll('tbody > tr').length + '건';
  };

  // 도메인 추가 모달
  const modal = document.getElementById('domainModal');
  const newBtn = document.getElementById('domain-new');
  const siteSelect = document.getElementById('domainSiteSelect');
  const domainInput = document.getElementById('domainInput');
  const domainInputError = document.getElementById('domainInputError');
  const subdomainInput = document.getElementById('domainSubdomainInput');
  const submitBtn = document.getElementById('domainSubmitBtn');

  const setFieldError = (input, errorEl, message) => {
    input.classList.toggle('error', !!message);
    if (!errorEl) return;
    errorEl.textContent = message || '';
    errorEl.hidden = !message;
  };

  const openModal = () => {
    siteSelect.value = '본사';
    domainInput.value = '';
    setFieldError(domainInput, domainInputError, '');
    subdomainInput.checked = false;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
  };
  const closeModal = () => {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
  };

  if (newBtn) newBtn.addEventListener('click', openModal);
  modal.querySelectorAll('[data-domain-modal-close]').forEach((el) => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('show')) closeModal();
  });
  domainInput.addEventListener('input', () => {
    if (domainInput.value.trim()) setFieldError(domainInput, domainInputError, '');
  });

  const todayDash = () => new Date().toISOString().slice(0, 10);

  submitBtn.addEventListener('click', () => {
    const value = domainInput.value.trim();
    if (!value) {
      setFieldError(domainInput, domainInputError, '허용 도메인을 입력해주세요.');
      return;
    }
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(value)) {
      setFieldError(domainInput, domainInputError, '도메인 형식을 확인해주세요. (예: hyundaicapital.com)');
      return;
    }

    const row = document.createElement('tr');
    row.dataset.page = '1';
    row.innerHTML = `
      <td>${siteSelect.value}</td>
      <td>${value}</td>
      <td><span class="badge ${subdomainInput.checked ? 'done' : 'muted'}">${subdomainInput.checked ? '허용' : '미허용'}</span></td>
      <td>${todayDash()}</td>
      <td><button class="btn outline" type="button" data-domain-delete>삭제</button></td>
    `;
    table.querySelector('tbody').appendChild(row);
    bindDeleteButton(row.querySelector('[data-domain-delete]'));
    updateCount();
    closeModal();
    showToast(value + ' 도메인이 등록되었습니다.');
  });

  // 삭제 확인 모달 — 삭제 즉시 해당 도메인의 신규 가입이 차단되는 영향이 있어 확인을 받는다.
  const deleteModal = document.getElementById('domainDeleteModal');
  const deleteDesc = document.getElementById('domainDeleteDesc');
  const deleteOk = document.getElementById('domainDeleteOk');
  let pendingRow = null;

  const openDeleteConfirm = (row) => {
    pendingRow = row;
    const site = row.children[0].textContent.trim();
    const domain = row.children[1].textContent.trim();
    deleteDesc.textContent = site + ' · ' + domain + ' 도메인을 삭제하면 해당 도메인으로 신규 가입이 즉시 차단됩니다. 기존 가입자 계정은 유지됩니다.';
    deleteModal.classList.add('show');
    deleteModal.setAttribute('aria-hidden', 'false');
  };
  const closeDeleteConfirm = () => {
    pendingRow = null;
    deleteModal.classList.remove('show');
    deleteModal.setAttribute('aria-hidden', 'true');
  };

  deleteModal.querySelectorAll('[data-domain-delete-cancel]').forEach((el) => el.addEventListener('click', closeDeleteConfirm));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && deleteModal.classList.contains('show')) closeDeleteConfirm();
  });
  deleteOk.addEventListener('click', () => {
    if (!pendingRow) return;
    const domain = pendingRow.children[1].textContent.trim();
    pendingRow.remove();
    updateCount();
    closeDeleteConfirm();
    showToast(domain + ' 도메인이 삭제되었습니다.');
  });

  function bindDeleteButton(button) {
    if (!button) return;
    button.addEventListener('click', () => openDeleteConfirm(button.closest('tr')));
  }
  table.querySelectorAll('[data-domain-delete]').forEach(bindDeleteButton);

  updateCount();
});
