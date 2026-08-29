/*
  홈 화면 디자인 시안 (Claude 제안).
  실제 서비스에서는 서버가 내려주는 "현재 상태"를 그대로 반영하면 되고,
  이 파일의 상태 스위처(버튼)는 검토용일 뿐 실제 화면에는 들어가지 않는다.

  핵심 설계: 하루 동안 있을 수 있는 7개 상태(조식전 ~ 석식후)는
  스포트라이트 카드 기준으로 3개 모드로 압축된다.
    - now   : 지금 이 끼니를 제공 중 (조식중/중식중/석식중)
    - next  : 다음 끼니를 기다리는 중 (조식전, 조식후~중식전, 중식후~석식전)
    - closed: 오늘 끼니가 모두 끝남 (석식후)
*/
(function(){

  var MEALS = {
    breakfast: {
      label: '조식', time: '07:30–09:00',
      name: '된장국 정식',
      desc: '잡곡밥 · 계란말이 · 시금치나물',
      tags: ['된장 국내산'],
      photo: 'images/doenjangguk-photo.png'
    },
    lunch: {
      label: '중식', time: '11:30–13:30',
      name: '제육볶음 정식',
      desc: '잡곡밥 · 계란찜 · 시금치나물 · 배추김치 · 된장국',
      tags: ['돼지고기 국내산', '알레르기 대두·돼지고기'],
      photo: 'images/jeyuk-bokkeum-photo.png'
    },
    dinner: {
      label: '석식', time: '17:30–19:00',
      name: '순두부찌개 정식',
      desc: '흰쌀밥 · 계란후라이 · 어묵볶음',
      tags: ['대두 국내산'],
      photo: 'images/sundubu-jjigae-photo.png'
    }
  };

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
  var elTitle = document.getElementById('spotlightTitle');
  var elDesc = document.getElementById('spotlightDesc');
  var elTags = document.getElementById('spotlightTags');
  var elLink = document.getElementById('spotlightLink');
  var elLinkText = document.getElementById('spotlightLinkText');

  function renderTags(list){
    elTags.innerHTML = '';
    list.forEach(function(t){
      var span = document.createElement('span');
      span.className = 'spotlight-tag';
      span.textContent = t;
      elTags.appendChild(span);
    });
  }

  function applyState(stateId){
    var state = STATES[stateId];
    if(!state) return;

    if(state.mode === 'closed'){
      spotlight.hidden = true;
      closedCard.hidden = false;
    } else {
      closedCard.hidden = true;
      spotlight.hidden = false;

      var meal = MEALS[state.meal];
      spotlight.classList.toggle('is-next', state.mode === 'next');
      spotlight.classList.toggle('is-now', state.mode === 'now');

      elPhoto.src = meal.photo;
      elPhoto.alt = meal.name;
      elEyebrow.textContent = '8월 19일 수요일 · ' + (state.mode === 'now' ? '지금 제공 중' : '잠시 후 제공');
      elTime.textContent = meal.label + ' ' + meal.time;
      elTitle.textContent = meal.name;
      elDesc.textContent = meal.desc;
      renderTags(meal.tags);

      if(state.mode === 'now'){
        elLinkText.textContent = '식단 상세·별점 남기기';
        elLink.setAttribute('href', 'menu-detail-concept.html');
      } else {
        elLinkText.textContent = '메뉴 미리 보기';
        elLink.setAttribute('href', 'menu-detail-concept.html');
      }
    }

    // 하루 흐름 리스트: 상태에 맞춰 각 행의 배지·강조를 갱신한다.
    var order = ['breakfast','lunch','dinner'];
    var currentIndex = state.meal ? order.indexOf(state.meal) : -1;

    order.forEach(function(key, idx){
      var row = document.querySelector('.timeline-row[data-row="' + key + '"]');
      var side = document.querySelector('[data-side="' + key + '"]');
      row.classList.remove('is-now', 'is-next', 'is-done');
      side.innerHTML = '';

      var isPastMeal = state.mode === 'closed' || (currentIndex > -1 && idx < currentIndex) ||
        (state.mode === 'now' && idx < currentIndex);

      if(state.mode !== 'closed' && key === state.meal && state.mode === 'now'){
        row.classList.add('is-now');
        side.innerHTML = '<span class="row-badge">제공 중</span>';
      } else if(state.mode !== 'closed' && key === state.meal && state.mode === 'next'){
        row.classList.add('is-next');
        side.innerHTML = '<span class="row-state muted">곧 시작</span>';
      } else if(state.mode === 'closed' || idx < currentIndex || (state.mode === 'next' && idx < currentIndex)){
        row.classList.add('is-done');
        side.innerHTML = key === 'breakfast'
          ? '<span class="row-rating">★ 4.0</span><span class="row-state">평가완료</span>'
          : '<span class="row-state">평가완료</span>';
      } else {
        side.innerHTML = '<span class="row-state muted">평가 전</span>';
      }
    });
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
