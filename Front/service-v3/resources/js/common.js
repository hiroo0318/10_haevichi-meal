/* =========================================================
   해비치 급식 App — Front 공통 스크립트
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
        composition: [['주식','잡곡밥'], ['국','된장국'], ['반찬','계란말이 · 시금치나물']],
        items: [['잡곡밥',300], ['된장국',120], ['계란말이',150], ['시금치나물',40]],
        macro: { carb:180, protein:70, fat:40, sodium:1050, total:540 },
        origin: '쌀(국내산), 두부(외국산)',
        allergy: '대두 함유'
      },
      {
        id: 'b', type: '한식', name: '비빔밥 코너', photo: 'resources/images/menu/bibimbap-photo.png',
        desc: '흰쌀밥 · 나물 5종 · 계란후라이 · 고추장',
        composition: [['주식','흰쌀밥'], ['메인','나물 비빔 5종'], ['반찬','계란후라이 · 고추장']],
        items: [['흰쌀밥',300], ['나물 5종',150], ['계란후라이',110], ['고추장',30]],
        macro: { carb:195, protein:85, fat:75, sodium:1290, total:790 },
        origin: '쌀(국내산), 소고기(호주산)',
        allergy: '대두, 계란 함유'
      }
    ]
  },
  lunch: {
    label: '중식', time: '11:30–13:30',
    corners: [
      {
        id: 'a', type: '한식', name: '제육볶음 정식', photo: 'resources/images/menu/jeyuk-bokkeum-photo.png',
        desc: '잡곡밥 · 계란찜 · 시금치나물 · 배추김치 · 된장국',
        composition: [['주식','잡곡밥'], ['메인','제육볶음'], ['반찬','계란찜 · 시금치나물 · 배추김치'], ['국','된장국']],
        items: [['잡곡밥',300], ['제육볶음',280], ['계란찜',120], ['시금치나물',40], ['배추김치',30], ['된장국',120]],
        macro: { carb:210, protein:120, fat:90, sodium:1480, total:890 },
        origin: '돼지고기(국내산), 쌀(국내산)',
        allergy: '대두, 돼지고기 함유'
      },
      {
        id: 'b', type: '한식', name: '비빔밥 코너', photo: 'resources/images/menu/bibimbap-photo.png',
        desc: '흰쌀밥 · 나물 5종 · 계란후라이 · 고추장',
        composition: [['주식','흰쌀밥'], ['메인','나물 비빔 5종'], ['반찬','계란후라이 · 고추장']],
        items: [['흰쌀밥',300], ['나물 5종',150], ['계란후라이',110], ['고추장',30]],
        macro: { carb:195, protein:85, fat:75, sodium:1290, total:790 },
        origin: '쌀(국내산), 소고기(호주산)',
        allergy: '대두, 계란 함유'
      }
    ]
  },
  dinner: {
    label: '석식', time: '17:30–19:00',
    corners: [
      {
        id: 'a', type: '한식', name: '순두부찌개 정식', photo: 'resources/images/menu/sundubu-jjigae-photo-v2.png',
        desc: '흰쌀밥 · 계란후라이 · 어묵볶음',
        composition: [['주식','흰쌀밥'], ['메인','순두부찌개'], ['반찬','계란후라이 · 어묵볶음']],
        items: [['흰쌀밥',300], ['순두부찌개',210], ['계란후라이',110], ['어묵볶음',90]],
        macro: { carb:185, protein:95, fat:80, sodium:1390, total:710 },
        origin: '쌀(국내산), 돈육(국내산)',
        allergy: '대두 함유'
      }
    ]
  }
};

/* 사업장별 식사 시간 관리의 "사용 여부"를 프런트에 전달받은 값.
   실제 연동에서는 관리자가 저장한 조식·중식·석식 사용 여부로 대체한다.
   시간 표시는 이번 화면 범위에 포함하지 않는다. */
var MEAL_OPERATION_ENABLED = {
  breakfast: true,
  lunch: true,
  dinner: true
};

