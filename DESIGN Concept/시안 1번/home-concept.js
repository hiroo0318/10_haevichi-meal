/*
  홈 시안의 시간대별 강조 규칙과 검토용 상태 스위처.
  실제 구현에서는 사업장별 운영시간과 식단 API 응답으로 같은 상태를 계산한다.
*/
(function () {
  const states = {
    'before-breakfast': { focus: 'breakfast', completed: [], status: '다음 식사' },
    'breakfast-in': { focus: 'breakfast', completed: [], status: '제공 중' },
    'before-lunch': { focus: 'lunch', completed: ['breakfast'], status: '다음 식사' },
    'lunch-in': { focus: 'lunch', completed: ['breakfast'], status: '제공 중' },
    'before-dinner': { focus: 'dinner', completed: ['breakfast', 'lunch'], status: '다음 식사' },
    'dinner-in': { focus: 'dinner', completed: ['breakfast', 'lunch'], status: '제공 중' },
    'after-dinner': { focus: null, completed: ['breakfast', 'lunch', 'dinner'], status: null, closed: true }
  };
  const closed = document.getElementById('dayClosed');
  const buttons = document.querySelectorAll('.state-buttons button');
  const cornerCarousels = [];
  const contentScroller = document.querySelector('.concept-page main');

  /*
    Safari는 내부 가로 스크롤의 관성을 상위 스크롤 영역에 전달하는 경우가 있다.
    본문은 세로 전용 영역이므로, 가로 위치가 생기면 즉시 0으로 복구한다.
  */
  const lockContentHorizontalScroll = () => {
    if (contentScroller && contentScroller.scrollLeft !== 0) contentScroller.scrollLeft = 0;
  };
  if (contentScroller) {
    contentScroller.addEventListener('scroll', lockContentHorizontalScroll, { passive: true });
    contentScroller.addEventListener('touchend', lockContentHorizontalScroll, { passive: true });
  }

  /*
    코너 영역은 브라우저의 기본 가로 스크롤과 CSS scroll-snap을 사용한다.
    별도 터치 제스처를 가로채지 않아, 카드 위에서 위·아래로 움직이면 본문 스크롤이 유지된다.
  */
  const setupCornerCarousels = () => {
    document.querySelectorAll('[data-corner-carousel]').forEach((carousel) => {
      const track = carousel.querySelector('.corner-track');
      const cards = Array.from(track.querySelectorAll('.corner-card'));
      const count = carousel.querySelector('.corner-count');
      const dots = Array.from(carousel.querySelectorAll('.corner-dots i'));
      let snapTimer;
      carousel.dataset.corners = cards.length;

      const updateIndicator = () => {
        const index = cards.reduce((nearestIndex, card, cardIndex) => (
          Math.abs(card.offsetLeft - track.scrollLeft) < Math.abs(cards[nearestIndex].offsetLeft - track.scrollLeft)
            ? cardIndex : nearestIndex
        ), 0);
        if (count) count.textContent = `${index + 1} / ${cards.length}`;
        dots.forEach((dot, dotIndex) => dot.classList.toggle('is-active', dotIndex === index));
      };

      /* 사파리에서 관성 스크롤이 중간에 멈춰도 가장 가까운 카드 시작점으로 정렬한다. */
      const settleToNearestCard = () => {
        const nearest = cards.reduce((nearestCard, card) => (
          Math.abs(card.offsetLeft - track.scrollLeft) < Math.abs(nearestCard.offsetLeft - track.scrollLeft)
            ? card : nearestCard
        ), cards[0]);
        if (Math.abs(nearest.offsetLeft - track.scrollLeft) > 1) track.scrollTo({ left: nearest.offsetLeft, behavior: 'smooth' });
      };

      track.addEventListener('scroll', () => {
        updateIndicator();
        window.clearTimeout(snapTimer);
        snapTimer = window.setTimeout(settleToNearestCard, 100);
      }, { passive: true });
      window.addEventListener('resize', updateIndicator);
      updateIndicator();
      cornerCarousels.push({ carousel, track, updateIndicator });
    });
  };

  const resetMealCarousel = (meal) => {
    const item = document.querySelector(`[data-meal="${meal}"]`);
    const carousel = item && item.querySelector('[data-corner-carousel]');
    const saved = cornerCarousels.find((entry) => entry.carousel === carousel);
    if (!saved) return;
    saved.track.scrollLeft = 0;
    saved.updateIndicator();
  };

  const renderState = (key) => {
    const state = states[key];
    if (!state) return;
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
    if (state.focus) resetMealCarousel(state.focus);
    buttons.forEach((button) => button.classList.toggle('is-active', button.dataset.state === key));
  };

  document.getElementById('stateToggle').addEventListener('click', () => {
    document.getElementById('stateSwitcher').classList.toggle('is-collapsed');
  });
  buttons.forEach((button) => button.addEventListener('click', () => renderState(button.dataset.state)));
  setupCornerCarousels();
  renderState('lunch-in');
}());
