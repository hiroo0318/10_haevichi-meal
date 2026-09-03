document.addEventListener('DOMContentLoaded', () => {
  const homeFrame = document.getElementById('themePreviewFrameHome');
  const vocFrame = document.getElementById('themePreviewFrameVoc');
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
  const saveBtn = document.getElementById('themeSaveBtn');
  const isValidHex = (value) => /^#[0-9a-f]{6}$/i.test(value);

  // 미리보기는 Front 실제 화면(PUBLISH/Front/home.html, voc.html)을 그대로 축약해 iframe으로 띄우고,
  // --brand-primary 하나만 실시간으로 덮어써서 실제 톤앤매너 반영 여부를 확인한다.
  const previewHead = (color) => `
<link rel="stylesheet" href="../Front/resources/css/reset.css">
<link rel="stylesheet" href="../Front/resources/css/style.css">
<style>#previewPage{--brand-primary:${color};--brand-primary-light:color-mix(in srgb, var(--brand-primary), white 22%);--brand-primary-bg:color-mix(in srgb, var(--brand-primary), white 90%);height:100%}body{margin:0}</style>`;

  const tabbar = (active) => `
  <nav class="tabbar">
    <a class="${active === 'home' ? 'active' : ''}"><span class="icon" style="--icon:url(../Front/resources/images/icon/ic-home.svg)" aria-hidden="true"></span>홈</a>
    <a class="${active === 'voc' ? 'active' : ''}"><span class="icon" style="--icon:url(../Front/resources/images/icon/ic-voc.svg)" aria-hidden="true"></span>나의 의견</a>
    <a><span class="icon" style="--icon:url(../Front/resources/images/icon/ic-notice.svg)" aria-hidden="true"></span>공지</a>
    <a><span class="icon" style="--icon:url(../Front/resources/images/icon/ic-my.svg)" aria-hidden="true"></span>My</a>
  </nav>`;

  const homeDoc = (color) => `<!doctype html><html lang="ko"><head><meta charset="UTF-8">${previewHead(color)}</head><body>
<div class="page" id="previewPage">
  <header class="topbar"><div class="brand">FX<span>By Haevichi</span></div></header>
  <div class="greeting"><p>오늘 뭐 드실래요?</p></div>
  <div class="notice">
    <span class="notice-link"><span class="notice-dot" aria-hidden="true"></span><span class="notice-text">10월 6일부터 새 급식정보 서비스가 시작됩니다</span></span>
    <button class="notice-close" type="button" aria-hidden="true"><span>×</span></button>
  </div>
  <nav class="week-navigation" aria-label="주간 식단 선택">
    <button type="button" class="week-navigation-button">지난주</button>
    <button type="button" class="week-navigation-button is-active">이번주</button>
    <button type="button" class="week-navigation-button">다음주</button>
  </nav>
  <div class="week-strip">
    <div class="week-group is-active">
      <button type="button" class="week-day"><span class="dow">일</span><span class="dom">30</span></button>
      <button type="button" class="week-day"><span class="dow">월</span><span class="dom">31</span></button>
      <button type="button" class="week-day"><span class="dow">화</span><span class="dom">1</span></button>
      <button type="button" class="week-day is-selected"><span class="dow">수</span><span class="dom">2</span></button>
      <button type="button" class="week-day"><span class="dow">목</span><span class="dom">3</span></button>
      <button type="button" class="week-day"><span class="dow">금</span><span class="dom">4</span></button>
      <button type="button" class="week-day"><span class="dow">토</span><span class="dom">5</span></button>
    </div>
  </div>
  <main class="content">
    <div class="home-body">
      <div class="meal-tabs">
        <button type="button" class="meal-tab">조식</button>
        <button type="button" class="meal-tab is-active">중식</button>
        <button type="button" class="meal-tab">석식</button>
      </div>
      <div class="corner-list corner-list--grid2">
        <div class="corner-card"><div class="corner-cardbody">
          <div class="corner-label">코너 A(한식)</div>
          <div class="corner-name">제육볶음 정식</div>
          <div class="corner-desc">잡곡밥·된장국·계란찜 포함</div>
        </div></div>
        <div class="corner-card"><div class="corner-cardbody">
          <div class="corner-label">코너 B(일품)</div>
          <div class="corner-name">계란볶음밥</div>
          <div class="corner-desc">채소볶음·단무지 포함</div>
        </div></div>
      </div>
    </div>
  </main>
  ${tabbar('home')}
</div>
</body></html>`;

  const vocDoc = (color) => `<!doctype html><html lang="ko"><head><meta charset="UTF-8">${previewHead(color)}</head><body>
<div class="page" id="previewPage">
  <header class="topbar"><div class="brand">FX<span>By Haevichi</span></div></header>
  <main class="content voc-content">
    <div class="voc-body">
      <div class="page-title"><h1>의견을 들려주세요</h1></div>
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
              <button type="button" class="voc-category-chip">기타</button>
            </div>
          </fieldset>
          <div class="voc-field"><label>의견을 들려주세요 <em>필수</em></label><textarea class="voc-textarea" placeholder="불편사항이나 제안을 입력해주세요"></textarea><div class="voc-field-meta"><p class="voc-help">급식 메뉴 또는 서비스 이용에 대한 의견을 남겨주세요.</p><span>0 / 500</span></div></div>
          <div class="voc-field"><label>사진을 함께 보낼까요? <span>선택 · 최대 3장</span></label><div class="voc-upload-list"><label class="voc-upload"><b>＋</b><span>사진 추가</span></label></div></div>
          <div class="voc-submit-wrap"><p>제출 후 내역에서 처리 상태를 확인할 수 있어요.</p><button type="button" class="btn btn-primary">의견 제출하기</button></div>
        </form>
      </section>
    </div>
  </main>
  ${tabbar('voc')}
</div>
</body></html>`;

  const render = () => {
    homeFrame.srcdoc = homeDoc(colorPicker.value);
    vocFrame.srcdoc = vocDoc(colorPicker.value);
  };

  const applyColor = (hex) => {
    [homeFrame, vocFrame].forEach((frame) => {
      const doc = frame.contentDocument;
      const page = doc && doc.getElementById('previewPage');
      if (page) page.style.setProperty('--brand-primary', hex);
    });
  };

  colorPicker.addEventListener('input', () => {
    colorHex.value = colorPicker.value.toUpperCase();
    applyColor(colorPicker.value);
  });
  colorHex.addEventListener('input', () => {
    const value = colorHex.value.trim();
    if (isValidHex(value)) {
      colorPicker.value = value;
      applyColor(value);
    }
  });

  render();

  saveBtn.addEventListener('click', () => {
    if (!isValidHex(colorHex.value.trim())) {
      showToast('색상 값을 확인해주세요. (예: #156AAF)');
      return;
    }
    showToast('로고와 대표 색상이 저장되었습니다. 임직원 화면에 반영됩니다.');
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