/* 날짜별 식단 상태 — 퍼블리싱 검토용 샘플 데이터.
   null은 해당 끼니에 식단이 없는 상태이며, 값이 생략된 날짜는 세 끼 모두 제공한다. */
var DATE_MEAL_STATUS = {
  '9-3': { breakfast:null, lunch:'lunch', dinner:'dinner' },
  '9-4': { breakfast:null, lunch:null, dinner:null },
  /* 5일은 홈·상세의 이미지 로딩 기본 문구 확인용 샘플이다.
     실제 이미지 미등록 상태 UI가 아니라, 이미지 응답 전 상태를 고정해 둔다. */
  '9-5': { breakfast:'breakfast', lunch:'lunch', dinner:'dinner', thumbnailLoading:true }
};

/* -------------------------------------------------------
   테마 전환 (데모용) — ?theme=haevichi 쿼리로 회사별 테마를 미리볼 수 있다.
   로그인·회원가입에는 themeLink가 없으므로 적용되지 않는다. 실제 서비스에서는
   로그인 후 세션의 회사 값에 따라 서버 또는 앱 셸이 테마 링크를 적용한다.
   이 스위처는 로그인 후 화면 세트로 여러 테마를 검증하기 위한 임시 장치다.
   ------------------------------------------------------- */
(function(){
  var themeLink = document.getElementById('themeLink');
  if(!themeLink) return;
  var theme = new RegExp('[?&]theme=([^&]+)').exec(location.search);
  if(theme && theme[1] === 'haevichi'){
    themeLink.href = 'resources/css/theme-haevichi.css?v=20260917-3';
  }
})();

