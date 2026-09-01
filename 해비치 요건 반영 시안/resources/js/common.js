/* =========================================================
   해비치 급식 App — 해비치 요건 반영 시안 공통 스크립트
   각 블록은 해당 페이지에 필요한 엘리먼트가 있을 때만 동작하므로
   다른 페이지에서 이 파일을 같이 불러와도 에러 없이 무시된다.
   ========================================================= */

var MEALS = {
  breakfast: {
    label: '조식', time: '07:30–09:00',
    corners: [
      {
        id: 'a', type: '한식', name: '된장국 정식', photo: 'resources/images/menu/doenjangguk-photo.png',
        desc: '잡곡밥 · 계란말이 · 시금치나물',
        avgRating: 4.0, ratingCount: 12,
        composition: [['주식','잡곡밥'], ['국','된장국'], ['반찬','계란말이 · 시금치나물']],
        items: [['잡곡밥',300], ['된장국',120], ['계란말이',150], ['시금치나물',40]],
        macro: { carb:180, protein:70, fat:40, sodium:1050, total:540 },
        allergy: '대두 함유'
      }
    ]
  },
  lunch: {
    label: '중식', time: '11:30–13:30',
    corners: [
      {
        id: 'a', type: '한식', name: '제육볶음 정식', photo: 'resources/images/menu/jeyuk-bokkeum-photo.png',
        desc: '잡곡밥 · 계란찜 · 시금치나물 · 배추김치 · 된장국',
        avgRating: 4.3, ratingCount: 187,
        composition: [['주식','잡곡밥'], ['메인','제육볶음'], ['반찬','계란찜 · 시금치나물 · 배추김치'], ['국','된장국']],
        items: [['잡곡밥',300], ['제육볶음',280], ['계란찜',120], ['시금치나물',40], ['배추김치',30], ['된장국',120]],
        macro: { carb:210, protein:120, fat:90, sodium:1480, total:890 },
        allergy: '대두, 돼지고기 함유'
      },
      {
        id: 'b', type: '한식', name: '비빔밥 코너', photo: 'resources/images/menu/bibimbap-photo.png',
        desc: '흰쌀밥 · 나물 5종 · 계란후라이 · 고추장',
        avgRating: 4.1, ratingCount: 96,
        composition: [['주식','흰쌀밥'], ['메인','나물 비빔 5종'], ['반찬','계란후라이 · 고추장']],
        items: [['흰쌀밥',300], ['나물 5종',150], ['계란후라이',110], ['고추장',30]],
        macro: { carb:195, protein:85, fat:75, sodium:1290, total:790 },
        allergy: '대두, 계란 함유'
      }
    ]
  },
  dinner: {
    label: '석식', time: '17:30–19:00',
    corners: [
      {
        id: 'a', type: '한식', name: '순두부찌개 정식', photo: 'resources/images/menu/sundubu-jjigae-photo.png',
        desc: '흰쌀밥 · 계란후라이 · 어묵볶음',
        avgRating: 3.9, ratingCount: 54,
        composition: [['주식','흰쌀밥'], ['메인','순두부찌개'], ['반찬','계란후라이 · 어묵볶음']],
        items: [['흰쌀밥',300], ['순두부찌개',210], ['계란후라이',110], ['어묵볶음',90]],
        macro: { carb:185, protein:95, fat:80, sodium:1390, total:710 },
        allergy: '대두 함유'
      }
    ]
  }
};

/* 날짜별 식단 상태 — 퍼블리싱 검토용 샘플 데이터.
   null은 해당 끼니에 식단이 없는 상태이며, 값이 생략된 날짜는 세 끼 모두 제공한다. */
var DATE_MEAL_STATUS = {
  '9-3': { breakfast:null, lunch:'lunch', dinner:'dinner' },
  '9-4': { breakfast:null, lunch:null, dinner:null }
};

