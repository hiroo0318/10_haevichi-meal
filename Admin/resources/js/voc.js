document.addEventListener('DOMContentLoaded', () => {
  const rows = document.querySelectorAll('.voc-row');
  if (!rows.length) return;
  const toast = document.querySelector('.toast');
  let timer;
  const showToast = (message) => {
    if (!toast) return;
    toast.querySelector('span').textContent = message;
    toast.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove('show'), 2600);
  };

  const modal = document.getElementById('vocModal');
  const vmDate = document.getElementById('vmDate');
  const vmWriter = document.getElementById('vmWriter');
  const vmType = document.getElementById('vmType');
  const vmStatus = document.getElementById('vmStatus');
  const vmContent = document.getElementById('vmContent');
  const vmAttachments = document.getElementById('vmAttachments');
  const vmAnswerTitle = document.getElementById('vmAnswerTitle');
  const vmAnswerInput = document.getElementById('vmAnswerInput');
  const vmAnswerSubmit = document.getElementById('vmAnswerSubmit');
  let activeRow = null;

  const waitingBadge = document.querySelector('#filter-waiting-voc b');
  const updateWaitingCount = () => {
    const count = document.querySelectorAll('.voc-row[data-status="답변대기"]').length;
    if (waitingBadge) waitingBadge.textContent = count + '건';
  };

  const openModal = (row) => {
    activeRow = row;
    const status = row.dataset.status;
    vmDate.textContent = row.dataset.date;
    vmWriter.textContent = row.dataset.writer;
    vmType.textContent = row.dataset.type;
    vmType.className = 'badge';
    vmStatus.textContent = status;
    vmStatus.className = 'badge ' + (status === '답변완료' ? 'done' : 'wait');
    vmContent.textContent = row.dataset.content;

    let attachments = [];
    try { attachments = JSON.parse(row.dataset.attachments || '[]'); } catch (e) { attachments = []; }
    vmAttachments.innerHTML = '';
    attachments.forEach((att) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'photo-thumb';
      btn.dataset.previewSrc = att.src;
      btn.dataset.previewName = att.name;
      const img = document.createElement('img');
      img.src = att.src;
      img.alt = att.name;
      btn.appendChild(img);
      vmAttachments.appendChild(btn);
    });
    vmAttachments.hidden = attachments.length === 0;

    if (status === '답변완료') {
      vmAnswerTitle.textContent = '등록된 답변';
      vmAnswerInput.value = row.dataset.answer || '';
      vmAnswerInput.disabled = true;
      vmAnswerSubmit.hidden = true;
    } else {
      vmAnswerTitle.textContent = '답변 작성';
      vmAnswerInput.value = '';
      vmAnswerInput.disabled = false;
      vmAnswerSubmit.hidden = false;
    }

    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    activeRow = null;
  };

  rows.forEach((row) => {
    row.addEventListener('click', () => openModal(row));
    row.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openModal(row);
      }
    });
  });

  modal.querySelectorAll('[data-voc-modal-close]').forEach((el) => {
    el.addEventListener('click', closeModal);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('show')) closeModal();
  });

  vmAnswerSubmit.addEventListener('click', () => {
    if (!activeRow || !vmAnswerInput.value.trim()) return;
    const answer = vmAnswerInput.value.trim();
    activeRow.dataset.status = '답변완료';
    activeRow.dataset.answer = answer;
    const badge = activeRow.querySelector('.badge');
    badge.className = 'badge done';
    badge.textContent = '답변완료';

    updateWaitingCount();
    if (window.vocPager) window.vocPager.render();
    showToast('답변이 등록되었습니다.');
    closeModal();
  });
});
