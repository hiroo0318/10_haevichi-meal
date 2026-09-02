document.addEventListener('DOMContentLoaded', () => {
  const toast = document.querySelector('.toast');
  let timer;
  const showToast = (message) => {
    if (!toast) return;
    toast.querySelector('span').textContent = message;
    toast.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove('show'), 2600);
  };

  // 전역 조회 범위 전환 — 기업 선택 > 사업장 선택 순으로 캐스케이딩(해비치/시스템 등급 데모: 기업도 전환 가능).
  const SCOPE_DATA = {
    '현대캐피탈': ['본사', '여의도', '홍대'],
  };
  const scopeTrigger = document.getElementById('scopeTrigger');
  const scopeModal = document.getElementById('scopeModal');
  const scopeLabel = document.getElementById('scopeLabel');
  const scopeCompany = document.getElementById('scopeCompany');
  const scopeSiteList = document.getElementById('scopeSiteList');
  const scopeConfirm = document.getElementById('scopeConfirm');
  if (scopeTrigger && scopeModal && scopeLabel && scopeCompany && scopeSiteList) {
    const renderSites = (company, selectedSite) => {
      const sites = SCOPE_DATA[company] || [];
      scopeSiteList.innerHTML = sites.map((site) => {
        const checked = site === selectedSite ? ' checked' : '';
        return '<label class="scope-option"><input type="radio" name="scopeSite" value="' + site + '"' + checked + '><span>' + site + '</span></label>';
      }).join('');
      if (!scopeSiteList.querySelector('input:checked') && sites.length) {
        scopeSiteList.querySelector('input').checked = true;
      }
    };
    const syncFromLabel = () => {
      const [company, site] = scopeLabel.textContent.split('·').map((s) => s.trim());
      scopeCompany.value = SCOPE_DATA[company] ? company : Object.keys(SCOPE_DATA)[0];
      renderSites(scopeCompany.value, site);
    };
    const openScopeModal = () => {
      syncFromLabel();
      scopeModal.classList.add('show');
      scopeModal.setAttribute('aria-hidden', 'false');
    };
    const closeScopeModal = () => {
      scopeModal.classList.remove('show');
      scopeModal.setAttribute('aria-hidden', 'true');
    };
    scopeTrigger.addEventListener('click', openScopeModal);
    scopeCompany.addEventListener('change', () => renderSites(scopeCompany.value));
    scopeModal.querySelectorAll('[data-scope-close]').forEach((el) => el.addEventListener('click', closeScopeModal));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeScopeModal();
    });
    if (scopeConfirm) {
      scopeConfirm.addEventListener('click', () => {
        const picked = scopeSiteList.querySelector('input[name="scopeSite"]:checked');
        const company = scopeCompany.value;
        if (picked) scopeLabel.textContent = company + ' · ' + picked.value;
        closeScopeModal();
        if (picked) showToast(company + ' · ' + picked.value + '(으)로 조회 범위가 변경되었습니다.');
      });
    }
  }
  document.querySelectorAll('[data-demo]').forEach((button) => {
    button.addEventListener('click', (event) => {
      if (button.tagName === 'A') event.preventDefault();
      toast.querySelector('span').textContent = button.dataset.demo;
      toast.classList.add('show');
      clearTimeout(timer);
      timer = setTimeout(() => toast.classList.remove('show'), 2600);
    });
  });
  document.querySelectorAll('[data-toggle-target]').forEach((select) => {
    const target = document.querySelector(select.dataset.toggleTarget);
    if (!target) return;
    const sync = () => {
      target.hidden = select.value !== 'custom';
    };
    select.addEventListener('change', sync);
    sync();
  });
  document.querySelectorAll('[data-toggle-checkbox]').forEach((checkbox) => {
    const target = document.querySelector(checkbox.dataset.toggleCheckbox);
    if (!target) return;
    const sync = () => { target.hidden = !checkbox.checked; };
    checkbox.addEventListener('change', sync);
    sync();
  });
  document.querySelectorAll('[data-file-input]').forEach((input) => {
    input.addEventListener('change', () => {
      const name = input.files[0] ? input.files[0].name : '선택된 파일 없음';
      document.querySelector(input.dataset.fileInput).textContent = name;
    });
  });
  // 목록 페이지네이션 + (선택) 빠른 필터 칩을 함께 다루는 공용 컨트롤러.
  // 필터가 켜져 있으면 페이지 구분 없이 조건에 맞는 행만 전부 보여주고, 꺼져 있으면 현재 페이지 행만 보여준다.
  function initPagedTable({ tableSelector, paginationSelector, filterChipSelector, filterPredicate }) {
    const table = document.querySelector(tableSelector);
    if (!table) return null;
    const pagination = paginationSelector ? document.querySelector(paginationSelector) : null;
    const filterChip = filterChipSelector ? document.querySelector(filterChipSelector) : null;
    let currentPage = 1;

    const getRows = () => [...table.querySelectorAll('tbody > tr[data-page]')];
    const getPages = () => [...new Set(getRows().map((r) => Number(r.dataset.page)))].sort((a, b) => a - b);
    const isFilterActive = () => !!filterChip && filterChip.getAttribute('aria-pressed') === 'true';

    function renderPagination(pages) {
      if (!pagination) return;
      pagination.innerHTML = '';
      if (isFilterActive() || pages.length <= 1) {
        pagination.hidden = true;
        return;
      }
      pagination.hidden = false;
      const mkBtn = (label, page, opts = {}) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'page-btn' + (opts.active ? ' active' : '');
        b.textContent = label;
        if (opts.disabled) b.disabled = true;
        b.addEventListener('click', () => { currentPage = page; render(); });
        return b;
      };
      const idx = pages.indexOf(currentPage);
      pagination.appendChild(mkBtn('이전', pages[Math.max(0, idx - 1)], { disabled: idx <= 0 }));
      pages.forEach((p) => pagination.appendChild(mkBtn(String(p), p, { active: p === currentPage })));
      pagination.appendChild(mkBtn('다음', pages[Math.min(pages.length - 1, idx + 1)], { disabled: idx >= pages.length - 1 }));
    }

    function render() {
      const pages = getPages();
      if (!pages.includes(currentPage)) currentPage = pages[0] || 1;
      const active = isFilterActive();
      getRows().forEach((row) => {
        const show = active ? (filterPredicate ? filterPredicate(row) : true) : Number(row.dataset.page) === currentPage;
        row.style.display = show ? '' : 'none';
      });
      renderPagination(pages);
    }

    if (filterChip) {
      filterChip.addEventListener('click', () => {
        const next = filterChip.getAttribute('aria-pressed') !== 'true';
        filterChip.setAttribute('aria-pressed', next ? 'true' : 'false');
        render();
      });
    }
    render();
    return { render };
  }

  const menuPager = initPagedTable({
    tableSelector: '.nutri-table',
    paginationSelector: '#menuPagination',
    filterChipSelector: '#filter-missing-photo',
    filterPredicate: (row) => row.dataset.photo === 'missing',
  });
  initPagedTable({ tableSelector: '.rating-table', paginationSelector: '#ratingPagination' });
  const vocPager = initPagedTable({
    tableSelector: '.voc-table',
    paginationSelector: '#vocPagination',
    filterChipSelector: '#filter-waiting-voc',
    filterPredicate: (row) => row.dataset.status === '답변대기',
  });
  window.vocPager = vocPager; // voc.js(별도 스크립트)에서 답변 등록 후 목록을 다시 그릴 때 사용
  window.noticePager = initPagedTable({ tableSelector: '.notice-table', paginationSelector: '#noticePagination' });

  const photoFilter = document.getElementById('filter-missing-photo');
  const updateMissingPhotoCount = () => {
    const count = document.querySelectorAll('tr[data-photo="missing"]:not(.nutri-row)').length;
    const badge = photoFilter ? photoFilter.querySelector('b') : null;
    if (badge) badge.textContent = count + '건';
    if (photoFilter && count === 0) {
      photoFilter.setAttribute('aria-pressed', 'false');
    }
    if (menuPager) menuPager.render();
  };

  const lightbox = document.getElementById('photoLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxReplaceInput = document.getElementById('lightboxReplaceInput');
  let currentThumb = null;
  const openLightbox = (src, name, thumb) => {
    if (!lightbox) return;
    currentThumb = thumb || null;
    lightboxImg.src = src;
    lightboxImg.alt = name;
    lightboxCaption.textContent = name;
    lightbox.classList.add('show');
    lightbox.setAttribute('aria-hidden', 'false');
  };
  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('show');
    lightbox.setAttribute('aria-hidden', 'true');
    currentThumb = null;
  };
  if (lightbox) {
    // 위임 방식으로 바인딩 — 이미지 등록으로 새로 생기는 썸네일도 별도 처리 없이 동작한다.
    document.addEventListener('click', (event) => {
      const thumb = event.target.closest('[data-preview-src]');
      if (thumb) openLightbox(thumb.dataset.previewSrc, thumb.dataset.previewName, thumb);
    });
    lightbox.querySelectorAll('[data-lightbox-close]').forEach((el) => {
      el.addEventListener('click', closeLightbox);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeLightbox();
    });
  }
  if (lightboxReplaceInput) {
    lightboxReplaceInput.addEventListener('click', (event) => {
      event.stopPropagation();
    });
    lightboxReplaceInput.addEventListener('change', () => {
      const file = lightboxReplaceInput.files[0];
      if (!file || !currentThumb) return;
      const url = URL.createObjectURL(file);
      currentThumb.dataset.previewSrc = url;
      const img = currentThumb.querySelector('img');
      if (img) img.src = url;
      lightboxImg.src = url;
      lightboxReplaceInput.value = '';
      if (toast) {
        toast.querySelector('span').textContent = currentThumb.dataset.previewName + ' 이미지가 교체되었습니다.';
        toast.classList.add('show');
        clearTimeout(timer);
        timer = setTimeout(() => toast.classList.remove('show'), 2600);
      }
    });
  }

  // 이미지 등록 버튼 — 파일을 고르면 실제 선택한 이미지를 썸네일로 바꾸고, 미등록 상태를 해제한다.
  document.addEventListener('change', (event) => {
    const input = event.target;
    if (!(input.matches && input.matches('[data-register-photo] input[type="file"]'))) return;
    const file = input.files[0];
    if (!file) return;

    const cell = input.closest('td');
    const row = input.closest('tr');
    const nutriRow = row && row.nextElementSibling && row.nextElementSibling.classList.contains('nutri-row')
      ? row.nextElementSibling
      : null;
    const menuName = row.querySelector('td:nth-child(4)');
    const name = menuName ? menuName.textContent.trim() : '메뉴 사진';
    const url = URL.createObjectURL(file);

    cell.innerHTML = '';
    const thumb = document.createElement('button');
    thumb.type = 'button';
    thumb.className = 'photo-thumb';
    thumb.dataset.previewSrc = url;
    thumb.dataset.previewName = name;
    const img = document.createElement('img');
    img.src = url;
    img.alt = name + ' 사진';
    thumb.appendChild(img);
    cell.appendChild(thumb);

    row.dataset.photo = 'ok';
    row.classList.remove('row-highlight');
    if (nutriRow) {
      nutriRow.dataset.photo = 'ok';
      nutriRow.classList.remove('row-highlight');
    }

    updateMissingPhotoCount();
    if (toast) {
      toast.querySelector('span').textContent = name + ' 이미지가 등록되었습니다.';
      toast.classList.add('show');
      clearTimeout(timer);
      timer = setTimeout(() => toast.classList.remove('show'), 2600);
    }
  });
});
