document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('.corner-table');
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

  const countBadge = document.querySelector('.panel-title .accent');
  const updateCount = () => {
    const filled = table.querySelectorAll('.corner-input').length
      ? [...table.querySelectorAll('.corner-input')].filter((input) => input.value.trim() !== '').length
      : 0;
    if (countBadge) countBadge.textContent = filled;
  };

  table.addEventListener('input', (event) => {
    if (event.target.matches('.corner-input')) updateCount();
  });

  table.addEventListener('click', (event) => {
    const clearBtn = event.target.closest('[data-clear-corner]');
    if (!clearBtn) return;
    const input = clearBtn.closest('tr').querySelector('.corner-input');
    if (input) {
      input.value = '';
      updateCount();
    }
  });

  const addBtn = document.getElementById('corner-add');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const inputs = [...table.querySelectorAll('.corner-input')];
      const emptyInput = inputs.find((input) => input.value.trim() === '');
      if (!emptyInput) {
        showToast('코너는 최대 5개까지 등록할 수 있습니다.');
        return;
      }
      emptyInput.focus();
    });
  }

  const saveBtn = document.getElementById('corner-save');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const names = [...table.querySelectorAll('.corner-input')]
        .map((input) => input.value.trim())
        .filter((name) => name !== '');
      const hasDuplicate = new Set(names).size !== names.length;
      if (hasDuplicate) {
        showToast('중복된 코너명이 있습니다. 코너명을 다시 확인해주세요.');
        return;
      }
      updateCount();
      showToast('코너 설정이 저장되었습니다.');
    });
  }

  updateCount();
});