/* -------------------------------------------------------
   테마 전환 (데모용) — ?theme=haevichi 쿼리로 회사별 테마를 미리볼 수 있다.
   실제 서비스에서는 어드민이 설정한 회사 값에 따라 서버가 테마 링크를
   내려주면 되고, 이 스위처는 하나의 화면 세트로 여러 테마를 검증하기
   위한 임시 장치다.
   ------------------------------------------------------- */
(function(){
  var themeLink = document.getElementById('themeLink');
  if(!themeLink) return;
  var theme = new RegExp('[?&]theme=([^&]+)').exec(location.search);
  if(theme && theme[1] === 'haevichi'){
    themeLink.href = 'resources/css/theme-haevichi.css';
  }
})();

document.addEventListener('DOMContentLoaded', function(){

  /* -------------------------------------------------------
     PAGE: home.html — 상단 공지 닫기
     ------------------------------------------------------- */
  var homeNotice = document.getElementById('homeNotice');
  if(homeNotice){
    var noticeClose = homeNotice.querySelector('.notice-close');
    noticeClose.addEventListener('click', function(){
      homeNotice.hidden = true;
    });
  }

  /* -------------------------------------------------------
     PAGE: login.html
     ------------------------------------------------------- */
  var loginForm = document.getElementById('loginForm');
  if(loginForm){
    loginForm.addEventListener('submit', function(e){
      e.preventDefault();
      var pw = document.getElementById('pw').value;
      var err = document.getElementById('loginErr');
      if(pw === '0000'){ err.hidden = false; return; }
      err.hidden = true;
      window.location.href = 'home.html';
    });
  }

  /* -------------------------------------------------------
     PAGE: home.html — 주간 날짜 스트립 + 끼니 탭 + 코너 카드
     "식단" 탭 없이 홈 하나로 메뉴 열람이 끝나도록 통합했다.
     ------------------------------------------------------- */
  // 날짜 스트립(8/30~9/12, 14일)은 home.html에 고정 마크업으로 들어있다.
  // 오늘 날짜 자동 선택·스크롤 로직은 퍼블리싱 단계에서 다루지 않고, 실제 개발 시 서버/클라이언트 날짜 기준으로 구현한다.
  var weekStrip = document.getElementById('weekStrip');
  if(weekStrip){
    var mealTabs = document.getElementById('mealTabs');
    var cornerList = document.getElementById('cornerList');

    var selectedDate = '9-2';
    var selectedMeal = 'lunch';
    var order = ['breakfast', 'lunch', 'dinner'];

    function availableMealsForDate(date){
      var status = DATE_MEAL_STATUS[date];
      return status ? order.filter(function(key){ return status[key]; }) : order.slice();
    }
    weekStrip.addEventListener('click', function(e){
      var day = e.target.closest('.week-day');
      if(!day) return;
      weekStrip.querySelectorAll('.week-day').forEach(function(d){ d.classList.remove('is-selected'); });
      day.classList.add('is-selected');
      selectedDate = day.dataset.md;
      renderHome();
    });

    function renderCorners(mealKey, isAvailable){
      cornerList.innerHTML = '';
      if(!isAvailable){
        cornerList.innerHTML =
          '<div class="meal-empty"><span class="meal-empty-icon" aria-hidden="true"><img src="resources/images/icon/ill-empty-meal.svg" alt=""></span>' +
          '<strong>' + MEALS[mealKey].label + ' 식단이 등록되지 않았어요</strong>' +
          '<p>다른 식사 탭을 선택해 주세요.</p></div>';
        return;
      }
      var meal = MEALS[mealKey];
      meal.corners.forEach(function(corner){
        var card = document.createElement('a');
        card.className = 'corner-card';
        card.href = 'menu-detail.html?meal=' + mealKey + '&corner=' + corner.id;
        card.innerHTML =
          '<div class="corner-photo"><img src="' + corner.photo + '" alt=""></div>' +
          '<div class="corner-cardbody">' +
            (meal.corners.length > 1 ? '<div class="corner-label">코너 ' + corner.id.toUpperCase() + '(' + corner.type + ')</div>' : '') +
            '<div class="corner-name">' + corner.name + '</div>' +
            '<div class="corner-desc">' + corner.desc + '</div>' +
            '<div class="corner-rating">★ ' + corner.avgRating.toFixed(1) + '<span class="count">(' + corner.ratingCount + ')</span></div>' +
          '</div>';
        cornerList.appendChild(card);
      });
    }

    function selectMealTab(mealKey){
      selectedMeal = mealKey;
      renderHome();
    }

    function renderHome(){
      var availableMeals = availableMealsForDate(selectedDate);
      var isDayEmpty = availableMeals.length === 0;
      mealTabs.hidden = isDayEmpty;
      if(isDayEmpty){
        cornerList.innerHTML =
          '<div class="meal-empty"><span class="meal-empty-icon" aria-hidden="true"><img src="resources/images/icon/ill-empty-meal.svg" alt=""></span>' +
          '<strong>등록된 식단이 없습니다</strong>' +
          '<p>다른 날짜의 식단을 확인해 주세요.</p></div>';
        return;
      }
      order.forEach(function(key){
        document.getElementById('mealTab-' + key).classList.toggle('is-active', key === selectedMeal);
      });
      renderCorners(selectedMeal, availableMeals.indexOf(selectedMeal) !== -1);
    }

    order.forEach(function(key){
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'meal-tab';
      btn.id = 'mealTab-' + key;
      btn.textContent = MEALS[key].label;
      btn.addEventListener('click', function(){ selectMealTab(key); });
      mealTabs.appendChild(btn);
    });

    renderHome();
  }

  /* -------------------------------------------------------
     PAGE: menu-detail.html — 상세 정보 렌더링
     상세 화면 안에서는 코너를 전환하지 않는다. 코너별 진입은
     home.html의 코너 카드에서 ?corner= 쿼리로 바로 들어오는 방식뿐이다.
     ------------------------------------------------------- */
  var sheet = document.getElementById('detailSheet');
  if(sheet){
    function getQueryParam(name, fallback){
      var m = new RegExp('[?&]' + name + '=([^&]+)').exec(location.search);
      return m ? decodeURIComponent(m[1]) : fallback;
    }
    var mealKey = getQueryParam('meal', 'lunch');
    if(!MEALS[mealKey]) mealKey = 'lunch';
    var meal = MEALS[mealKey];
    var requestedCorner = getQueryParam('corner', meal.corners[0].id);
    var activeCornerId = meal.corners.some(function(c){ return c.id === requestedCorner; }) ? requestedCorner : meal.corners[0].id;

    var rating = 0;

    var elHdMeal = document.getElementById('hdMeal');
    var elHero = document.getElementById('heroPhoto');
    var elName = document.getElementById('detailName');
    var elAvgRating = document.getElementById('avgRating');
    var elItems = document.getElementById('nutritionItems');
    var elMacro = document.getElementById('macroSummary');
    var elAllergy = document.getElementById('allergyText');
    var elStars = document.querySelectorAll('#stars button');
    var elRateHint = document.getElementById('rateHint');
    var elSubmit = document.getElementById('submitBtn');

    function render(){
      var corner = meal.corners.filter(function(c){ return c.id === activeCornerId; })[0];

      elHdMeal.textContent = meal.label;

      elHero.src = corner.photo;
      elHero.alt = corner.name;
      elName.textContent = corner.name;
      elAvgRating.innerHTML = '★ ' + corner.avgRating.toFixed(1) + '<span class="count">(' + corner.ratingCount + ')</span>';

      elItems.innerHTML = '';
      corner.items.forEach(function(item){
        var row = document.createElement('div');
        row.className = 'item-row';
        row.innerHTML = '<span>' + item[0] + '</span><b>' + item[1] + 'kcal</b>';
        elItems.appendChild(row);
      });

      elMacro.innerHTML =
        '<div class="macro-cell"><span class="macro-label">탄수화물</span><span class="macro-value">' + corner.macro.carb + '<small>g</small></span></div>' +
        '<div class="macro-cell"><span class="macro-label">단백질</span><span class="macro-value">' + corner.macro.protein + '<small>g</small></span></div>' +
        '<div class="macro-cell"><span class="macro-label">지방</span><span class="macro-value">' + corner.macro.fat + '<small>g</small></span></div>' +
        '<div class="macro-cell"><span class="macro-label">나트륨</span><span class="macro-value">' + corner.macro.sodium + '<small>mg</small></span></div>';

      elAllergy.textContent = corner.allergy;

      renderRatingUI();
    }

    function renderRatingUI(){
      elStars.forEach(function(btn){
        btn.classList.toggle('on', parseInt(btn.getAttribute('data-n'), 10) <= rating);
      });
      elRateHint.textContent = rating ? rating + '점을 선택하셨어요' : '별점을 선택해 주세요';
      elSubmit.disabled = rating < 1;
      elSubmit.textContent = '평가 등록';
    }

    elStars.forEach(function(btn){
      btn.addEventListener('click', function(){
        rating = parseInt(btn.getAttribute('data-n'), 10);
        renderRatingUI();
      });
    });
    elSubmit.addEventListener('click', function(){
      if(!rating) return;
      elSubmit.textContent = '평가 완료';
      elSubmit.disabled = true;
    });

    render();
  }

  /* -------------------------------------------------------
     PAGE: voc.html — 나의 의견 접수 / 내역
     ------------------------------------------------------- */
  var vocForm = document.getElementById('vocForm');
  if(vocForm){
    var vocFiles = document.getElementById('vocFiles');
    var vocFileCount = document.getElementById('vocFileCount');
    var vocPreviewList = document.getElementById('vocPreviewList');
    var vocMessage = document.getElementById('vocMessage');
    var vocCharCount = document.getElementById('vocCharCount');
    var vocCategoryList = document.getElementById('vocCategoryList');
    var vocType = document.getElementById('vocType');
    vocCategoryList.addEventListener('click', function(e){
      var chip = e.target.closest('[data-voc-category]');
      if(!chip) return;
      document.querySelectorAll('[data-voc-category]').forEach(function(item){ item.classList.remove('is-active'); });
      chip.classList.add('is-active');
      vocType.value = chip.dataset.vocCategory;
    });
    vocMessage.addEventListener('input', function(){ vocCharCount.textContent = vocMessage.value.length + ' / 500'; });
    var attachedPhotos = [];
    function escapeHtml(value){
      return value.replace(/[&<>"']/g, function(char){
        return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char];
      });
    }
    function syncPhotoInput(){
      var transfer = new DataTransfer();
      attachedPhotos.forEach(function(photo){ transfer.items.add(photo.file); });
      vocFiles.files = transfer.files;
    }
    function renderPhotoPreviews(message){
      vocPreviewList.innerHTML = '';
      attachedPhotos.forEach(function(photo, index){
        var preview = document.createElement('div');
        var fileName = escapeHtml(photo.file.name);
        preview.className = 'voc-preview';
        preview.innerHTML = '<img src="' + photo.url + '" alt="첨부 사진 ' + (index + 1) + ': ' + fileName + '"><button class="voc-preview-delete" type="button" aria-label="' + fileName + ' 삭제" data-photo-index="' + index + '">×</button>';
        vocPreviewList.appendChild(preview);
      });
      if(attachedPhotos.length < 3){
        var add = document.createElement('label');
        add.className = 'voc-upload';
        add.htmlFor = 'vocFiles';
        add.innerHTML = '<b>＋</b><span>사진 추가</span>';
        vocPreviewList.appendChild(add);
      }
      vocFileCount.textContent = message || (attachedPhotos.length ? attachedPhotos.length + '장의 사진이 첨부되었습니다.' : '사진을 첨부하면 더 정확하게 확인할 수 있어요.');
      syncPhotoInput();
    }
    vocFiles.addEventListener('change', function(){
      var files = Array.prototype.slice.call(vocFiles.files);
      var invalid = files.some(function(file){ return !file.type.match(/^image\//); });
      if(invalid){ renderPhotoPreviews('이미지 파일만 첨부할 수 있습니다.'); return; }
      var remaining = 3 - attachedPhotos.length;
      if(files.length > remaining){ files = files.slice(0, Math.max(0, remaining)); }
      files.forEach(function(file){ attachedPhotos.push({ file:file, url:URL.createObjectURL(file) }); });
      renderPhotoPreviews(files.length < Array.prototype.slice.call(vocFiles.files).length ? '사진은 최대 3장까지 첨부할 수 있습니다.' : '');
    });
    vocPreviewList.addEventListener('click', function(e){
      var remove = e.target.closest('[data-photo-index]');
      if(!remove) return;
      var index = parseInt(remove.dataset.photoIndex, 10);
      URL.revokeObjectURL(attachedPhotos[index].url);
      attachedPhotos.splice(index, 1);
      renderPhotoPreviews();
    });
    vocForm.addEventListener('submit', function(e){
      e.preventDefault();
      if(!document.getElementById('vocMessage').value.trim()){ document.getElementById('vocMessage').focus(); return; }
      window.location.href = 'voc-list.html';
    });
  }

  /* -------------------------------------------------------
     PAGE: voc-list.html — 첨부 사진 전체 미리보기
     ------------------------------------------------------- */
  var imageModal = document.getElementById('imageModal');
  if(imageModal){
    var modalPhoto = document.getElementById('imageModalPhoto');
    var closeImageModal = function(){
      imageModal.hidden = true;
      modalPhoto.src = '';
    };
    document.querySelectorAll('[data-image-preview]').forEach(function(button){
      button.addEventListener('click', function(){
        modalPhoto.src = button.dataset.imagePreview;
        modalPhoto.alt = button.dataset.imageAlt || '첨부 사진';
        imageModal.hidden = false;
      });
    });
    imageModal.querySelector('.image-modal-close').addEventListener('click', closeImageModal);
    imageModal.addEventListener('click', function(e){ if(e.target === imageModal) closeImageModal(); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && !imageModal.hidden) closeImageModal(); });
  }

  /* PAGE: notice.html — 목록 / 상세 화면 전환 */
  var noticeListView = document.getElementById('noticeListView');
  if(noticeListView){
    var noticeDetailView = document.getElementById('noticeDetailView');
    var noticeDetailTitle = document.getElementById('noticeDetailTitle');
    var noticeDetailDate = document.getElementById('noticeDetailDate');
    var noticeDetailBody = document.getElementById('noticeDetailBody');
    var noticeDetailTag = document.getElementById('noticeDetailTag');
    var noticeBrandHeader = document.getElementById('noticeBrandHeader');
    var noticeDetailHeader = document.getElementById('noticeDetailHeader');
    var noticeDetailClose = document.getElementById('noticeDetailClose');
    var showNoticeList = function(){
      noticeDetailView.hidden = true;
      noticeListView.hidden = false;
      noticeDetailHeader.hidden = true;
      noticeBrandHeader.hidden = false;
    };
    noticeListView.querySelectorAll('[data-notice-title]').forEach(function(item){
      item.addEventListener('click', function(){
        noticeDetailTitle.textContent = item.dataset.noticeTitle;
        noticeDetailDate.textContent = item.dataset.noticeDate;
        noticeDetailDate.dateTime = item.dataset.noticeDate.replace(/\./g, '-');
        noticeDetailBody.textContent = item.dataset.noticeContent;
        noticeDetailTag.hidden = item.dataset.noticePinned !== 'true';
        noticeListView.hidden = true;
        noticeDetailView.hidden = false;
        noticeBrandHeader.hidden = true;
        noticeDetailHeader.hidden = false;
        document.querySelector('.notice-content').scrollTop = 0;
      });
    });
    noticeDetailClose.addEventListener('click', showNoticeList);
  }

});
