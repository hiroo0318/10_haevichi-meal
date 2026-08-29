/*
  홈 시안의 시간대별 강조 규칙과 검토용 상태 스위처.
  실제 구현에서는 사업장별 운영시간과 식단 API 응답으로 같은 상태를 계산한다.
*/
(function () {
  const states = {
    'before-breakfast': { label: 'NEXT MEAL', focus: 'breakfast', completed: [], status: '다음 식사' },
    'breakfast-in': { label: 'NOW SERVING', focus: 'breakfast', completed: [], status: '제공 중' },
    'before-lunch': { label: 'NEXT MEAL', focus: 'lunch', completed: ['breakfast'], status: '다음 식사' },
    'lunch-in': { label: 'NOW SERVING', focus: 'lunch', completed: ['breakfast'], status: '제공 중' },
    'before-dinner': { label: 'NEXT MEAL', focus: 'dinner', completed: ['breakfast', 'lunch'], status: '다음 식사' },
    'dinner-in': { label: 'NOW SERVING', focus: 'dinner', completed: ['breakfast', 'lunch'], status: '제공 중' },
    'after-dinner': { label: 'TODAY CLOSED', focus: null, completed: ['breakfast', 'lunch', 'dinner'], status: null, closed: true }
  };
  const stateLabel = document.getElementById('meal-state');
  const closed = document.getElementById('dayClosed');
  const buttons = document.querySelectorAll('.state-buttons button');

  const renderState = (key) => {
    const state = states[key];
    if (!state) return;
    stateLabel.innerHTML = `<span></span> ${state.label}`;
    closed.hidden = !state.closed;
    document.querySelectorAll('[data-meal]').forEach((element) => {
      const meal = element.dataset.meal;
      const side = element.querySelector('.availability');
      element.classList.toggle('is-featured', meal === state.focus);
      element.classList.toggle('is-current', meal === state.focus && state.status === '제공 중');
      element.classList.toggle('is-next', meal === state.focus && state.status === '다음 식사');
      element.classList.toggle('is-past', state.completed.includes(meal));
      if (side) side.textContent = meal === state.focus ? state.status : '예정';
    });
    buttons.forEach((button) => button.classList.toggle('is-active', button.dataset.state === key));
  };

  document.getElementById('stateToggle').addEventListener('click', () => {
    document.getElementById('stateSwitcher').classList.toggle('is-collapsed');
  });
  buttons.forEach((button) => button.addEventListener('click', () => renderState(button.dataset.state)));
  renderState('lunch-in');
}());