document.addEventListener('DOMContentLoaded', function(){

  function revealMealImage(image){
    var container = image.parentNode;
    var loadingMessage = container.querySelector('.meal-image-loading');
    image.hidden = false;
    container.classList.remove('is-loading');
    if(loadingMessage) loadingMessage.hidden = true;
  }

  function loadMealImage(image){
    var container = image.parentNode;
    var loadingMessage = container.querySelector('.meal-image-loading');
    image.hidden = true;
    container.classList.add('is-loading');
    if(loadingMessage) loadingMessage.hidden = false;
    image.addEventListener('load', function(){ revealMealImage(image); }, { once:true });
    if(image.complete && image.naturalWidth) revealMealImage(image);
  }

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

  /* PAGE: notice-popup.html — 전체 공지 팝업 (퍼블리싱 UI 전용, 저장 처리 없음) */
  var homeNoticePopup = document.getElementById('homeNoticePopup');
  if(homeNoticePopup){
    var closeHomeNoticePopup = function(){ homeNoticePopup.hidden = true; };
    homeNoticePopup.querySelector('.home-notice-popup-confirm').addEventListener('click', closeHomeNoticePopup);
  }

  /* -------------------------------------------------------
     PAGE: my-password.html — 현재 비밀번호 확인 후 변경
     실제 현재 비밀번호 대조와 저장은 서버 연동 대상이다.
     ------------------------------------------------------- */
  var passwordChangeForm = document.getElementById('passwordChangeForm');
  if(passwordChangeForm){
    var currentPassword = document.getElementById('currentPassword');
    var currentPasswordError = document.getElementById('currentPasswordError');
    var newPassword = document.getElementById('newPassword');
    var newPasswordConfirm = document.getElementById('newPasswordConfirm');
    var newPasswordLengthError = document.getElementById('newPasswordLengthError');
    var newPasswordError = document.getElementById('newPasswordError');
    var changePasswordStep = function(step){
      passwordChangeForm.querySelectorAll('[data-password-step]').forEach(function(panel){
        panel.hidden = Number(panel.dataset.passwordStep) !== step;
      });
    };
    document.getElementById('passwordVerify').addEventListener('click', function(){
      var isEntered = currentPassword.value.length > 0;
      currentPasswordError.hidden = isEntered;
      if(!isEntered){ currentPassword.focus(); return; }
      changePasswordStep(2);
      newPassword.focus();
    });
    passwordChangeForm.addEventListener('submit', function(e){
      e.preventDefault();
      var hasValidLength = newPassword.value.length >= 8;
      var isMatching = hasValidLength && newPassword.value === newPasswordConfirm.value;
      newPasswordLengthError.hidden = hasValidLength;
      newPasswordError.hidden = isMatching;
      if(!hasValidLength){ newPassword.focus(); return; }
      if(!isMatching){ newPasswordConfirm.focus(); return; }
      window.location.href = 'my.html';
    });
  }

  /* PAGE: privacy.html — 현재/이전 개인정보처리방침 버전 열람 */
  var privacyVersion = document.getElementById('privacyVersion');
  if(privacyVersion){
    privacyVersion.addEventListener('change', function(){
      document.querySelectorAll('[data-privacy-version]').forEach(function(version){
        version.hidden = version.dataset.privacyVersion !== privacyVersion.value;
      });
    });
  }

  /* PAGE: withdraw.html — 탈퇴 사유 및 최종 확인 (삭제 API는 개발 연동 대상) */
  var withdrawForm = document.getElementById('withdrawForm');
  if(withdrawForm){
    var withdrawPassword = document.getElementById('withdrawPassword');
    var withdrawPasswordError = document.getElementById('withdrawPasswordError');
    var withdrawReason = document.getElementById('withdrawReason');
    var withdrawOther = document.getElementById('withdrawOther');
    var withdrawAgree = document.getElementById('withdrawAgree');
    var withdrawAgreeError = document.getElementById('withdrawAgreeError');
    withdrawReason.addEventListener('change', function(){
      withdrawOther.hidden = withdrawReason.value !== 'other';
      if(withdrawOther.hidden) withdrawOther.value = '';
    });
    /* 탈퇴는 되돌릴 수 없는 동작이므로, 로그인·회원가입과 같이 필수값이 모두 채워졌을 때만
       버튼을 활성화한다. 사유 선택은 선택 항목이라 활성 조건에 넣지 않는다. */
    var withdrawSubmit = withdrawForm.querySelector('[type="submit"]');
    var syncWithdrawState = function(){
      withdrawSubmit.disabled = !(withdrawPassword.value.length > 0 && withdrawAgree.checked);
    };
    syncWithdrawState();
    withdrawPassword.addEventListener('input', syncWithdrawState);
    withdrawAgree.addEventListener('change', syncWithdrawState);
    withdrawForm.addEventListener('submit', function(e){
      e.preventDefault();
      var hasPassword = withdrawPassword.value.length > 0;
      withdrawPasswordError.hidden = hasPassword;
      withdrawAgreeError.hidden = withdrawAgree.checked;
      if(!hasPassword){ withdrawPassword.focus(); return; }
      if(!withdrawAgree.checked){ withdrawAgree.focus(); return; }
      window.location.href = 'login.html';
    });
  }

  /* -------------------------------------------------------
     PAGE: home.html — 주간 날짜 스트립 + 끼니 탭 + 코너 카드
     "식단" 탭 없이 홈 하나로 메뉴 열람이 끝나도록 통합했다.
     ------------------------------------------------------- */
  // 전주/이번 주/차주 데이터는 퍼블리싱 검토용 고정 마크업이다.
  // 기본 선택은 수요일이며, 선택한 요일은 주를 이동해도 계속 유지한다.
  var weekStrip = document.getElementById('weekStrip');
  if(weekStrip){
    var mealTabs = document.getElementById('mealTabs');
    var cornerList = document.getElementById('cornerList');
    var homeMealSection = mealTabs.closest('.home-meal-section');
    var selectedDate = '9-2';
    var selectedMeal = 'lunch';
    var order = ['breakfast', 'lunch', 'dinner'];
    var selectedWeekdayIndex = 3;

    function selectWeek(week){
      var group = weekStrip.querySelector('[data-week="' + week + '"]');
      if(!group) return;
      weekStrip.querySelectorAll('.week-group').forEach(function(item){ item.classList.toggle('is-active', item === group); });
      document.querySelectorAll('[data-week-nav]').forEach(function(button){ button.classList.toggle('is-active', button.getAttribute('data-week-nav') === week); });
      var days = group.querySelectorAll('.week-day');
      var activeDay = days[selectedWeekdayIndex] || days[0];
      weekStrip.querySelectorAll('.week-day').forEach(function(day){ day.classList.toggle('is-selected', day === activeDay); });
      selectedDate = activeDay.dataset.md;
      renderHome();
    }

    function operatingMeals(){
      return order.filter(function(key){ return MEAL_OPERATION_ENABLED[key]; });
    }

    function availableMealsForDate(date, enabledMeals){
      var status = DATE_MEAL_STATUS[date];
      return status ? enabledMeals.filter(function(key){ return status[key]; }) : enabledMeals.slice();
    }
    weekStrip.addEventListener('click', function(e){
      var day = e.target.closest('.week-day');
      if(!day) return;
      weekStrip.querySelectorAll('.week-day').forEach(function(d){ d.classList.remove('is-selected'); });
      day.classList.add('is-selected');
      selectedDate = day.dataset.md;
      selectedWeekdayIndex = Array.prototype.indexOf.call(day.closest('.week-group').querySelectorAll('.week-day'), day);
      renderHome();
    });
    document.querySelectorAll('[data-week-nav]').forEach(function(button){
      button.addEventListener('click', function(){ selectWeek(button.getAttribute('data-week-nav')); });
    });

    function renderCorners(mealKey, isAvailable, enabledMeals, isThumbnailLoading){
      cornerList.innerHTML = '';
      if(!isAvailable){
        cornerList.innerHTML =
          '<div class="meal-empty"><span class="meal-empty-icon" aria-hidden="true"><img src="resources/images/icon/ill-empty-meal.svg" alt=""></span>' +
          '<strong>' + MEALS[mealKey].label + ' 식단이 등록되지 않았어요</strong>' +
          '<p>' + (enabledMeals.length > 1 ? '다른 식사 탭을 선택해 주세요.' : '다른 날짜의 식단을 확인해 주세요.') + '</p></div>';
        return;
      }
      var meal = MEALS[mealKey];
      meal.corners.forEach(function(corner){
        var card = document.createElement('article');
        var thumbnail = isThumbnailLoading
          ? '<div class="corner-photo is-loading"><span class="meal-image-loading">식단 이미지를 불러오고 있어요.</span></div>'
          : '<div class="corner-photo is-loading"><span class="meal-image-loading">식단 이미지를 불러오고 있어요.</span><img src="' + corner.photo + '" alt="' + corner.name + '" hidden></div>';
        card.className = 'corner-card';
        card.innerHTML =
          '<a class="corner-detail-link" href="menu-detail.html?meal=' + mealKey + '&corner=' + corner.id + '&date=' + selectedDate + '">' +
            thumbnail +
            '<div class="corner-cardbody">' +
              '<div class="corner-label">코너 ' + corner.id.toUpperCase() + '(' + corner.type + ')</div>' +
              '<div class="corner-name">' + corner.name + '</div>' +
              '<div class="corner-desc">' + corner.desc + '</div>' +
            '</div>' +
          '</a>' +
          '<a class="corner-voc-link" href="voc.html?meal=' + mealKey + '&corner=' + corner.id + '">의견 쓰기</a>';
        if(!isThumbnailLoading) loadMealImage(card.querySelector('.corner-photo img'));
        cornerList.appendChild(card);
      });
    }

    function selectMealTab(mealKey){
      selectedMeal = mealKey;
      renderHome();
    }

    function renderMealTabs(enabledMeals, isDayEmpty){
      mealTabs.innerHTML = '';
      homeMealSection.hidden = enabledMeals.length <= 1;
      if(enabledMeals.length <= 1) return;

      enabledMeals.forEach(function(key){
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'meal-tab';
        btn.id = 'mealTab-' + key;
        btn.textContent = MEALS[key].label;
        btn.disabled = isDayEmpty;
        btn.classList.toggle('is-active', !isDayEmpty && key === selectedMeal);
        btn.addEventListener('click', function(){ selectMealTab(key); });
        mealTabs.appendChild(btn);
      });
    }

    function renderHome(){
      var enabledMeals = operatingMeals();
      if(enabledMeals.length === 0){
        homeMealSection.hidden = true;
        cornerList.innerHTML =
          '<div class="meal-empty"><span class="meal-empty-icon" aria-hidden="true"><img src="resources/images/icon/ill-empty-meal.svg" alt=""></span>' +
          '<strong>운영 중인 식사가 없습니다</strong>' +
          '<p>식사 운영 여부를 확인해 주세요.</p></div>';
        return;
      }
      if(enabledMeals.indexOf(selectedMeal) === -1) selectedMeal = enabledMeals[0];

      var availableMeals = availableMealsForDate(selectedDate, enabledMeals);
      var isDayEmpty = availableMeals.length === 0;
      var isThumbnailLoading = !!(DATE_MEAL_STATUS[selectedDate] && DATE_MEAL_STATUS[selectedDate].thumbnailLoading);
      renderMealTabs(enabledMeals, isDayEmpty);
      if(isDayEmpty){
        cornerList.innerHTML =
          '<div class="meal-empty"><span class="meal-empty-icon" aria-hidden="true"><img src="resources/images/icon/ill-empty-meal.svg" alt=""></span>' +
          '<strong>등록된 식단이 없습니다</strong>' +
          '<p>다른 날짜의 식단을 확인해 주세요.</p></div>';
        return;
      }
      renderCorners(selectedMeal, availableMeals.indexOf(selectedMeal) !== -1, enabledMeals, isThumbnailLoading);
    }

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
    var requestedDate = getQueryParam('date', '');
    var isThumbnailLoading = !!(DATE_MEAL_STATUS[requestedDate] && DATE_MEAL_STATUS[requestedDate].thumbnailLoading);

    var elHdMeal = document.getElementById('hdMeal');
    var elHero = document.getElementById('heroPhoto');
    var elCorner = document.getElementById('detailCorner');
    var elName = document.getElementById('detailName');
    var elItems = document.getElementById('nutritionItems');
    var elMacro = document.getElementById('macroSummary');
    var elOrigin = document.getElementById('detailOrigin');
    var elAllergy = document.getElementById('detailAllergy');
    var elVocLink = document.getElementById('detailVocLink');

    function render(){
      var corner = meal.corners.filter(function(c){ return c.id === activeCornerId; })[0];

      elHdMeal.textContent = meal.label;

      if(!isThumbnailLoading){
        loadMealImage(elHero);
        elHero.src = corner.photo;
        elHero.alt = corner.name;
      }
      elCorner.textContent = '코너 ' + corner.id.toUpperCase() + ' · ' + corner.type;
      elName.textContent = corner.name;
      elVocLink.href = 'voc.html?meal=' + mealKey + '&corner=' + corner.id;

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
        '<div class="macro-cell"><span class="macro-label">나트륨</span><span class="macro-value">' + corner.macro.sodium + '<small>mg</small></span></div>' +
        '<div class="macro-cell macro-total"><span class="macro-label">총 칼로리</span><span class="macro-value">' + corner.macro.total + '<small>kcal</small></span></div>';
      elOrigin.textContent = corner.origin;
      elAllergy.textContent = corner.allergy;
    }

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
    var maxMessageLength = vocMessage.maxLength;
    vocMessage.addEventListener('beforeinput', function(e){
      if(!e.inputType || e.inputType.indexOf('delete') === 0) return;
      var insertedText = e.data;
      if(insertedText === null && e.clipboardData) insertedText = e.clipboardData.getData('text');
      if(typeof insertedText !== 'string') return;
      var selectedLength = vocMessage.selectionEnd - vocMessage.selectionStart;
      if(vocMessage.value.length - selectedLength + insertedText.length > maxMessageLength) e.preventDefault();
    });
    function syncMessageLength(){
      if(vocMessage.value.length > maxMessageLength){
        var caretPosition = Math.min(vocMessage.selectionStart, maxMessageLength);
        vocMessage.value = vocMessage.value.slice(0, maxMessageLength);
        vocMessage.setSelectionRange(caretPosition, caretPosition);
      }
      vocCharCount.textContent = vocMessage.value.length + ' / ' + maxMessageLength;
    }
    vocMessage.addEventListener('input', syncMessageLength);
    vocMessage.addEventListener('compositionend', syncMessageLength);
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
      var fileCountMessage = message || (attachedPhotos.length ? attachedPhotos.length + '장의 사진이 첨부되었습니다.' : '');
      vocFileCount.hidden = !fileCountMessage;
      vocFileCount.textContent = fileCountMessage;
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
      var vocSuccessAlert = document.getElementById('vocSuccessAlert');
      if(vocSuccessAlert) vocSuccessAlert.hidden = false;
    });
    var vocSuccessConfirm = document.getElementById('vocSuccessConfirm');
    if(vocSuccessConfirm){
      vocSuccessConfirm.addEventListener('click', function(){ window.location.href = 'voc-list.html'; });
    }
  }

  /* -------------------------------------------------------
     공통 일반 알럿 — data-alert-open / data-alert-close로 단일·선택형을 공통 제어
     ------------------------------------------------------- */
  document.querySelectorAll('[data-alert-open]').forEach(function(trigger){
    trigger.addEventListener('click', function(){
      var alert = document.getElementById(trigger.getAttribute('data-alert-open'));
      if(alert) alert.hidden = false;
    });
  });
  document.querySelectorAll('[data-alert-close]').forEach(function(button){
    button.addEventListener('click', function(){
      var alert = button.closest('.app-alert');
      if(alert) alert.hidden = true;
    });
  });
  var alertPopupPage = document.getElementById('alertPopupPage');
  if(alertPopupPage){
    var isDoubleAlert = new URLSearchParams(location.search).get('type') === 'double';
    document.getElementById('singleAlert').hidden = isDoubleAlert;
    document.getElementById('doubleAlert').hidden = !isDoubleAlert;
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

  /* PAGE: notice-detail.html — URL의 공지 ID로 독립 상세 화면을 렌더링 */
  var noticeDetailPage = document.getElementById('noticeDetailPage');
  if(noticeDetailPage){
    var noticeItems = {
      'service-start': {
        title:'[안내] 10월 6일부터 새 급식정보 서비스가 시작됩니다', date:'2026.09.01', pinned:true,
        content:'10월 6일부터 기존 급식정보 제공 서비스가 종료되고, 새로운 급식정보 서비스가 시작됩니다.\n\n새 서비스에서는 날짜와 식사 구분을 선택해 오늘의 식단을 빠르게 확인할 수 있습니다.\n\n가입은 사내 메일 주소 인증만으로 가능하며, 별도의 사번 등록 절차는 없습니다. 이용에 참고 부탁드립니다.'
      },
      'login-method': {
        title:'로그인 방식 변경 안내', date:'2026.08.24',
        content:'보다 간편하고 안전한 서비스 이용을 위해 로그인 방식이 사내 메일 주소 인증 방식으로 변경됩니다.\n\n이용 중인 사내 메일 주소로 인증을 완료한 뒤 서비스를 이용해 주세요.'
      },
      'hygiene-check': {
        title:'8월 여름철 위생점검 결과 공유', date:'2026.08.05',
        content:'8월 여름철 위생점검을 완료했습니다.\n\n식당 내 위생 관리와 식재료 보관 상태를 점검했으며, 앞으로도 안전한 식사를 제공할 수 있도록 지속적으로 관리하겠습니다.'
      }
    };
    var noticeId = new URLSearchParams(location.search).get('id') || 'service-start';
    var notice = noticeItems[noticeId] || noticeItems['service-start'];
    var noticeTitle = document.getElementById('noticeDetailTitle');
    var noticeDate = document.getElementById('noticeDetailDate');
    var noticeBody = document.getElementById('noticeDetailBody');
    var noticeTag = document.getElementById('noticeDetailTag');
    noticeTitle.textContent = notice.title;
    noticeDate.textContent = notice.date;
    noticeDate.dateTime = notice.date.replace(/\./g, '-');
    noticeBody.textContent = notice.content;
    noticeTag.hidden = !notice.pinned;
  }

});
