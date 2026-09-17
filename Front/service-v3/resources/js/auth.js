/* =========================================================
   해비치 급식 App — 인증 화면 전용 스크립트

   적용 대상: splash.html / login.html / signup.html / password-reset.html
   의존 CSS: reset.css → base.css → auth.css
   서비스 화면 스크립트(common.js)와는 독립이며 서로 참조하지 않는다.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function(){
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

  /* -------------------------------------------------------
     PAGE: login.html
     ------------------------------------------------------- */
  var loginForm = document.getElementById('loginForm');
  if(loginForm){
    var loginEmail = document.getElementById('email');
    var loginPassword = document.getElementById('pw');
    var loginSubmit = loginForm.querySelector('[type="submit"]');
    var syncLoginState = function(){
      var ready = loginEmail.value.trim().length > 0 && loginPassword.value.length > 0;
      loginSubmit.disabled = !ready;
    };
    syncLoginState();
    loginEmail.addEventListener('input', syncLoginState);
    loginPassword.addEventListener('input', syncLoginState);
    loginForm.addEventListener('submit', function(e){
      e.preventDefault();
      var pw = document.getElementById('pw').value;
      var err = document.getElementById('loginErr');
      if(pw === '0000'){
        err.hidden = false;
        return;
      }
      err.hidden = true;
      /* 로그인 성공 → 식단 홈으로 이동.
         퍼블리싱 확인용 흐름이다. 실제 개발에서는 인증 API 응답과 세션 생성이 끝난 뒤
         이동하도록 교체하고, 자동로그인 체크 상태도 여기서 함께 처리한다.
         뒤로가기로 로그인 화면에 돌아올 수 있도록 replace가 아닌 href를 쓴다(검토 편의). */
      window.location.href = 'home.html';
    });
  }

  /* -------------------------------------------------------
     PAGE: signup.html — 도메인 확인 / 메일 인증 / 추가 정보 / 비밀번호 등록
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
    var signupAffiliation = document.getElementById('signupAffiliation');
    var signupGender = document.getElementById('signupGender');
    var signupAgeGroup = document.getElementById('signupAgeGroup');
    var signupPrivacyConsent = document.getElementById('signupPrivacyConsent');
    var signupProfileError = document.getElementById('signupProfileError');
    var signupEmailConsent = document.getElementById('signupEmailConsent');
    var consentLayer = document.getElementById('privacyConsentLayer');
    var consentContent = {
      email: { title: '개인정보 수집 및 이용 동의', intro: '회원가입과 사내 메일 인증을 위해 아래 정보를 수집·이용합니다.', items: '사내 이메일 주소', purpose: '로그인 ID 관리, 회원 식별 및 이메일 인증', retention: '회원 탈퇴 시까지. 관계 법령에 따라 보관이 필요한 정보는 해당 기간까지 보관합니다.' },
      profile: { title: '개인정보 수집 및 이용 동의', intro: '회원 정보 관리와 급식 서비스 운영을 위해 아래 정보를 수집·이용합니다.', items: '소속 구분, 성별, 연령대', purpose: '회원 정보 관리 및 급식 서비스 운영', retention: '회원 탈퇴 시까지. 관계 법령에 따라 보관이 필요한 정보는 해당 기간까지 보관합니다.' }
    };
    var showConsentLayer = function(type){
      if(!consentLayer || !consentContent[type]) return;
      var content = consentContent[type];
      consentLayer.querySelector('#privacyConsentTitle').textContent = content.title;
      consentLayer.querySelector('.auth-common-layer__body').innerHTML = '<p>' + content.intro + '</p><dl><dt>수집 항목</dt><dd>' + content.items + '</dd><dt>이용 목적</dt><dd>' + content.purpose + '</dd><dt>보유 기간</dt><dd>' + content.retention + '</dd></dl><p class="auth-common-layer__notice">동의를 거부할 수 있으나, 필수 정보 수집 및 이용에 동의하지 않으면 회원가입이 제한됩니다.</p>';
      consentLayer.classList.add('is-open');
      consentLayer.setAttribute('aria-hidden', 'false');
    };
    var signupEmailNext = signupForm.querySelector('[data-signup-next="email"]');
    var signupVerifyNext = signupForm.querySelector('[data-signup-next="verify"]');
    var signupProfileNext = signupForm.querySelector('[data-signup-next="profile"]');
    var signupSubmit = signupForm.querySelector('[type="submit"]');
    var syncSignupButtonStates = function(){
      signupEmailNext.disabled = !(signupEmail.value.trim() && signupEmailConsent && signupEmailConsent.checked);
      signupVerifyNext.disabled = !signupCode.value.trim();
      if(signupProfileNext){
        signupProfileNext.disabled = !(signupAffiliation.value && signupGender.value && signupAgeGroup.value && signupPrivacyConsent.checked);
      }
      signupSubmit.disabled = !(signupPassword.value && signupPasswordConfirm.value);
    };
    syncSignupButtonStates();
    signupEmail.addEventListener('input', syncSignupButtonStates);
    signupCode.addEventListener('input', syncSignupButtonStates);
    signupPassword.addEventListener('input', syncSignupButtonStates);
    signupPasswordConfirm.addEventListener('input', syncSignupButtonStates);
    [signupEmailConsent, signupAffiliation, signupGender, signupAgeGroup, signupPrivacyConsent].filter(Boolean).forEach(function(control){
      control.addEventListener('change', syncSignupButtonStates);
    });
    document.querySelectorAll('[data-open-consent]').forEach(function(control){
      control.addEventListener('click', function(){ showConsentLayer(control.dataset.openConsent); });
    });
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
      syncSignupButtonStates();
    };
    signupBack.addEventListener('click', function(){
      if(signupStep === 1){
        window.location.href = 'login.html';
        return;
      }
      changeSignupStep(signupStep - 1);
    });
    signupEmailNext.addEventListener('click', function(){
      var email = signupEmail.value.trim();
      var isAllowed = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !/^test/i.test(email) && !/@(gmail|naver|daum)\./i.test(email);
      signupEmailError.hidden = isAllowed;
      if(!isAllowed){
        signupEmail.focus();
        return;
      }
      if(signupEmailConsent && !signupEmailConsent.checked){
        document.getElementById('signupEmailConsentError').hidden = false;
        signupEmailConsent.focus();
        return;
      }
      var emailConsentError = document.getElementById('signupEmailConsentError');
      if(emailConsentError) emailConsentError.hidden = true;
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
    signupVerifyNext.addEventListener('click', function(){
      var isValidCode = /^\d{6}$/.test(signupCode.value.trim());
      signupCodeError.hidden = isValidCode;
      if(!isValidCode){
        signupCode.focus();
        return;
      }
      changeSignupStep(3);
      if(signupProfileNext) signupAffiliation.focus();
      else signupPassword.focus();
    });
    if(signupProfileNext){
      signupProfileNext.addEventListener('click', function(){
        var isProfileComplete = signupAffiliation.value && signupGender.value && signupAgeGroup.value && signupPrivacyConsent.checked;
        signupProfileError.hidden = Boolean(isProfileComplete);
        if(!isProfileComplete){
          var firstEmpty = !signupAffiliation.value ? signupAffiliation : (!signupGender.value ? signupGender : (!signupAgeGroup.value ? signupAgeGroup : signupPrivacyConsent));
          firstEmpty.focus();
          return;
        }
        changeSignupStep(4);
        signupPassword.focus();
      });
    }
    document.querySelectorAll('[data-open-layer], [data-close-layer]').forEach(function(control){
      control.addEventListener('click', function(){
        var layerName = control.dataset.openLayer;
        var layer = layerName ? document.querySelector('[data-layer="' + layerName + '"]') : control.closest('.auth-common-layer');
        if(!layer) return;
        var isOpening = Boolean(layerName);
        layer.classList.toggle('is-open', isOpening);
        layer.setAttribute('aria-hidden', String(!isOpening));
      });
    });
    signupForm.addEventListener('submit', function(e){
      e.preventDefault();
      var hasValidLength = signupPassword.value.length >= 8;
      var isMatching = hasValidLength && signupPassword.value === signupPasswordConfirm.value;
      signupPasswordLengthError.hidden = hasValidLength;
      signupPasswordError.hidden = isMatching;
      if(!hasValidLength){
        signupPassword.focus();
        return;
      }
      if(!isMatching){
        signupPasswordConfirm.focus();
        return;
      }
      /* 가입 완료 → 식단 홈으로 이동.
         로그인과 같은 퍼블리싱 확인용 흐름이다. 실제 개발에서는 가입 API 성공 후
         자동 로그인 세션까지 생성한 뒤 이동한다. 가입 후 다시 로그인을 받는 정책이라면
         이 이동 대상을 login.html로 바꾼다. */
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
    var resetEmailNext = passwordResetForm.querySelector('[data-password-reset-next="email"]');
    var resetVerifyNext = passwordResetForm.querySelector('[data-password-reset-next="verify"]');
    var resetSubmit = passwordResetForm.querySelector('[type="submit"]');
    var syncResetButtonStates = function(){
      resetEmailNext.disabled = !resetEmail.value.trim();
      resetVerifyNext.disabled = !resetCode.value.trim();
      resetSubmit.disabled = !(resetPassword.value && resetPasswordConfirm.value);
    };
    syncResetButtonStates();
    resetEmail.addEventListener('input', syncResetButtonStates);
    resetCode.addEventListener('input', syncResetButtonStates);
    resetPassword.addEventListener('input', syncResetButtonStates);
    resetPasswordConfirm.addEventListener('input', syncResetButtonStates);
    var resetStep = 1;
    var changeResetStep = function(step){
      resetStep = step;
      passwordResetForm.querySelectorAll('[data-password-reset-step]').forEach(function(panel){
        panel.hidden = Number(panel.dataset.passwordResetStep) !== step;
      });
      passwordResetForm.querySelectorAll('[data-password-reset-progress]').forEach(function(marker){
        marker.classList.toggle('is-active', Number(marker.dataset.passwordResetProgress) <= step);
      });
      syncResetButtonStates();
    };
    resetEmailNext.addEventListener('click', function(){
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
    resetVerifyNext.addEventListener('click', function(){
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
      /* 재설정 완료 → 로그인 화면으로 이동. 여기서는 새 비밀번호로 다시 로그인을 받는다. */
      window.location.href = 'login.html';
    });
  }

});
