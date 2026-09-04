(function () {
  'use strict';

  var meals = {
    breakfast: { label: '조식', time: '07:30–09:00', cards: [{ id: 'a', type: '한식', name: '된장국 정식', photo: '../../resources/images/menu/doenjangguk-photo.png', items: [['잡곡밥', 300], ['된장국', 120], ['계란말이', 150], ['시금치나물', 40]], macro: { total: 540, carb: 180, protein: 70, fat: 40, sodium: 1050 } }] },
    lunch: { label: '중식', time: '11:30–13:30', cards: [{ id: 'a', type: '한식', name: '제육볶음 정식', photo: '../../resources/images/menu/jeyuk-bokkeum-photo.png', items: [['잡곡밥', 300], ['제육볶음', 280], ['계란찜', 120], ['시금치나물', 40], ['배추김치', 30], ['된장국', 120]], macro: { total: 890, carb: 210, protein: 120, fat: 90, sodium: 1480 } }, { id: 'b', type: '한식', name: '비빔밥 코너', photo: '../../resources/images/menu/bibimbap-photo.png', items: [['흰쌀밥', 300], ['나물 5종', 150], ['계란후라이', 110], ['고추장', 30]], macro: { total: 790, carb: 195, protein: 85, fat: 75, sodium: 1290 } }] },
    dinner: { label: '석식', time: '17:30–19:00', cards: [{ id: 'a', type: '한식', name: '순두부찌개 정식', photo: '../../resources/images/menu/sundubu-jjigae-photo.png', items: [['흰쌀밥', 300], ['순두부찌개', 210], ['계란후라이', 110], ['어묵볶음', 90]], macro: { total: 710, carb: 185, protein: 95, fat: 80, sodium: 1390 } }] }
  };
  var weeks = {
    previous: [['일', '23'], ['월', '24'], ['화', '25'], ['수', '26'], ['목', '27'], ['금', '28'], ['토', '29']],
    current: [['일', '30'], ['월', '31'], ['화', '1'], ['수', '2'], ['목', '3'], ['금', '4'], ['토', '5']],
    next: [['일', '6'], ['월', '7'], ['화', '8'], ['수', '9'], ['목', '10'], ['금', '11'], ['토', '12']]
  };
  var selectedWeek = 'current';
  var selectedDay = 3;
  var query = function (key) { return new URLSearchParams(location.search).get(key); };
  var escapeHtml = function (value) { return String(value).replace(/[&<>'"]/g, function (char) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]; }); };

  function renderDates() {
    var root = document.getElementById('mealV2Dates');
    if (!root) return;
    root.innerHTML = weeks[selectedWeek].map(function (day, index) {
      return '<button type="button" class="' + (index === selectedDay ? 'is-selected' : '') + '" data-day="' + index + '"><span>' + day[0] + '</span><strong>' + day[1] + '</strong></button>';
    }).join('');
  }

  function renderHome() {
    var root = document.getElementById('mealV2Sections');
    if (!root) return;
    root.innerHTML = Object.keys(meals).map(function (key) {
      var meal = meals[key];
      var cards = meal.cards.map(function (card) {
        return '<a class="meal-v2-photo-card" href="menu-detail.html?meal=' + key + '&corner=' + card.id + '"><img src="' + card.photo + '" alt="' + escapeHtml(card.name) + '"><span class="meal-v2-photo-copy"><small>코너 ' + card.id.toUpperCase() + '</small><strong>' + escapeHtml(card.name) + '</strong></span></a>';
      }).join('');
      return '<section class="meal-v2-meal-section"><div class="meal-v2-section-title"><h2>' + meal.label + '</h2><span>' + meal.time + '</span></div><div class="meal-v2-photo-grid meal-v2-photo-grid--' + meal.cards.length + '">' + cards + '</div></section>';
    }).join('');
  }

  function renderDetail() {
    var root = document.getElementById('mealV2Detail');
    if (!root) return;
    var key = query('meal') || 'lunch';
    var meal = meals[key] || meals.lunch;
    var id = query('corner') || meal.cards[0].id;
    var card = meal.cards.filter(function (item) { return item.id === id; })[0] || meal.cards[0];
    var detailItems = card.items.map(function (item) { return '<li><span>' + escapeHtml(item[0]) + '</span><b>' + item[1] + 'kcal</b></li>'; }).join('');
    root.innerHTML = '<article class="meal-v2-detail-sheet"><img class="meal-v2-detail-photo" src="' + card.photo + '" alt="' + escapeHtml(card.name) + '"><div class="meal-v2-detail-body"><div class="meal-v2-detail-intro"><div class="meal-v2-detail-title"><p>코너 ' + card.id.toUpperCase() + ' · ' + card.type + '</p><h2>' + escapeHtml(card.name) + '</h2></div><section class="meal-v2-detail-menu"><ul>' + detailItems + '</ul></section></div><section class="meal-v2-nutrients"><h3>영양소 정보</h3><div><span><small>열량</small><b>' + card.macro.total + 'kcal</b></span><span><small>탄수화물</small><b>' + card.macro.carb + 'g</b></span><span><small>단백질</small><b>' + card.macro.protein + 'g</b></span><span><small>지방</small><b>' + card.macro.fat + 'g</b></span><span><small>나트륨</small><b>' + card.macro.sodium + 'mg</b></span></div></section><a class="meal-v2-opinion" href="../voc/voc.html?meal=' + key + '&corner=' + card.id + '">의견 쓰기</a></div></article>';
  }

  var notice = document.getElementById('mealV2Notice');
  if (notice) notice.querySelector('button').addEventListener('click', function () { notice.hidden = true; });
  document.querySelectorAll('[data-week]').forEach(function (button) {
    button.addEventListener('click', function () {
      selectedWeek = button.dataset.week;
      selectedDay = 3;
      document.querySelectorAll('[data-week]').forEach(function (item) { item.classList.toggle('is-active', item === button); });
      renderDates();
    });
  });
  document.addEventListener('click', function (event) {
    var day = event.target.closest('[data-day]');
    if (!day) return;
    selectedDay = Number(day.dataset.day);
    renderDates();
  });

  renderDates();
  renderHome();
  renderDetail();
}());

/* =========================================================
   서비스 화면 2 — 나의 의견
   기존 서비스 화면 1의 접수·첨부·내역 기능과 동일한 데모 동작을
   service-v2 화면 전용 선택자로 분리한다.
   ========================================================= */
(function () {
  'use strict';

  var form = document.getElementById('vocForm');
  if (form) {
    var categoryList = document.getElementById('vocCategoryList');
    var type = document.getElementById('vocType');
    var message = document.getElementById('vocMessage');
    var charCount = document.getElementById('vocCharCount');
    var files = document.getElementById('vocFiles');
    var previewList = document.getElementById('vocPreviewList');
    var fileCount = document.getElementById('vocFileCount');
    var attachedPhotos = [];

    categoryList.addEventListener('click', function (event) {
      var button = event.target.closest('[data-voc-category]');
      if (!button) return;
      categoryList.querySelectorAll('[data-voc-category]').forEach(function (item) { item.classList.toggle('is-active', item === button); });
      type.value = button.dataset.vocCategory;
    });
    message.addEventListener('input', function () { charCount.textContent = message.value.length + ' / 500'; });

    function escapeHtml(value) { return String(value).replace(/[&<>"']/g, function (char) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]; }); }
    function syncFiles() {
      var transfer = new DataTransfer();
      attachedPhotos.forEach(function (photo) { transfer.items.add(photo.file); });
      files.files = transfer.files;
    }
    function renderPreviews(notice) {
      previewList.innerHTML = '';
      attachedPhotos.forEach(function (photo, index) {
        var preview = document.createElement('div');
        preview.className = 'service-v2-voc-preview';
        preview.innerHTML = '<img src="' + photo.url + '" alt="첨부 사진 ' + (index + 1) + '"><button type="button" aria-label="첨부 사진 삭제" data-photo-index="' + index + '">×</button>';
        previewList.appendChild(preview);
      });
      if (attachedPhotos.length < 3) {
        var add = document.createElement('label');
        add.className = 'service-v2-voc-upload';
        add.htmlFor = 'vocFiles';
        add.innerHTML = '<b>＋</b><span>사진 추가</span>';
        previewList.appendChild(add);
      }
      fileCount.textContent = notice || (attachedPhotos.length ? attachedPhotos.length + '장의 사진이 첨부되었습니다.' : '사진을 첨부하면 더 정확하게 확인할 수 있어요.');
      syncFiles();
    }
    files.addEventListener('change', function () {
      var selected = Array.prototype.slice.call(files.files);
      if (selected.some(function (file) { return !file.type.match(/^image\//); })) { renderPreviews('이미지 파일만 첨부할 수 있습니다.'); return; }
      var originalLength = selected.length;
      selected = selected.slice(0, Math.max(0, 3 - attachedPhotos.length));
      selected.forEach(function (file) { attachedPhotos.push({ file: file, url: URL.createObjectURL(file) }); });
      renderPreviews(selected.length < originalLength ? '사진은 최대 3장까지 첨부할 수 있습니다.' : '');
    });
    previewList.addEventListener('click', function (event) {
      var remove = event.target.closest('[data-photo-index]');
      if (!remove) return;
      var index = Number(remove.dataset.photoIndex);
      URL.revokeObjectURL(attachedPhotos[index].url);
      attachedPhotos.splice(index, 1);
      renderPreviews();
    });
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!message.value.trim()) { message.focus(); return; }
      document.getElementById('vocSuccessAlert').hidden = false;
    });
    document.getElementById('vocSuccessConfirm').addEventListener('click', function () { window.location.href = 'voc-list.html'; });
  }

  var modal = document.getElementById('imageModal');
  if (modal) {
    var modalPhoto = document.getElementById('imageModalPhoto');
    var close = function () { modal.hidden = true; modalPhoto.src = ''; };
    document.querySelectorAll('[data-image-preview]').forEach(function (button) {
      button.addEventListener('click', function () { modalPhoto.src = button.dataset.imagePreview; modalPhoto.alt = button.dataset.imageAlt || '첨부 사진'; modal.hidden = false; });
    });
    modal.querySelector('.service-v2-image-close').addEventListener('click', close);
    modal.addEventListener('click', function (event) { if (event.target === modal) close(); });
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && !modal.hidden) close(); });
  }
}());

/* =========================================================
   서비스 화면 2 — 공지 및 알럿
   기존 서비스 화면 1과 동일한 공지 데이터·상세 URL 구조를
   service-v2 전용 선택자로 렌더링한다.
   ========================================================= */
(function () {
  'use strict';

  var noticeDetail = document.getElementById('serviceV2NoticeDetail');
  if (noticeDetail) {
    var items = {
      'service-start': {
        title: '[안내] 10월 6일부터 새 급식정보 서비스가 시작됩니다', date: '2026.09.01', pinned: true,
        content: '10월 6일부터 기존 급식정보 제공 서비스가 종료되고, 새로운 급식정보 서비스가 시작됩니다.\n\n새 서비스에서는 날짜와 식사 구분을 선택해 오늘의 식단을 빠르게 확인할 수 있습니다.\n\n가입은 사내 메일 주소 인증만으로 가능하며, 별도의 사번 등록 절차는 없습니다. 이용에 참고 부탁드립니다.'
      },
      'login-method': {
        title: '로그인 방식 변경 안내', date: '2026.08.24',
        content: '보다 간편하고 안전한 서비스 이용을 위해 로그인 방식이 사내 메일 주소 인증 방식으로 변경됩니다.\n\n이용 중인 사내 메일 주소로 인증을 완료한 뒤 서비스를 이용해 주세요.'
      },
      'hygiene-check': {
        title: '8월 여름철 위생점검 결과 공유', date: '2026.08.05',
        content: '8월 여름철 위생점검을 완료했습니다.\n\n식당 내 위생 관리와 식재료 보관 상태를 점검했으며, 앞으로도 안전한 식사를 제공할 수 있도록 지속적으로 관리하겠습니다.'
      }
    };
    var id = new URLSearchParams(location.search).get('id') || 'service-start';
    var notice = items[id] || items['service-start'];
    noticeDetail.innerHTML = '<article class="service-v2-notice-detail-article"><header class="service-v2-notice-detail-header">' + (notice.pinned ? '<span class="service-v2-notice-tag">필독</span>' : '') + '<h2>' + notice.title + '</h2><time datetime="' + notice.date.replace(/\./g, '-') + '">' + notice.date + '</time></header><section class="service-v2-notice-detail-body"><p></p></section></article>';
    noticeDetail.querySelector('.service-v2-notice-detail-body p').textContent = notice.content;
  }

  var noticePopup = document.getElementById('serviceV2NoticePopup');
  if (noticePopup) {
    noticePopup.querySelector('[data-v2-popup-close]').addEventListener('click', function () { noticePopup.hidden = true; });
  }

  var singleAlert = document.getElementById('serviceV2SingleAlert');
  var doubleAlert = document.getElementById('serviceV2DoubleAlert');
  if (singleAlert && doubleAlert) {
    var isDouble = new URLSearchParams(location.search).get('type') === 'double';
    singleAlert.hidden = isDouble;
    doubleAlert.hidden = !isDouble;
    document.querySelectorAll('[data-v2-alert-close]').forEach(function (button) {
      button.addEventListener('click', function () { singleAlert.hidden = true; doubleAlert.hidden = true; });
    });
  }
}());
