/* 식단상세 디자인 시안 (Claude 제안) — 별점 인터랙션만 재현. */
(function(){
  var rating = 0;
  var stars = document.querySelectorAll('#stars button');
  var hint = document.getElementById('rateHint');
  var submit = document.getElementById('submitBtn');

  stars.forEach(function(btn){
    btn.addEventListener('click', function(){
      rating = parseInt(btn.getAttribute('data-n'), 10);
      stars.forEach(function(b){
        b.classList.toggle('on', parseInt(b.getAttribute('data-n'), 10) <= rating);
      });
      hint.textContent = rating + '점을 선택하셨어요';
      submit.disabled = false;
    });
  });

  submit.addEventListener('click', function(){
    if(!rating) return;
    submit.textContent = '평가 완료';
    submit.disabled = true;
  });
})();
