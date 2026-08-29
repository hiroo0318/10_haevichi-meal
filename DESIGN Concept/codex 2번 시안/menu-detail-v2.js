/* 평가 전 시안의 별점 선택 동작. 실제 구현 시 U-08의 1인 1메뉴 1회 정책과 연결한다. */
(function () {
  const stars = Array.from(document.querySelectorAll('[data-score]'));
  const submit = document.getElementById('ratingSubmit');
  const feedback = document.getElementById('ratingFeedback');
  const labels = { 1: '아쉬워요', 2: '조금 아쉬워요', 3: '보통이에요', 4: '맛있어요', 5: '정말 맛있어요' };
  stars.forEach((star) => star.addEventListener('click', () => {
    const score = Number(star.dataset.score);
    stars.forEach((item) => item.classList.toggle('selected', Number(item.dataset.score) <= score));
    feedback.textContent = `${score}점 · ${labels[score]}`;
    submit.disabled = false;
  }));
}());
