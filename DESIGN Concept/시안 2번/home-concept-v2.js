/*
  2번 시안의 시간대별 식사 강조 규칙.
  목록 순서는 조식 → 중식 → 석식으로 고정하며, 실제 개발에서는 사업장별 운영시간을 설정값으로 대체한다.
*/
(function () {
  const schedules = [
    { key: 'breakfast', name: '조식', start: '07:30', end: '09:00' },
    { key: 'lunch', name: '중식', start: '11:30', end: '13:30' },
    { key: 'dinner', name: '석식', start: '17:30', end: '19:00' }
  ];
  const toMinutes = (value) => { const [hour, minute] = value.split(':').map(Number); return hour * 60 + minute; };
  const minutes = new Date().getHours() * 60 + new Date().getMinutes();
  const current = schedules.find((meal) => minutes >= toMinutes(meal.start) && minutes < toMinutes(meal.end));
  const next = schedules.find((meal) => minutes < toMinutes(meal.start));
  const heading = document.getElementById('meal-board-title');
  const kicker = document.getElementById('mealState');
  const time = document.getElementById('boardTime');
  const boardHeading = document.querySelector('.board-heading');
  const closedMessage = document.getElementById('closedMessage');
  const mealBadges = document.querySelectorAll('[data-meal] .meal-state-badge');
  /*
    HTML의 data-preview-state 값으로 상단 영역의 7가지 문구를 검토한다.
    값이 auto(또는 비어 있음)이면 아래 기존 시간대 계산 결과를 사용한다.
  */
  const previewHeadings = {
    'before-breakfast': { kicker: 'NEXT MEAL', title: '조식을 준비하고 있어요', time: '07:30부터', focus: 'breakfast', badge: '07:30부터' },
    'breakfast-in': { kicker: 'CURRENT MEAL', title: '지금 제공 중인 식사', time: '07:30 – 09:00', focus: 'breakfast', badge: '제공 중' },
    'before-lunch': { kicker: 'NEXT MEAL', title: '중식을 준비하고 있어요', time: '11:30부터', focus: 'lunch', badge: '11:30부터' },
    'lunch-in': { kicker: 'CURRENT MEAL', title: '지금 제공 중인 식사', time: '11:30 – 13:30', focus: 'lunch', badge: '제공 중' },
    'before-dinner': { kicker: 'NEXT MEAL', title: '석식을 준비하고 있어요', time: '17:30부터', focus: 'dinner', badge: '17:30부터' },
    'dinner-in': { kicker: 'CURRENT MEAL', title: '지금 제공 중인 식사', time: '17:30 – 19:00', focus: 'dinner', badge: '제공 중' },
    'after-dinner': { kicker: 'TODAY CLOSED', title: '오늘의 식단', time: '식사 종료', focus: null, closed: true }
  };
  // 시안에서는 8/19를 '오늘'으로 고정한다. 실제 구현에서는 서버의 기준일과 식단 조회일을 사용한다.
  const baseDate = new Date(2026, 7, 19);
  let selectedOffset = 0;
  const selectedDate = document.getElementById('selectedDate');
  const todayReturn = document.getElementById('todayReturn');
  const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

  const renderDate = () => {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + selectedOffset);
    selectedDate.innerHTML = `${date.getMonth() + 1}월 ${date.getDate()}일 <span>${weekdays[date.getDay()]}</span>`;
    todayReturn.hidden = selectedOffset === 0;
  };
  document.getElementById('previousDate').addEventListener('click', () => { selectedOffset -= 1; renderDate(); });
  document.getElementById('nextDate').addEventListener('click', () => { selectedOffset += 1; renderDate(); });
  todayReturn.addEventListener('click', () => { selectedOffset = 0; renderDate(); });

  const getAutoState = () => {
    if (current) return previewHeadings[`${current.key}-in`];
    if (next) return previewHeadings[`before-${next.key}`];
    return previewHeadings['after-dinner'];
  };

  const renderMealState = () => {
    const state = previewHeadings[boardHeading.dataset.previewState] || getAutoState();
    kicker.textContent = state.kicker;
    heading.textContent = state.title;
    time.textContent = state.time;
    closedMessage.hidden = !state.closed;
    document.querySelectorAll('[data-meal]').forEach((element) => {
      element.classList.toggle('is-focus', element.dataset.meal === state.focus);
    });
    mealBadges.forEach((badge) => { badge.hidden = true; });
    if (state.focus && state.badge) {
      const activeBadge = document.querySelector(`[data-meal="${state.focus}"] .meal-state-badge`);
      if (activeBadge) {
        activeBadge.hidden = false;
        activeBadge.textContent = state.badge;
      }
    }
  };

  // 개발자 도구에서 data-preview-state 속성값을 변경하면 새로고침 없이 즉시 시안을 갱신한다.
  new MutationObserver(renderMealState).observe(boardHeading, {
    attributes: true,
    attributeFilter: ['data-preview-state']
  });

  // 시안 검토용 접이식 상태 스위처. 버튼 선택은 개발자 도구 속성 변경과 같은 경로를 사용한다.
  const stateSwitcher = document.getElementById('stateSwitcher');
  const stateToggle = document.getElementById('stateToggle');
  const previewButtons = document.querySelectorAll('.state-buttons button');
  stateToggle.addEventListener('click', () => stateSwitcher.classList.toggle('is-collapsed'));
  previewButtons.forEach((button) => button.addEventListener('click', () => {
    boardHeading.dataset.previewState = button.dataset.state;
    previewButtons.forEach((item) => item.classList.toggle('is-active', item === button));
  }));
  renderMealState();
}());
