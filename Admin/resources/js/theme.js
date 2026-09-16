document.addEventListener('DOMContentLoaded', () => {
  const homeFrame = document.getElementById('themePreviewFrameHome');
  const vocFrame = document.getElementById('themePreviewFrameVoc');
  const noticeFrame = document.getElementById('themePreviewFrameNotice');
  if (!homeFrame || !vocFrame) return;
  const toast = document.querySelector('.toast');
  let timer;
  const showToast = (message) => {
    if (!toast) return;
    toast.querySelector('span').textContent = message;
    toast.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove('show'), 2600);
  };

  const colorPicker = document.getElementById('themeColorPicker');
  const colorHex = document.getElementById('themeColorHex');
  const onColorManual = document.getElementById('themeOnColorManual');
  const onColorPicker = document.getElementById('themeOnColorPicker');
  const onColorHex = document.getElementById('themeOnColorHex');
  const onColorAutoNote = document.getElementById('themeOnColorAutoNote');
  const saveBtn = document.getElementById('themeSaveBtn');
  const isValidHex = (value) => /^#[0-9a-f]{6}$/i.test(value);

  // ---- 대표색 위 글자색 자동 판정 (Front resources/js/theme-oncolor.js와 동일한 CIE L* 기준) ----
  const ON_LIGHT = '#171A1F';
  const ON_DARK = '#FFFFFF';
  const LSTAR_THRESHOLD = 55;
  const hexToRgb = (hex) => [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)].map((h) => parseInt(h, 16));
  const lstar = (rgb) => {
    const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    const y = 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2]);
    return y > 0.008856 ? 116 * Math.pow(y, 1 / 3) - 16 : 903.3 * y;
  };
  const autoOnColor = (hex) => (isValidHex(hex) && lstar(hexToRgb(hex)) < LSTAR_THRESHOLD ? ON_DARK : ON_LIGHT);

  const currentOnColor = () => (onColorManual.checked ? onColorHex.value : autoOnColor(colorHex.value));

  // 미리보기는 Front 실제 화면(PUBLISH/Front/service-v3)을 그대로 축약해 iframe으로 띄우고,
  // --brand-primary·--brand-on-primary만 실시간으로 덮어써서 실제 톤앤매너 반영 여부를 확인한다.
  const previewHead = (primary, onColor) => `
<link rel="stylesheet" href="../Front/service-v3/resources/css/reset.css">
<link rel="stylesheet" href="../Front/service-v3/resources/css/style.css">
<link rel="stylesheet" href="../Front/service-v3/resources/css/theme-haevichi.css" id="themeLink">
<link rel="stylesheet" href="../Front/service-v3/resources/css/service.css">
<script src="../Front/service-v3/resources/js/theme-oncolor.js"></script>
<style>:root{--brand-primary:${primary};--brand-on-primary:${onColor}}body{margin:0}</style>`;

  const homeDoc = (primary, onColor) => `<!doctype html><html lang="ko"><head><meta charset="UTF-8">${previewHead(primary, onColor)}</head><body>
<div class="page">
  <header class="topbar"><div class="brand"><img class="brand-logo" src="../Front/service-v3/resources/images/brand/haevichi-brand-logo.png" alt="HAEVICHI Food Service"></div></header>
  <div class="greeting"><h1>오늘의 한 끼, 무엇으로 채워볼까요?</h1></div>
  <div class="notice" id="homeNotice">
    <a class="notice-link" aria-label="공지사항 상세: 10월 6일부터 새 급식정보 서비스가 시작됩니다">
      <span class="notice-dot" aria-hidden="true"></span><span class="notice-text">10월 6일부터 새 급식정보 서비스가 시작됩니다</span>
    </a>
    <button class="notice-close" type="button" aria-label="공지 닫기"><span aria-hidden="true">×</span></button>
  </div>
  <nav class="week-navigation" aria-label="주간 식단 선택">
    <button type="button" class="week-navigation-button" data-week-nav="previous">지난주</button>
    <button type="button" class="week-navigation-button is-active" data-week-nav="current">이번주</button>
    <button type="button" class="week-navigation-button" data-week-nav="next">다음주</button>
  </nav>
  <div class="week-strip" id="weekStrip">
    <div class="week-group is-active" data-week="current">
      <button type="button" class="week-day"><span class="dow">일</span><span class="dom">30</span></button><button type="button" class="week-day"><span class="dow">월</span><span class="dom">31</span></button><button type="button" class="week-day"><span class="dow">화</span><span class="dom">1</span></button><button type="button" class="week-day is-selected"><span class="dow">수</span><span class="dom">2</span></button><button type="button" class="week-day"><span class="dow">목</span><span class="dom">3</span></button><button type="button" class="week-day"><span class="dow">금</span><span class="dom">4</span></button><button type="button" class="week-day"><span class="dow">토</span><span class="dom">5</span></button>
    </div>
  </div>
  <main class="content home-content">
    <div class="home-meal-section">
      <div class="meal-tabs">
        <button type="button" class="meal-tab">조식</button>
        <button type="button" class="meal-tab is-active">중식</button>
        <button type="button" class="meal-tab">석식</button>
      </div>
    </div>
    <div class="home-body">
      <div class="corner-list corner-list--grid2">
        <div class="corner-card"><div class="corner-cardbody">
          <div class="corner-label">한식</div>
          <div class="corner-name">제육볶음 정식</div>
          <div class="corner-desc">잡곡밥 · 계란찜 · 시금치나물 · 배추김치 · 된장국</div>
        </div></div>
        <div class="corner-card"><div class="corner-cardbody">
          <div class="corner-label">한식</div>
          <div class="corner-name">비빔밥 코너</div>
          <div class="corner-desc">흰쌀밥 · 나물 5종 · 계란후라이 · 고추장</div>
        </div></div>
      </div>
    </div>
  </main>
  <nav class="tabbar">
    <a class="is-active" aria-current="page"><span class="icon icon-home" aria-hidden="true"></span>홈</a>
    <a><span class="icon icon-voc" aria-hidden="true"></span>나의 의견</a>
    <a><span class="icon icon-notice" aria-hidden="true"></span>공지</a>
    <a><span class="icon icon-my" aria-hidden="true"></span>My</a>
  </nav>
</div>
</body></html>`;

  const vocDoc = (primary, onColor) => `<!doctype html><html lang="ko"><head><meta charset="UTF-8">${previewHead(primary, onColor)}</head><body>
<div class="page">
  <header class="topbar"><div class="brand"><img class="brand-logo" src="../Front/service-v3/resources/images/brand/haevichi-brand-logo.png" alt="HAEVICHI Food Service"></div></header>
  <main class="content voc-content">
    <div class="voc-body">
      <div class="page-title"><h1>식사 경험을 들려주세요.</h1></div>
      <nav class="voc-tabs" aria-label="나의 의견 메뉴">
        <a class="voc-tab is-active" aria-current="page">접수</a>
        <a class="voc-tab">내역</a>
      </nav>
      <section class="voc-panel">
        <form class="voc-form">
          <fieldset class="voc-field voc-category"><legend>어떤 의견인가요?</legend>
            <div class="voc-category-list">
              <button type="button" class="voc-category-chip is-active">맛/메뉴</button>
              <button type="button" class="voc-category-chip">위생</button>
              <button type="button" class="voc-category-chip">서비스</button>
              <button type="button" class="voc-category-chip">시설/환경</button>
              <button type="button" class="voc-category-chip">앱 사용</button>
              <button type="button" class="voc-category-chip">제안</button>
              <button type="button" class="voc-category-chip">기타</button>
            </div>
          </fieldset>
          <div class="voc-field"><label>의견을 들려주세요 <em>필수</em></label><textarea class="voc-textarea" placeholder="불편사항이나 제안을 입력해주세요"></textarea><div class="voc-field-meta"><span>0 / 500</span></div></div>
          <div class="voc-field"><label>사진을 함께 보내볼까요? <span>선택 · 최대 3장</span></label><div class="voc-upload-list"><label class="voc-upload"><b>＋</b><span>사진 추가</span></label></div></div>
          <div class="voc-submit-wrap"><button type="button" class="btn btn-primary">의견 제출하기</button></div>
        </form>
      </section>
    </div>
  </main>
  <nav class="tabbar">
    <a><span class="icon icon-home" aria-hidden="true"></span>홈</a>
    <a class="is-active" aria-current="page"><span class="icon icon-voc" aria-hidden="true"></span>나의 의견</a>
    <a><span class="icon icon-notice" aria-hidden="true"></span>공지</a>
    <a><span class="icon icon-my" aria-hidden="true"></span>My</a>
  </nav>
</div>
</body></html>`;

  const noticeDoc = (primary, onColor) => `<!doctype html><html lang="ko"><head><meta charset="UTF-8">${previewHead(primary, onColor)}</head><body>
<div class="page notice-popup-page">
  <section class="home-notice-popup" role="dialog" aria-modal="true" aria-labelledby="previewNoticePopupTitle">
    <div class="home-notice-popup-card">
      <span class="home-notice-popup-label">전체 공지</span>
      <h1 id="previewNoticePopupTitle">10월 6일부터 새 급식정보 서비스가 시작됩니다</h1>
      <p>
        더욱 편리한 급식정보 서비스를 위해 앱이 새롭게 변경됩니다.<br>
        로그인 후 오늘의 식단과 다양한 소식을 확인해 보세요.
      </p>
      <a class="home-notice-popup-detail">공지 자세히 보기 <span aria-hidden="true">›</span></a>
      <label class="home-notice-popup-today"><input type="checkbox"> <span>오늘 하루 보지 않기</span></label>
      <div class="home-notice-popup-actions">
        <button class="home-notice-popup-confirm" type="button">확인</button>
      </div>
    </div>
  </section>
</div>
</body></html>`;

  const render = () => {
    const primary = colorPicker.value;
    const onColor = currentOnColor();
    homeFrame.srcdoc = homeDoc(primary, onColor);
    vocFrame.srcdoc = vocDoc(primary, onColor);
    if (noticeFrame) noticeFrame.srcdoc = noticeDoc(primary, onColor);
  };

  const applyColors = () => {
    const primary = colorPicker.value;
    const onColor = currentOnColor();
    [homeFrame, vocFrame, noticeFrame].filter(Boolean).forEach((frame) => {
      const doc = frame.contentDocument;
      if (!doc || !doc.documentElement) return;
      doc.documentElement.style.setProperty('--brand-primary', primary);
      doc.documentElement.style.setProperty('--brand-on-primary', onColor);
    });
  };

  const syncOnColorNote = () => {
    onColorAutoNote.textContent = onColorManual.checked
      ? '직접 지정한 글자색을 사용합니다.'
      : `지정하지 않으면 대표 색상의 밝기에 따라 자동으로 선택됩니다. (현재 자동 판정값: ${autoOnColor(colorHex.value)})`;
  };

  colorPicker.addEventListener('input', () => {
    colorHex.value = colorPicker.value.toUpperCase();
    syncOnColorNote();
    applyColors();
  });
  colorHex.addEventListener('input', () => {
    const value = colorHex.value.trim();
    if (isValidHex(value)) {
      colorPicker.value = value;
      syncOnColorNote();
      applyColors();
    }
  });

  onColorManual.addEventListener('change', () => {
    const manual = onColorManual.checked;
    onColorPicker.disabled = !manual;
    onColorHex.disabled = !manual;
    if (manual) {
      // 직접 지정으로 전환하는 순간엔 지금 적용 중인(자동 판정) 값을 시작값으로 채워준다.
      const start = autoOnColor(colorHex.value);
      onColorPicker.value = start;
      onColorHex.value = start.toUpperCase();
    }
    syncOnColorNote();
    applyColors();
  });
  onColorPicker.addEventListener('input', () => {
    onColorHex.value = onColorPicker.value.toUpperCase();
    applyColors();
  });
  onColorHex.addEventListener('input', () => {
    const value = onColorHex.value.trim();
    if (isValidHex(value)) {
      onColorPicker.value = value;
      applyColors();
    }
  });

  syncOnColorNote();
  render();

  saveBtn.addEventListener('click', () => {
    if (!isValidHex(colorHex.value.trim())) {
      showToast('대표 색상 값을 확인해주세요. (예: #70747A)');
      return;
    }
    if (onColorManual.checked && !isValidHex(onColorHex.value.trim())) {
      showToast('대표색 위 글자색 값을 확인해주세요. (예: #FFFFFF)');
      return;
    }
    showToast('로고·대표 색상·글자색이 저장되었습니다. 임직원 화면에 반영됩니다.');
  });

  // 로고 업로드 미리보기
  const logoInput = document.getElementById('themeLogoInput');
  const logoThumb = document.getElementById('themeLogoThumb');
  const logoName = document.getElementById('themeLogoName');
  if (logoInput) {
    logoInput.addEventListener('change', () => {
      const file = logoInput.files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      logoThumb.innerHTML = `<img src="${url}" alt="등록된 로고">`;
      logoName.textContent = file.name;
      showToast('로고 이미지가 등록되었습니다.');
    });
  }
});
