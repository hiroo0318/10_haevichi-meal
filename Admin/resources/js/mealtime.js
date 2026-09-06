document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('.mealtime-table');
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

  const saveBtn = document.getElementById('mealtime-save');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const rows = [...table.querySelectorAll('tbody tr')];
      const invalid = rows.find((row) => {
        const [start, end] = row.querySelectorAll('input[type="time"]');
        return start.value && end.value && start.value >= end.value;
      });
      if (invalid) {
        showToast('종료 시간은 시작 시간보다 늦어야 합니다.');
        return;
      }
      showToast('식사 시간이 저장되었습니다.');
    });
  }
});
