/* 상세 화면 별점 시안 동작. 실제 구현에서는 U-08의 1인 1메뉴 1회 평가 정책과 API 응답을 함께 적용한다. */
(function () {
  /*
    같은 식사 시간대의 코너 전환 시 상세 상단 정보만 목업 데이터로 교체한다.
    실제 구현에서는 선택한 cornerId로 식단 상세 API를 다시 조회한다.
  */
  const cornerMenus = {
    korean: {
      title: '제육볶음 정식', description: '매콤한 제육볶음과 곁들임 반찬으로 구성한 오늘의 중식입니다.', image: 'images/jeyuk-bokkeum-photo-sample.png', origins: ['돼지고기 국내산', '쌀 국내산'], total: '총 6가지', composition: [['주식', '잡곡밥'], ['메인', '제육볶음'], ['반찬', '계란찜 · 시금치나물 · 배추김치'], ['국', '된장국']], calories: '620', sodium: '980', allergen: '대두, 돼지고기 함유'
    },
    special: {
      title: '순두부찌개 정식', description: '따뜻한 순두부찌개와 간단한 곁들임으로 구성한 일품 중식입니다.', image: 'images/sundubu-jjigae-photo-sample.png', origins: ['쌀 국내산', '두부 국내산'], total: '총 5가지', composition: [['주식', '흰쌀밥'], ['메인', '순두부찌개'], ['반찬', '계란후라이 · 어묵볶음 · 배추김치'], ['국', '순두부찌개']], calories: '580', sodium: '1,050', allergen: '대두, 계란 함유'
    }
  };
  const cornerButtons = Array.from(document.querySelectorAll('[data-corner]'));
  const renderCorner = (cornerKey) => {
    const menu = cornerMenus[cornerKey];
    if (!menu) return;
    document.getElementById('meal-title').textContent = menu.title;
    document.getElementById('mealDescription').textContent = menu.description;
    const hero = document.getElementById('mealHeroImage');
    hero.src = menu.image;
    hero.alt = `${menu.title} 샘플 이미지`;
    document.getElementById('originTags').innerHTML = menu.origins.map((origin) => `<span>${origin}</span>`).join('');
    document.getElementById('menuTotal').textContent = menu.total;
    document.getElementById('menuComposition').innerHTML = menu.composition.map(([label, value]) => `<li><b>${label}</b><span>${value}</span></li>`).join('');
    document.getElementById('calories').innerHTML = `${menu.calories} <em>kcal</em>`;
    document.getElementById('sodium').innerHTML = `${menu.sodium} <em>mg</em>`;
    document.getElementById('allergenText').textContent = menu.allergen;
    document.title = `${menu.title} | 현대캐피탈 급식`;
    cornerButtons.forEach((button) => {
      const selected = button.dataset.corner === cornerKey;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-selected', String(selected));
    });
  };
  cornerButtons.forEach((button) => button.addEventListener('click', () => renderCorner(button.dataset.corner)));

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
