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

  const saveBtn = document.getElementById('corner-save');
  const useToggle = document.getElementById('corner-use-toggle');
  const cornerInputs = table.querySelectorAll('.corner-input');

  const syncCornerUse = () => {
    const inUse = !useToggle || useToggle.checked;
    cornerInputs.forEach((input) => { input.disabled = !inUse; });
    table.classList.toggle('is-disabled', !inUse);
    if (saveBtn) saveBtn.disabled = !inUse;
  };
  if (useToggle) useToggle.addEventListener('change', syncCornerUse);
  syncCornerUse();

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
      const useLabel = useToggle && useToggle.checked ? '사용' : '미사용';
      showToast('코너 사용 여부(' + useLabel + ')와 코너명이 저장되었습니다.');
    });
  }
});
