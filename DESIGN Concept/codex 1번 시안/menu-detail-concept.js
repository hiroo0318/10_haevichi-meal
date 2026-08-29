/* 상세 화면 별점 시안 동작. 실제 구현에서는 U-08의 1인 1메뉴 1회 평가 정책과 API 응답을 함께 적용한다. */
(function () {
  const buttons = Array.from(document.querySelectorAll('[data-score]'));
  const submit = document.getElementById('ratingSubmit');
  const feedback = document.getElementById('ratingFeedback');
  const labels = { 1: '아쉬워요', 2: '조금 아쉬워요', 3: '보통이에요', 4: '맛있어요', 5: '정말 맛있어요' };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const score = Number(button.dataset.score);
      buttons.forEach((star) => star.classList.toggle('selected', Number(star.dataset.score) <= score));
      feedback.textContent = `${score}점 · ${labels[score]}`;
      submit.disabled = false;
    });
  });
}());
