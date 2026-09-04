/* =========================================================
   해비치 급식 App — 인증 화면 전용 스크립트

   적용 대상: splash/login/signup/password-reset의 V1·V2·V3 화면
   비의존성: 서비스 화면 1의 common.js, 서비스 화면 2의 service-v2.js

   [V1] 기본형 인증 흐름
   [V2] auth-v2.css를 사용하는 카드형 인증 흐름
   [V3] 통합 스플래시·플로팅 시트형 인증 흐름
   ========================================================= */

document.addEventListener('DOMContentLoaded', function(){
  /* =======================================================
     V3 — 통합 스플래시와 플로팅 로그인·회원가입 시트
     ======================================================= */
  var animateV3SheetHeight = function(sheet, startHeight, endHeight){
    if(!sheet) return;
    sheet.style.minHeight = '0px';
    sheet.style.height = startHeight + 'px';
    window.requestAnimationFrame(function(){ sheet.style.height = endHeight + 'px'; });
    window.setTimeout(function(){
      sheet.style.height = '';
      sheet.style.minHeight = '';
    }, 650);
  };

  var unifiedV3Auth = document.querySelector('.v3-unified-auth');
  if(unifiedV3Auth){
    var defaultV3Copy = unifiedV3Auth.querySelector('.v3-auth-hero-copy');
    var changeV3HeroCopy = function(kicker, title, description){
      defaultV3Copy.classList.add('is-v3-copy-changing');
      window.setTimeout(function(){
        defaultV3Copy.querySelector('p').textContent = kicker;
        defaultV3Copy.querySelector('h1').innerHTML = title;
        defaultV3Copy.querySelector('span').textContent = description;
        defaultV3Copy.classList.remove('is-v3-copy-changing');
      }, 160);
    };
    changeV3HeroCopy('FOOD SERVICE', '오늘의 식사를<br>더 편리하게', '식사 정보와 소통을 한곳에서 확인해 보세요.');
    if(new URLSearchParams(window.location.search).get('from') === 'reset'){
      document.body.classList.add('is-v3-returning');
      unifiedV3Auth.classList.add('is-v3-login-revealed');
    }else{
      window.setTimeout(function(){ unifiedV3Auth.classList.add('is-v3-login-revealed'); }, 1500);
    }
    unifiedV3Auth.addEventListener('click', function(event){
      if(event.target.closest('input, button, a, label')) return;
      unifiedV3Auth.classList.add('is-v3-login-revealed');
    });
  }

  /* =======================================================
     V1 / V2 — 독립 스플래시 화면의 로그인 전환
     ======================================================= */
  /* -------------------------------------------------------
     PAGE: splash.html — 앱 실행 후 기본 진입
     실제 앱에서는 여기서 자동 로그인 세션을 확인해 유효하면 홈으로,
     아니면 로그인으로 전환한다. 퍼블리싱은 비로그인 기본 흐름만 재현한다.
     ------------------------------------------------------- */
  var moveFromSplash = function(splashId, loginUrl, stayDuration){
    var splash = document.getElementById(splashId);
    if(!splash) return;
    window.setTimeout(function(){
      document.body.classList.add('is-splash-leaving');
      window.setTimeout(function(){ window.location.replace(loginUrl); }, 360);
    }, stayDuration);
  };
  moveFromSplash('splashScreen', 'login.html', 1500);
  moveFromSplash('splashScreenV2', 'login-v2.html', 1500);


  /* =======================================================
     V1 / V2 / V3 — 로그인, 회원가입, 비밀번호 재설정 공통 흐름
     data-auth-version 값으로 V2·V3 전용 처리를 분기한다.
     ======================================================= */
  /* -------------------------------------------------------
     PAGE: login.html
     ------------------------------------------------------- */
  var loginForm = document.getElementById('loginForm');
  if(loginForm){
    if(document.body.dataset.authVersion === 'v3'){
      var loginEmail = document.getElementById('email');
      var loginPassword = document.getElementById('pw');
      var loginSubmit = loginForm.querySelector('[type="submit"]');
      var syncV3LoginState = function(){
        var ready = loginEmail.value.trim().length > 0 && loginPassword.value.length > 0;
        loginSubmit.disabled = !ready;
        loginSubmit.classList.toggle('is-ready', ready);
      };
      syncV3LoginState();
      loginEmail.addEventListener('input', syncV3LoginState);
      loginPassword.addEventListener('input', syncV3LoginState);
      var v3SignupLink = document.querySelector('.v3-card-footer a');
      if(v3SignupLink){
        v3SignupLink.href = '#signup';
        v3SignupLink.addEventListener('click', function(event){
          event.preventDefault();
          var v3UnifiedAuth = loginForm.closest('.v3-unified-auth');
          if(v3UnifiedAuth){
            var v3LoginSheet = v3UnifiedAuth.querySelector('.v3-login-sheet');
            var v3SignupSheet = v3UnifiedAuth.querySelector('.v3-signup-sheet');
            animateV3SheetHeight(v3SignupSheet, v3LoginSheet.getBoundingClientRect().height, v3SignupSheet.scrollHeight);
            v3UnifiedAuth.classList.add('is-v3-signup-revealed');
            v3UnifiedAuth.classList.add('is-v3-signup-entering');
            window.setTimeout(function(){ v3UnifiedAuth.classList.remove('is-v3-signup-entering'); }, 720);
            changeV3HeroCopy('JOIN FOOD SERVICE', '서비스 이용을 위한<br>간단한 가입 절차', '사내 메일 인증 후 바로 이용할 수 있어요.');
            return;
          }
        });
      }
    }
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
     PAGE: signup.html — 도메인 확인 / 메일 인증 / 비밀번호 등록
     실제 메일 발송과 인증은 개발 연동 대상이며, 퍼블리싱에서는 단계
     전환과 유효성 상태를 확인할 수 있게만 구성한다.
     ------------------------------------------------------- */
  var signupForm = document.getElementById('signupForm');
  if(signupForm){
    var signupEmail = document.getElementById('signupEmail');
    var signupEmailError = document.getElementById('signupEmailError');
    var signupEmailDisplay = document.getElementById('signupEmailDisplay');
    var signupCode = document.getElementById('signupCode');
    var signupCodeError = document.getElementById('signupCodeError');
    var signupResend = document.getElementById('signupResend');
    var signupPassword = document.getElementById('signupPassword');
    var signupPasswordConfirm = document.getElementById('signupPasswordConfirm');
    var signupPasswordLengthError = document.getElementById('signupPasswordLengthError');
    var signupPasswordError = document.getElementById('signupPasswordError');
    var signupBack = document.getElementById('signupBack');
    var signupBackLabel = document.getElementById('signupBackLabel');
    var signupStep = 1;
    var changeSignupStep = function(step){
      signupStep = step;
      signupForm.querySelectorAll('[data-signup-step]').forEach(function(panel){
        panel.hidden = Number(panel.dataset.signupStep) !== step;
      });
      signupForm.querySelectorAll('[data-signup-progress]').forEach(function(marker){
        marker.classList.toggle('is-active', Number(marker.dataset.signupProgress) <= step);
      });
      signupBackLabel.textContent = step === 1 ? '로그인으로 돌아가기' : '이전 단계로 돌아가기';
      if(signupForm.dataset.signupVersion === 'v3'){
        var activeV3Step = signupForm.querySelector('[data-signup-step]:not([hidden])');
        if(activeV3Step){
          activeV3Step.classList.remove('is-v3-step-enter');
          window.setTimeout(function(){ activeV3Step.classList.add('is-v3-step-enter'); }, 0);
        }
      }
    };
    signupBack.addEventListener('click', function(){
      if(signupStep === 1){
        var signupVersion = signupForm.dataset.signupVersion;
        if(signupVersion === 'v3'){
          var unifiedAuth = signupForm.closest('.v3-unified-auth');
          if(unifiedAuth){
            var signupSheet = unifiedAuth.querySelector('.v3-signup-sheet');
            var loginSheet = unifiedAuth.querySelector('.v3-login-sheet');
            animateV3SheetHeight(loginSheet, signupSheet.getBoundingClientRect().height, loginSheet.scrollHeight);
            unifiedAuth.classList.remove('is-v3-signup-revealed');
            unifiedAuth.classList.add('is-v3-login-entering');
            window.setTimeout(function(){ unifiedAuth.classList.remove('is-v3-login-entering'); }, 720);
            changeV3HeroCopy('FOOD SERVICE', '오늘의 식사를<br>더 편리하게', '식사 정보와 소통을 한곳에서 확인해 보세요.');
            return;
          }
        }
        window.location.href = signupVersion ? 'login-' + signupVersion + '.html' : 'login.html';
        return;
      }
      changeSignupStep(signupStep - 1);
    });
    signupForm.querySelector('[data-signup-next="email"]').addEventListener('click', function(){
      var email = signupEmail.value.trim();
      var isAllowed = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !/^test/i.test(email) && !/@(gmail|naver|daum)\./i.test(email);
      signupEmailError.hidden = isAllowed;
      if(!isAllowed){ signupEmail.focus(); return; }
      signupEmailDisplay.textContent = email;
      changeSignupStep(2);
      signupCode.focus();
    });
    signupResend.addEventListener('click', function(){
      signupCode.value = '';
      signupCodeError.hidden = true;
      signupResend.textContent = '발송 완료';
      window.setTimeout(function(){ signupResend.textContent = '재발송'; }, 1800);
    });
    signupForm.querySelector('[data-signup-next="verify"]').addEventListener('click', function(){
      var isValidCode = /^\d{6}$/.test(signupCode.value.trim());
      signupCodeError.hidden = isValidCode;
      if(!isValidCode){ signupCode.focus(); return; }
      changeSignupStep(3);
      signupPassword.focus();
    });
    signupForm.addEventListener('submit', function(e){
      e.preventDefault();
      var hasValidLength = signupPassword.value.length >= 8;
      var isMatching = hasValidLength && signupPassword.value === signupPasswordConfirm.value;
      signupPasswordLengthError.hidden = hasValidLength;
      signupPasswordError.hidden = isMatching;
      if(!hasValidLength){ signupPassword.focus(); return; }
      if(!isMatching){ signupPasswordConfirm.focus(); return; }
      window.location.href = 'home.html';
    });
  }


  /* -------------------------------------------------------
     PAGE: password-reset*.html — 사내 메일 인증 후 비밀번호 재설정
     메일 발송·인증번호 검증·비밀번호 저장은 개발 연동 대상이며,
     퍼블리싱에서는 단계 전환과 유효성 상태를 확인할 수 있게만 구성한다.
     ------------------------------------------------------- */
  var passwordResetForm = document.getElementById('passwordResetForm');
  if(passwordResetForm){
    var resetEmail = document.getElementById('resetEmail');
    var resetEmailError = document.getElementById('resetEmailError');
    var resetEmailDisplay = document.getElementById('resetEmailDisplay');
    var resetCode = document.getElementById('resetCode');
    var resetCodeError = document.getElementById('resetCodeError');
    var resetResend = document.getElementById('resetResend');
    var resetPassword = document.getElementById('resetPassword');
    var resetPasswordConfirm = document.getElementById('resetPasswordConfirm');
    var resetPasswordLengthError = document.getElementById('resetPasswordLengthError');
    var resetPasswordError = document.getElementById('resetPasswordError');
    var resetBack = document.getElementById('passwordResetBack');
    var resetStep = 1;
    var changeResetStep = function(step){
      resetStep = step;
      passwordResetForm.querySelectorAll('[data-password-reset-step]').forEach(function(panel){
        panel.hidden = Number(panel.dataset.passwordResetStep) !== step;
      });
    };
    passwordResetForm.querySelector('[data-password-reset-next="email"]').addEventListener('click', function(){
      var email = resetEmail.value.trim();
      var isAllowed = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !/^test/i.test(email) && !/@(gmail|naver|daum)\./i.test(email);
      resetEmailError.hidden = isAllowed;
      if(!isAllowed){ resetEmail.focus(); return; }
      resetEmailDisplay.textContent = email;
      changeResetStep(2);
      resetCode.focus();
    });
    resetResend.addEventListener('click', function(){
      resetCode.value = '';
      resetCodeError.hidden = true;
      resetResend.textContent = '발송 완료';
      window.setTimeout(function(){ resetResend.textContent = '재발송'; }, 1800);
    });
    passwordResetForm.querySelector('[data-password-reset-next="verify"]').addEventListener('click', function(){
      var isValidCode = /^\d{6}$/.test(resetCode.value.trim());
      resetCodeError.hidden = isValidCode;
      if(!isValidCode){ resetCode.focus(); return; }
      changeResetStep(3);
      resetPassword.focus();
    });
    resetBack.addEventListener('click', function(event){
      if(resetStep === 1) return;
      event.preventDefault();
      changeResetStep(resetStep - 1);
    });
    passwordResetForm.addEventListener('submit', function(event){
      event.preventDefault();
      var hasValidLength = resetPassword.value.length >= 8;
      var isMatching = hasValidLength && resetPassword.value === resetPasswordConfirm.value;
      resetPasswordLengthError.hidden = hasValidLength;
      resetPasswordError.hidden = isMatching;
      if(!hasValidLength){ resetPassword.focus(); return; }
      if(!isMatching){ resetPasswordConfirm.focus(); return; }
      var version = passwordResetForm.dataset.passwordResetVersion;
      window.location.href = version === 'v3' ? 'splash-v3.html' : (version === 'v2' ? 'login-v2.html' : 'login.html');
    });
  }

});
