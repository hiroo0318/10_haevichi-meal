/* =========================================================
   해비치 급식 App — 공통 스크립트 (common.js)
   모든 페이지가 이 파일 하나를 공통으로 불러온다.
   각 블록은 해당 페이지에 필요한 엘리먼트가 있을 때만 동작하므로
   다른 페이지에서 이 파일을 같이 불러와도 에러 없이 무시된다.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function(){

  /* -------------------------------------------------------
     PAGE: login.html — 로그인 폼 제출
     실제 인증 연동 전 단계이므로, 데모 조건(비밀번호 0000)으로만
     실패 케이스를 재현한다.
     ------------------------------------------------------- */
  var loginForm = document.getElementById('loginForm');
  if(loginForm){
    loginForm.addEventListener('submit', function(e){
      e.preventDefault();
      var pw = document.getElementById('pw').value;
      var err = document.getElementById('loginErr');

      if(pw === '0000'){
        err.hidden = false;
        return;
      }
      err.hidden = true;
      window.location.href = 'home.html';
    });
  }


  /* -------------------------------------------------------
     PAGE: home.html — 사업장 선택 버튼
     이번 4개 화면 테스트 범위 밖(HVM-BO-09-00 연동)이라
     클릭 시 동작 없이 정적으로 둔다.
     ------------------------------------------------------- */
  var bizBtn = document.getElementById('bizBtn');
  if(bizBtn){
    bizBtn.addEventListener('click', function(){
      // TODO: 사업장 선택 바텀시트 (범위 외 — 다음 단계에서 구현)
    });
  }


  /* -------------------------------------------------------
     PAGE: menu-detail.html — 별점 입력 · 평가 등록
     ------------------------------------------------------- */
  var starInput = document.getElementById('starInput');
  if(starInput){
    var rating = 0;
    var stars = starInput.querySelectorAll('.star');
    var starErr = document.getElementById('starErr');

    stars.forEach(function(star){
      star.addEventListener('click', function(){
        rating = parseInt(star.getAttribute('data-n'), 10);
        stars.forEach(function(s){
          s.classList.toggle('on', parseInt(s.getAttribute('data-n'), 10) <= rating);
        });
        if(starErr) starErr.hidden = true;
      });
    });

    var rateSubmit = document.getElementById('rateSubmit');
    if(rateSubmit){
      rateSubmit.addEventListener('click', function(){
        if(rating < 1){
          if(starErr) starErr.hidden = false;
          return;
        }
        // 실제 서비스에서는 여기서 평가 등록 API를 호출한다.
        window.location.href = 'menu-detail-rated.html';
      });
    }
  }

});
