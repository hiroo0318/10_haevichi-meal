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
  /* 회원가입 시트는 단계 전체에서 같은 높이를 사용한다.
     로그인 높이에서 보간하면 전환 중 form 내부 스크롤바가 잠시 생기므로 높이를 애니메이션하지 않는다. */
  var animateV3SheetHeight = function(sheet){
    if(!sheet) return;
    sheet.style.height = '';
    sheet.style.minHeight = '';
  };
  var v3ToastTimer;
  var v3ToastHideTimer;
  var showV3Toast = function(message){
    if(document.body.dataset.authVersion !== 'v3') return;
    var toast = document.getElementById('authV3Toast');
    if(!toast){
      toast = document.createElement('p');
      toast.id = 'authV3Toast';
      toast.className = 'auth-v3-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    window.clearTimeout(v3ToastTimer);
    window.clearTimeout(v3ToastHideTimer);
    toast.textContent = message;
    toast.hidden = false;
    window.requestAnimationFrame(function(){ toast.classList.add('is-open'); });
    v3ToastTimer = window.setTimeout(function(){
      toast.classList.remove('is-open');
      v3ToastHideTimer = window.setTimeout(function(){ toast.hidden = true; }, 220);
    }, 2600);
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
      if(document.body.dataset.authVersion === 'v3' && !/^\S+@\S+\.\S+$/.test(loginEmail.value.trim())){
        showV3Toast('이메일 주소 형식을 확인해주세요.');
        loginEmail.focus();
        return;
      }
      var pw = document.getElementById('pw').value;
      var err = document.getElementById('loginErr');
      if(pw === '0000'){
        if(document.body.dataset.authVersion === 'v3') showV3Toast('이메일 또는 비밀번호를 확인해주세요.');
        else err.hidden = false;
        return;
      }
      err.hidden = true;
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
    var signupPosition = document.getElementById('signupPosition');
    var signupPrivacyConsent = document.getElementById('signupPrivacyConsent');
    var signupProfileError = document.getElementById('signupProfileError');
    var signupEmailConsent = document.getElementById('signupEmailConsent');
    var v3ConsentLayer = document.getElementById('privacyConsentLayer');
    var v3ConsentContent = {
      email: { title: '개인정보 수집 및 이용 동의', intro: '회원가입과 사내 메일 인증을 위해 아래 정보를 수집·이용합니다.', items: '사내 이메일 주소', purpose: '로그인 ID 관리, 회원 식별 및 이메일 인증', retention: '회원 탈퇴 시까지. 관계 법령에 따라 보관이 필요한 정보는 해당 기간까지 보관합니다.' },
      profile: { title: '개인정보 수집 및 이용 동의', intro: '회원 정보 관리와 급식 서비스 운영을 위해 아래 정보를 수집·이용합니다.', items: '소속 구분, 직급, 성별, 연령대', purpose: '회원 정보 관리 및 급식 서비스 운영', retention: '회원 탈퇴 시까지. 관계 법령에 따라 보관이 필요한 정보는 해당 기간까지 보관합니다.' }
    };
    var showV3Consent = function(type){
      if(!v3ConsentLayer || !v3ConsentContent[type]) return;
      var content = v3ConsentContent[type];
      v3ConsentLayer.querySelector('#privacyConsentTitle').textContent = content.title;
      v3ConsentLayer.querySelector('.auth-common-layer__body').innerHTML = '<p>' + content.intro + '</p><dl><dt>수집 항목</dt><dd>' + content.items + '</dd><dt>이용 목적</dt><dd>' + content.purpose + '</dd><dt>보유 기간</dt><dd>' + content.retention + '</dd></dl><p class="auth-common-layer__notice">동의를 거부할 수 있으나, 필수 정보 수집 및 이용에 동의하지 않으면 회원가입이 제한됩니다.</p>';
      v3ConsentLayer.classList.add('is-open');
      v3ConsentLayer.setAttribute('aria-hidden', 'false');
    };
    if(signupForm.dataset.signupVersion === 'v3'){
      signupEmailError.insertAdjacentHTML('afterend', '<label class="v3-consent v3-email-consent"><input id="signupEmailConsent" type="checkbox" required><span>개인정보 수집 및 이용에 동의합니다. <b>(필수)</b></span><button type="button" data-open-consent="email">전문 보기</button></label><p class="v3-message is-error" id="signupEmailConsentError" hidden>개인정보 수집 및 이용 동의가 필요합니다.</p>');
      signupEmailConsent = document.getElementById('signupEmailConsent');
      signupGender.required = true;
      signupGender.options[0].text = '선택해주세요';
      Array.prototype.slice.call(signupGender.options).forEach(function(option){ if(option.text === '응답하지 않음') option.remove(); });
      var signupGenderOptional = signupGender.closest('.v3-field').querySelector('em');
      if(signupGenderOptional) signupGenderOptional.remove();
      signupForm.querySelector('[data-signup-step="3"] .v3-description').textContent = '서비스 제공을 위해 필요한 정보예요.';
      signupProfileError.textContent = '소속 구분, 성별, 연령대, 직급과 개인정보 수집 및 이용 동의는 필수입니다.';
      var profileConsentLabel = signupPrivacyConsent.closest('.v3-consent');
      profileConsentLabel.querySelector('span').innerHTML = '개인정보 수집 및 이용에 동의합니다. <b>(필수)</b>';
      profileConsentLabel.querySelector('button').setAttribute('data-open-consent', 'profile');
      profileConsentLabel.querySelector('button').removeAttribute('data-open-layer');
    }
    document.querySelectorAll('[data-open-consent]').forEach(function(control){
      control.addEventListener('click', function(){ showV3Consent(control.dataset.openConsent); });
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
      if(!isAllowed){
        if(signupForm.dataset.signupVersion === 'v3') showV3Toast('허용되지 않은 메일 도메인입니다.');
        signupEmail.focus();
        return;
      }
      if(signupEmailConsent && !signupEmailConsent.checked){
        document.getElementById('signupEmailConsentError').hidden = false;
        if(signupForm.dataset.signupVersion === 'v3') showV3Toast('개인정보 수집 및 이용 동의가 필요합니다.');
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
    signupForm.querySelector('[data-signup-next="verify"]').addEventListener('click', function(){
      var isValidCode = /^\d{6}$/.test(signupCode.value.trim());
      signupCodeError.hidden = isValidCode;
      if(!isValidCode){
        if(signupForm.dataset.signupVersion === 'v3') showV3Toast('인증번호를 다시 확인해주세요.');
        signupCode.focus();
        return;
      }
      changeSignupStep(3);
      if(signupProfileNext) signupAffiliation.focus();
      else if(signupForm.dataset.signupVersion !== 'v3') signupPassword.focus();
    });
    var signupProfileNext = signupForm.querySelector('[data-signup-next="profile"]');
    if(signupProfileNext){
      signupProfileNext.addEventListener('click', function(){
        var isProfileComplete = signupAffiliation.value && signupGender.value && signupAgeGroup.value && signupPosition.value && signupPrivacyConsent.checked;
        signupProfileError.hidden = Boolean(isProfileComplete);
        if(!isProfileComplete){
          if(signupForm.dataset.signupVersion === 'v3') showV3Toast('필수 정보를 모두 입력하고 동의해주세요.');
          var firstEmpty = !signupAffiliation.value ? signupAffiliation : (!signupGender.value ? signupGender : (!signupAgeGroup.value ? signupAgeGroup : (!signupPosition.value ? signupPosition : signupPrivacyConsent)));
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
        if(signupForm.dataset.signupVersion === 'v3') showV3Toast('비밀번호를 8자 이상 입력해주세요.');
        signupPassword.focus();
        return;
      }
      if(!isMatching){
        if(signupForm.dataset.signupVersion === 'v3') showV3Toast('비밀번호가 일치하지 않습니다.');
        signupPasswordConfirm.focus();
        return;
      }
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
