(function(){
  'use strict';

  var meals = {
    breakfast: { label:'조식', time:'07:30–09:00', cards:[{ id:'a', type:'한식', name:'된장국 정식', photo:'resources/images/menu/doenjangguk-photo.png', items:[['잡곡밥',300],['된장국',120],['계란말이',150],['시금치나물',40]], macro:{total:540,carb:180,protein:70,fat:40,sodium:1050} }] },
    lunch: { label:'중식', time:'11:30–13:30', cards:[{ id:'a', type:'한식', name:'제육볶음 정식', photo:'resources/images/menu/jeyuk-bokkeum-photo.png', items:[['잡곡밥',300],['제육볶음',280],['계란찜',120],['시금치나물',40],['배추김치',30],['된장국',120]], macro:{total:890,carb:210,protein:120,fat:90,sodium:1480} },{ id:'b', type:'한식', name:'비빔밥 코너', photo:'resources/images/menu/bibimbap-photo.png', items:[['흰쌀밥',300],['나물 5종',150],['계란후라이',110],['고추장',30]], macro:{total:790,carb:195,protein:85,fat:75,sodium:1290} }] },
    dinner: { label:'석식', time:'17:30–19:00', cards:[{ id:'a', type:'한식', name:'순두부찌개 정식', photo:'resources/images/menu/sundubu-jjigae-photo.png', items:[['흰쌀밥',300],['순두부찌개',210],['계란후라이',110],['어묵볶음',90]], macro:{total:710,carb:185,protein:95,fat:80,sodium:1390} }] }
  };
  var weeks = {
    previous:[['일','23'],['월','24'],['화','25'],['수','26'],['목','27'],['금','28'],['토','29']],
    current:[['일','30'],['월','31'],['화','1'],['수','2'],['목','3'],['금','4'],['토','5']],
    next:[['일','6'],['월','7'],['화','8'],['수','9'],['목','10'],['금','11'],['토','12']]
  };
  var selectedWeek = 'current';
  var selectedDay = 3;
  var find = function(name){ return new URLSearchParams(location.search).get(name); };
  var escape = function(value){ return String(value).replace(/[&<>'"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]; }); };

  function renderDates(){
    var root = document.getElementById('mealV2Dates');
    if(!root) return;
    root.innerHTML = weeks[selectedWeek].map(function(day, index){
      return '<button type="button" class="' + (index === selectedDay ? 'is-selected' : '') + '" data-day="' + index + '"><span>' + day[0] + '</span><strong>' + day[1] + '</strong></button>';
    }).join('');
  }
  function renderHome(){
    var root = document.getElementById('mealV2Sections');
    if(!root) return;
    root.innerHTML = Object.keys(meals).map(function(key){
      var meal = meals[key];
      var cards = meal.cards.map(function(card){
        return '<a class="meal-v2-photo-card" style="--meal-v2-photo:url(\'' + card.photo + '\')" href="menu-detail-v2.html?meal=' + key + '&corner=' + card.id + '"><img src="' + card.photo + '" alt="' + escape(card.name) + '"><span class="meal-v2-photo-copy"><small>코너 ' + card.id.toUpperCase() + '</small><strong>' + escape(card.name) + '</strong></span></a>';
      }).join('');
      return '<section class="meal-v2-meal-section"><div class="meal-v2-section-title"><h2>' + meal.label + '</h2><span>' + meal.time + '</span></div><div class="meal-v2-photo-grid meal-v2-photo-grid--' + meal.cards.length + '">' + cards + '</div></section>';
    }).join('');
  }
  function renderDetail(){
    var root = document.getElementById('mealV2Detail');
    if(!root) return;
    var key = find('meal') || 'lunch';
    var meal = meals[key] || meals.lunch;
    var id = find('corner') || meal.cards[0].id;
    var card = meal.cards.filter(function(item){ return item.id === id; })[0] || meal.cards[0];
    var detailItems = card.items.map(function(item){ return '<li><span>' + escape(item[0]) + '</span><b>' + item[1] + 'kcal</b></li>'; }).join('');
    root.innerHTML = '<article class="meal-v2-detail-sheet">' +
      '<img class="meal-v2-detail-photo" src="' + card.photo + '" alt="' + escape(card.name) + '">' +
      '<div class="meal-v2-detail-body"><div class="meal-v2-detail-intro"><div class="meal-v2-detail-title"><p>코너 ' + card.id.toUpperCase() + ' · ' + card.type + '</p><h2>' + escape(card.name) + '</h2></div>' +
      '<section class="meal-v2-detail-menu"><ul>' + detailItems + '</ul></section></div>' +
      '<section class="meal-v2-nutrients"><h3>영양소 정보</h3><div><span><small>열량</small><b>' + card.macro.total + 'kcal</b></span><span><small>탄수화물</small><b>' + card.macro.carb + 'g</b></span><span><small>단백질</small><b>' + card.macro.protein + 'g</b></span><span><small>지방</small><b>' + card.macro.fat + 'g</b></span><span><small>나트륨</small><b>' + card.macro.sodium + 'mg</b></span></div></section>' +
      '<a class="meal-v2-opinion" href="voc.html?meal=' + key + '&corner=' + card.id + '">의견 쓰기</a></div></article>';
  }

  document.querySelectorAll('[data-week]').forEach(function(button){
    button.addEventListener('click', function(){ selectedWeek = button.dataset.week; selectedDay = 3; document.querySelectorAll('[data-week]').forEach(function(item){ item.classList.toggle('is-active', item === button); }); renderDates(); });
  });
  document.addEventListener('click', function(event){ var day = event.target.closest('[data-day]'); if(!day) return; selectedDay = Number(day.dataset.day); renderDates(); });
  renderDates(); renderHome(); renderDetail();
})();
