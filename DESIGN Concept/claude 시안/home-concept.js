/*
  홈 화면 디자인 시안 (Claude 제안).
  실제 서비스에서는 서버가 내려주는 "현재 상태"를 그대로 반영하면 되고,
  이 파일의 상태 스위처(버튼)는 검토용일 뿐 실제 화면에는 들어가지 않는다.

  핵심 설계 1: 하루 동안 있을 수 있는 7개 상태(조식전 ~ 석식후)는
  스포트라이트 카드 기준으로 3개 모드로 압축된다.
    - now   : 지금 이 끼니를 제공 중 (조식중/중식중/석식중)
    - next  : 다음 끼니를 기다리는 중 (조식전, 조식후~중식전, 중식후~석식전)
    - closed: 오늘 끼니가 모두 끝남 (석식후)

  핵심 설계 2: 끼니 하나에 코너(코너 A/코너 B 등)가 여러 개일 수 있다.
  스포트라이트는 대표 코너를 보여주고 코너 탭으로 전환하며(A안),
  하루 식단 타임라인은 코너가 2개 이상이면 끼니 헤더 아래 코너별 줄로
  나눠 보여준다(B안). 별점은 코너마다 따로 등록한다.
*/
(function(){

  var MEALS = {
    breakfast: {
      label: '조식', time: '07:30–09:00',
      corners: [
        {
          id: 'a', name: '된장국 정식',
          desc: '잡곡밥 · 계란말이 · 시금치나물',
          tags: ['된장 국내산'],
          photo: 'images/doenjangguk-photo.png',
          rated: true, ratingValue: 4.0
        }
      ]
    },
    lunch: {
      label: '중식', time: '11:30–13:30',
      corners: [
        {
          id: 'a', name: '제육볶음 정식',
          desc: '잡곡밥 · 계란찜 · 시금치나물 · 배추김치 · 된장국',
          tags: ['돼지고기 국내산', '알레르기 대두·돼지고기'],
          photo: 'images/jeyuk-bokkeum-photo.png',
          rated: false
        },
        {
          id: 'b', name: '비빔밥 코너',
          desc: '흰쌀밥 · 나물 5종 · 계란후라이 · 고추장',
          tags: ['쌀 국내산', '알레르기 대두·계란'],
          photo: 'images/bibimbap.svg',
          rated: false
        }
      ]
    },
    dinner: {
      label: '석식', time: '17:30–19:00',
      corners: [
        {
          id: 'a', name: '순두부찌개 정식',
          desc: '흰쌀밥 · 계란후라이 · 어묵볶음',
          tags: ['대두 국내산'],
          photo: 'images/sundubu-jjigae-photo.png',
          rated: false
        }
      ]
    }
  };

  var MEAL_ORDER = ['breakfast', 'lunch', 'dinner'];

  // 7개 상태 → {모드, 끼니} 매핑. "~전"과 "이전 끼니 완료 후 다음 끼니 전"은
  // 스포트라이트 입장에서 동일하게 "next"로 취급한다.
  var STATES = {
    'before-breakfast':  { mode:'next',   meal:'breakfast' },
    'breakfast-serving': { mode:'now',    meal:'breakfast' },
    'before-lunch':      { mode:'next',   meal:'lunch' },
    'lunch-serving':      { mode:'now',    meal:'lunch' },
    'before-dinner':      { mode:'next',   meal:'dinner' },
    'dinner-serving':     { mode:'now',    meal:'dinner' },
    'day-closed':         { mode:'closed', meal:null }
  };

  var spotlight = document.getElementById('spotlight');
  var closedCard = document.getElementById('dayClosedCard');

  var elPhoto = document.getElementById('spotlightPhoto');
  var elEyebrow = document.getElementById('spotlightEyebrow');
  var elTime = document.getElementById('spotlightTime');
  var elCornerTabs = document.getElementById('spotlightCornerTabs');
  var elTitle = document.getElementById('spotlightTitle');
  var elDesc = document.getElementById('spotlightDesc');
  var elTags = document.getElementById('spotlightTags');
  var elLink = document.getElementById('spotlightLink');
  var elLinkText = document.getElementById('spotlightLinkText');
  var timelineBody = document.getElementById('timelineBody');
  var timelineCount = document.getElementById('timelineCount');

  var currentStateId = 'lunch-serving';
  var activeCornerByMeal = { breakfast: 'a', lunch: 'a', dinner: 'a' };

  function renderTags(list){
    elTags.innerHTML = '';
    list.forEach(function(t){
      var span = document.createElement('span');
      span.className = 'spotlight-tag';
      span.textContent = t;
      elTags.appendChild(span);
    });
  }

  function renderSpotlightCornerTabs(mealKey, meal){
    elCornerTabs.innerHTML = '';
    if(meal.corners.length < 2){
      elCornerTabs.hidden = true;
      return;
    }
    elCornerTabs.hidden = false;
    meal.corners.forEach(function(corner, idx){
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'corner-tab';
      btn.textContent = '코너 ' + corner.id.toUpperCase();
      if(activeCornerByMeal[mealKey] === corner.id) btn.classList.add('is-active');
      btn.addEventListener('click', function(e){
        e.preventDefault();
        activeCornerByMeal[mealKey] = corner.id;
        applyState(currentStateId);
      });
      elCornerTabs.appendChild(btn);
    });
  }

  function applyState(stateId){
    currentStateId = stateId;
    var state = STATES[stateId];
    if(!state) return;

    if(state.mode === 'closed'){
      spotlight.hidden = true;
      closedCard.hidden = false;
    } else {
      closedCard.hidden = true;
      spotlight.hidden = false;

      var meal = MEALS[state.meal];
      var cornerId = activeCornerByMeal[state.meal];
      var corner = meal.corners.filter(function(c){ return c.id === cornerId; })[0] || meal.corners[0];

      spotlight.classList.toggle('is-next', state.mode === 'next');
      spotlight.classList.toggle('is-now', state.mode === 'now');

      elPhoto.src = corner.photo;
      elPhoto.alt = corner.name;
      elEyebrow.textContent = '8월 19일 수요일 · ' + (state.mode === 'now' ? '지금 제공 중' : '잠시 후 제공');
      elTime.textContent = meal.label + ' ' + meal.time;
      renderSpotlightCornerTabs(state.meal, meal);
      elTitle.textContent = corner.name;
      elDesc.textContent = corner.desc;
      renderTags(corner.tags);

      var url = 'menu-detail-concept.html?meal=' + state.meal + '&corner=' + corner.id;
      elLinkText.textContent = state.mode === 'now' ? '식단 상세·별점 남기기' : '메뉴 미리 보기';
      elLink.setAttribute('href', url);
    }

    renderTimeline(state);
  }

  function cornerStateBadge(mode, corner){
    if(mode === 'now'){
      return '<span class="row-badge">제공 중</span>';
    }
    if(mode === 'next'){
      return '<span class="row-state muted">곧 시작</span>';
    }
    // closed 또는 지나간 끼니
    if(corner.rated){
      return '<span class="row-rating">★ ' + corner.ratingValue.toFixed(1) + '</span><span class="row-state">평가완료</span>';
    }
    return '<span class="row-state muted">평가 전</span>';
  }

  function renderTimeline(state){
    timelineBody.innerHTML = '';
    var currentIndex = state.meal ? MEAL_ORDER.indexOf(state.meal) : -1;
    var totalCorners = 0;

    MEAL_ORDER.forEach(function(mealKey, idx){
      var meal = MEALS[mealKey];
      totalCorners += meal.corners.length;

      var isCurrentMeal = state.mode !== 'closed' && mealKey === state.meal;
      var isPastMeal = state.mode === 'closed' || (currentIndex > -1 && idx < currentIndex);
      var rowMode = isCurrentMeal ? state.mode : (isPastMeal ? 'past' : 'upcoming');

      if(meal.corners.length < 2){
        // 코너 1개: 기존과 동일하게 한 줄로 표시
        var corner = meal.corners[0];
        var row = document.createElement('a');
        row.className = 'timeline-row';
        if(rowMode === 'now') row.classList.add('is-now');
        if(rowMode === 'next') row.classList.add('is-next');
        if(rowMode === 'past') row.classList.add('is-done');
        row.href = 'menu-detail-concept.html?meal=' + mealKey + '&corner=' + corner.id;
        row.innerHTML =
          '<span class="row-thumb"><img src="' + corner.photo + '" alt=""></span>' +
          '<span class="row-body">' +
            '<span class="row-time">' + meal.label + ' · ' + meal.time + '</span>' +
            '<strong>' + corner.name + '</strong>' +
          '</span>' +
          '<span class="row-side">' + cornerStateBadge(rowMode === 'now' ? 'now' : rowMode === 'next' ? 'next' : 'past', corner) + '</span>';
        timelineBody.appendChild(row);
      } else {
        // 코너 2개 이상: 끼니 그룹 헤더 + 코너별 줄
        var group = document.createElement('div');
        group.className = 'timeline-group';
        var header = document.createElement('div');
        header.className = 'timeline-group-head';
        header.textContent = meal.label + ' · ' + meal.time + ' · 코너 ' + meal.corners.length + '개';
        group.appendChild(header);

        meal.corners.forEach(function(corner){
          var row = document.createElement('a');
          row.className = 'timeline-row is-corner-row';
          if(rowMode === 'now') row.classList.add('is-now');
          if(rowMode === 'next') row.classList.add('is-next');
          if(rowMode === 'past') row.classList.add('is-done');
          row.href = 'menu-detail-concept.html?meal=' + mealKey + '&corner=' + corner.id;
          row.innerHTML =
            '<span class="row-thumb"><img src="' + corner.photo + '" alt=""></span>' +
            '<span class="row-body">' +
              '<span class="row-time">코너 ' + corner.id.toUpperCase() + '</span>' +
              '<strong>' + corner.name + '</strong>' +
            '</span>' +
            '<span class="row-side">' + cornerStateBadge(rowMode === 'now' ? 'now' : rowMode === 'next' ? 'next' : 'past', corner) + '</span>';
          group.appendChild(row);
        });

        timelineBody.appendChild(group);
      }
    });

    timelineCount.textContent = '총 ' + MEAL_ORDER.length + '끼 · 코너 ' + totalCorners + '개';
  }

  var stateSwitcher = document.getElementById('stateSwitcher');
  var stateToggle = document.getElementById('stateToggle');
  stateToggle.addEventListener('click', function(){
    stateSwitcher.classList.toggle('is-collapsed');
  });

  document.querySelectorAll('.state-buttons button').forEach(function(btn){
    btn.addEventListener('click', function(){
      document.querySelectorAll('.state-buttons button').forEach(function(b){ b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      applyState(btn.getAttribute('data-state'));
    });
  });

  applyState('lunch-serving');
})();
