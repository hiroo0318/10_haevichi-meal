/*
  식단상세 디자인 시안 3번.
  home-concept.js와 같은 형태의 데이터를 쓰되, 상세 화면에 필요한
  구성/영양/알레르기 정보를 코너별로 갖고 있다.
  별점은 코너마다 독립적으로 등록한다 — 코너를 전환해도 이미 고른 별점은
  유지되고, 새 코너는 새로 골라야 한다(실제로 다른 메뉴이기 때문).
*/
(function(){

  var MEALS = {
    breakfast: {
      label: '조식', eyebrow: 'BREAKFAST MENU', time: '07:30–09:00',
      corners: [
        {
          id: 'a', name: '된장국 정식', photo: 'images/doenjangguk-photo.png',
          composition: [
            ['주식', '잡곡밥'], ['국', '된장국'], ['반찬', '계란말이 · 시금치나물']
          ],
          kcal: 540, sodium: 890, allergy: '대두 함유', tags: ['된장 국내산']
        }
      ]
    },
    lunch: {
      label: '중식', eyebrow: 'LUNCH MENU', time: '11:30–13:30',
      corners: [
        {
          id: 'a', name: '제육볶음 정식', photo: 'images/jeyuk-bokkeum-photo.png',
          composition: [
            ['주식', '잡곡밥'], ['메인', '제육볶음'], ['반찬', '계란찜 · 시금치나물 · 배추김치'], ['국', '된장국']
          ],
          kcal: 620, sodium: 980, allergy: '대두, 돼지고기 함유', tags: ['돼지고기 국내산', '쌀 국내산']
        },
        {
          id: 'b', name: '비빔밥 코너', photo: 'images/bibimbap.svg',
          composition: [
            ['주식', '흰쌀밥'], ['메인', '나물 비빔 5종'], ['반찬', '계란후라이 · 고추장']
          ],
          kcal: 560, sodium: 860, allergy: '대두, 계란 함유', tags: ['쌀 국내산', '계란 국내산']
        }
      ]
    },
    dinner: {
      label: '석식', eyebrow: 'DINNER MENU', time: '17:30–19:00',
      corners: [
        {
          id: 'a', name: '순두부찌개 정식', photo: 'images/sundubu-jjigae-photo.png',
          composition: [
            ['주식', '흰쌀밥'], ['메인', '순두부찌개'], ['반찬', '계란후라이 · 어묵볶음']
          ],
          kcal: 580, sodium: 1020, allergy: '대두 함유', tags: ['대두 국내산']
        }
      ]
    }
  };

  function getQueryParam(name, fallback){
    var m = new RegExp('[?&]' + name + '=([^&]+)').exec(location.search);
    return m ? decodeURIComponent(m[1]) : fallback;
  }

  var mealKey = getQueryParam('meal', 'lunch');
  if(!MEALS[mealKey]) mealKey = 'lunch';
  var meal = MEALS[mealKey];

  var requestedCorner = getQueryParam('corner', meal.corners[0].id);
  var activeCornerId = meal.corners.some(function(c){ return c.id === requestedCorner; })
    ? requestedCorner : meal.corners[0].id;

  // 코너별 별점은 화면(탭) 전환과 무관하게 각자 따로 저장한다.
  var ratings = {};
  meal.corners.forEach(function(c){ ratings[c.id] = 0; });

  var elHdMeal = document.getElementById('hdMeal');
  var elCornerSwitch = document.getElementById('cornerSwitch');
  var elHeroPhoto = document.getElementById('heroPhoto');
  var elHeroTime = document.getElementById('heroTime');
  var elKicker = document.getElementById('kicker');
  var elMenuName = document.getElementById('menuName');
  var elTagRow = document.getElementById('tagRow');
  var elComposition = document.getElementById('composition');
  var elNutriKcal = document.getElementById('nutriKcal');
  var elNutriSodium = document.getElementById('nutriSodium');
  var elAllergyText = document.getElementById('allergyText');
  var elStars = document.querySelectorAll('#stars button');
  var elRateHint = document.getElementById('rateHint');
  var elSubmit = document.getElementById('submitBtn');

  function renderCornerSwitch(){
    elCornerSwitch.innerHTML = '';
    if(meal.corners.length < 2){
      elCornerSwitch.hidden = true;
      return;
    }
    elCornerSwitch.hidden = false;
    meal.corners.forEach(function(corner){
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'corner-switch-tab';
      btn.textContent = '코너 ' + corner.id.toUpperCase();
      if(corner.id === activeCornerId) btn.classList.add('is-active');
      btn.addEventListener('click', function(){
        activeCornerId = corner.id;
        render();
      });
      elCornerSwitch.appendChild(btn);
    });
  }

  function render(){
    var corner = meal.corners.filter(function(c){ return c.id === activeCornerId; })[0];

    elHdMeal.textContent = meal.label;
    renderCornerSwitch();

    elHeroPhoto.src = corner.photo;
    elHeroPhoto.alt = corner.name;
    elHeroTime.textContent = meal.time + ' 제공';

    elKicker.textContent = meal.eyebrow + (meal.corners.length > 1 ? ' · 코너 ' + corner.id.toUpperCase() : '');
    elMenuName.textContent = corner.name;

    elTagRow.innerHTML = '';
    corner.tags.forEach(function(t){
      var span = document.createElement('span');
      span.className = 'tag';
      span.textContent = t;
      elTagRow.appendChild(span);
    });

    elComposition.innerHTML = '';
    corner.composition.forEach(function(pair){
      var row = document.createElement('div');
      row.className = 'row';
      row.innerHTML = '<span>' + pair[0] + '</span><b>' + pair[1] + '</b>';
      elComposition.appendChild(row);
    });

    elNutriKcal.innerHTML = corner.kcal + '<small>kcal</small>';
    elNutriSodium.innerHTML = corner.sodium + '<small>mg</small>';
    elAllergyText.textContent = corner.allergy;

    renderRatingUI();
  }

  function renderRatingUI(){
    var rating = ratings[activeCornerId];
    elStars.forEach(function(btn){
      btn.classList.toggle('on', parseInt(btn.getAttribute('data-n'), 10) <= rating);
    });
    elRateHint.textContent = rating ? rating + '점을 선택하셨어요' : '별점을 선택해 주세요';
    elSubmit.disabled = rating < 1;
    elSubmit.textContent = '평가 등록';
  }

  elStars.forEach(function(btn){
    btn.addEventListener('click', function(){
      ratings[activeCornerId] = parseInt(btn.getAttribute('data-n'), 10);
      renderRatingUI();
    });
  });

  elSubmit.addEventListener('click', function(){
    if(!ratings[activeCornerId]) return;
    elSubmit.textContent = '평가 완료';
    elSubmit.disabled = true;
  });

  render();
})();
