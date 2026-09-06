document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('mv2MealSections');
  if (!root) return;

  const toast = document.querySelector('.toast');
  let timer;
  const showToast = (message) => {
    if (!toast) return;
    toast.querySelector('span').textContent = message;
    toast.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove('show'), 2600);
  };

  const MAX_ITEMS = 5;
  const MEALS = ['조식', '중식', '석식'];
  // 총열량(kcal)은 메뉴구성 항목들의 칼로리 합계로 자동 계산되며 직접 입력하지 않는다.
  const NUTRI_FIELDS = [
    { key: 'carb', label: '탄수화물', unit: 'g' },
    { key: 'protein', label: '단백질', unit: 'g' },
    { key: 'fat', label: '지방', unit: 'g' },
    { key: 'sodium', label: '나트륨', unit: 'mg' },
  ];
  const sumKcal = (compositions) => compositions.reduce((sum, c) => sum + (Number(c.kcal) || 0), 0);

  // ---- 데모 데이터 ---------------------------------------------------------
  // 메뉴구성은 {name, kcal} 개별 항목 배열로, 영양성분은 고정 항목의 숫자값 객체로 관리한다.
  // (프론트 화면에서 항목별로 다시 조합해 쓸 수 있도록 구조화한 값 — 자유 텍스트 아님)
  const DATA = {
    '2026-09-07': {
      조식: [
        { name: '된장국 정식', composition: [{ name: '잡곡밥', kcal: 300 }, { name: '된장국', kcal: 120 }, { name: '계란말이', kcal: 150 }, { name: '시금치나물', kcal: 40 }], nutrition: { carb: 180, protein: 70, fat: 40, sodium: 1050, kcal: 540 }, origin: '된장(국내산)', allergy: '대두', image: 'resources/images/menu/doenjangguk-photo.png', exposed: true },
        { name: '계란볶음밥', composition: [{ name: '계란볶음밥', kcal: 380 }, { name: '채소볶음', kcal: 60 }], nutrition: { carb: 130, protein: 45, fat: 55, sodium: 780, kcal: 470 }, origin: '-', allergy: '계란', image: null, exposed: false },
      ],
      중식: [
        { name: '제육볶음 정식', composition: [{ name: '잡곡밥', kcal: 300 }, { name: '제육볶음', kcal: 280 }, { name: '계란찜', kcal: 120 }], nutrition: { carb: 210, protein: 120, fat: 90, sodium: 1480, kcal: 890 }, origin: '돼지고기(국내산)', allergy: '대두 · 돼지고기', image: 'resources/images/menu/jeyuk-bokkeum-photo.png', exposed: true },
      ],
      석식: [
        { name: '순두부찌개 정식', composition: [{ name: '흰쌀밥', kcal: 300 }, { name: '순두부찌개', kcal: 210 }], nutrition: { carb: 185, protein: 95, fat: 80, sodium: 1390, kcal: 710 }, origin: '대두(국내산)', allergy: '대두', image: null, exposed: false },
      ],
    },
    '2026-09-08': {
      조식: [
        { name: '된장국 정식', composition: [{ name: '잡곡밥', kcal: 300 }, { name: '된장국', kcal: 120 }], nutrition: { carb: 180, protein: 70, fat: 40, sodium: 1050, kcal: 540 }, origin: '된장(국내산)', allergy: '대두', image: 'resources/images/menu/doenjangguk-photo.png', exposed: true },
      ],
      중식: [],
      석식: [
        { name: '순두부찌개 정식', composition: [{ name: '흰쌀밥', kcal: 300 }, { name: '순두부찌개', kcal: 210 }], nutrition: { carb: 185, protein: 95, fat: 80, sodium: 1390, kcal: 710 }, origin: '대두(국내산)', allergy: '대두', image: 'resources/images/menu/doenjangguk-photo.png', exposed: false },
      ],
    },
    '2026-09-09': {
      조식: [
        { name: '된장국 정식', composition: [{ name: '잡곡밥', kcal: 300 }, { name: '된장국', kcal: 120 }], nutrition: { carb: 180, protein: 70, fat: 40, sodium: 1050, kcal: 540 }, origin: '된장(국내산)', allergy: '대두', image: 'resources/images/menu/doenjangguk-photo.png', exposed: true },
        { name: '계란볶음밥', composition: [{ name: '계란볶음밥', kcal: 380 }], nutrition: { carb: 130, protein: 45, fat: 55, sodium: 780, kcal: 470 }, origin: '-', allergy: '계란', image: 'resources/images/menu/doenjangguk-photo.png', exposed: true },
        { name: '북엇국 정식', composition: [{ name: '잡곡밥', kcal: 300 }, { name: '북엇국', kcal: 110 }], nutrition: { carb: 170, protein: 65, fat: 35, sodium: 980, kcal: 500 }, origin: '황태(국내산)', allergy: '대두', image: 'resources/images/menu/doenjangguk-photo.png', exposed: true },
        { name: '누룽지백숙', composition: [{ name: '누룽지백숙', kcal: 450 }], nutrition: { carb: 90, protein: 80, fat: 30, sodium: 900, kcal: 450 }, origin: '닭고기(국내산)', allergy: '-', image: 'resources/images/menu/doenjangguk-photo.png', exposed: true },
        { name: '토스트 세트', composition: [{ name: '토스트', kcal: 320 }, { name: '우유', kcal: 120 }], nutrition: { carb: 120, protein: 30, fat: 60, sodium: 620, kcal: 440 }, origin: '-', allergy: '우유·밀', image: 'resources/images/menu/doenjangguk-photo.png', exposed: true },
      ],
      중식: [
        { name: '제육볶음 정식', composition: [{ name: '잡곡밥', kcal: 300 }, { name: '제육볶음', kcal: 280 }], nutrition: { carb: 210, protein: 120, fat: 90, sodium: 1480, kcal: 890 }, origin: '돼지고기(국내산)', allergy: '대두 · 돼지고기', image: 'resources/images/menu/jeyuk-bokkeum-photo.png', exposed: true },
      ],
      석식: [
        { name: '순두부찌개 정식', composition: [{ name: '흰쌀밥', kcal: 300 }, { name: '순두부찌개', kcal: 210 }], nutrition: { carb: 185, protein: 95, fat: 80, sodium: 1390, kcal: 710 }, origin: '대두(국내산)', allergy: '대두', image: 'resources/images/menu/doenjangguk-photo.png', exposed: true },
      ],
    },
  };

  const emptyDay = () => ({ 조식: [], 중식: [], 석식: [] });
  const dataFor = (dateStr) => DATA[dateStr] || (DATA[dateStr] = emptyDay());

  // ---- 날짜 유틸 -----------------------------------------------------------
  const toKey = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const dow = ['일', '월', '화', '수', '목', '금', '토'];

  let calYear = 2026, calMonth = 8;
  let selectedWeekSunday = new Date(2026, 8, 6);
  let selectedDate = '2026-09-09';

  const mealStatus = (items) => {
    if (!items || items.length === 0) return 'empty';
    const allDone = items.every((i) => i.image && i.exposed);
    return allDone ? 'ok' : 'warn';
  };

  // ---- 폼 상태 (추가/수정 공용, 화면 전체에서 하나만 열림) ------------------------
  // { meal, mode:'add'|'edit', idx, name, compositions:[{name,kcal}], nutrition:{...}, origin, allergy, image, exposed }
  let form = null;

  const blankForm = (meal, mode, idx, item) => ({
    meal,
    mode,
    idx,
    name: item ? item.name : '',
    compositions: item ? item.composition.map((c) => ({ ...c })) : [{ name: '', kcal: '' }],
    nutrition: item ? { ...item.nutrition } : { carb: '', protein: '', fat: '', sodium: '', kcal: '' },
    origin: item ? item.origin : '',
    allergy: item ? item.allergy : '',
    image: item ? item.image : null,
    exposed: item ? item.exposed : false,
  });

  // ---- 캘린더 렌더 ---------------------------------------------------------
  const calendarTitle = document.getElementById('mv2CalendarTitle');
  const calendarBody = document.getElementById('mv2CalendarBody');

  function renderCalendar() {
    calendarTitle.textContent = `${calYear}년 ${calMonth + 1}월`;
    const firstOfMonth = new Date(calYear, calMonth, 1);
    const gridStart = new Date(calYear, calMonth, 1 - firstOfMonth.getDay());
    calendarBody.innerHTML = '';
    for (let w = 0; w < 6; w += 1) {
      const weekStart = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + w * 7);
      const tr = document.createElement('tr');
      tr.className = 'mv2-cal-week';
      if (weekStart.getTime() === selectedWeekSunday.getTime()) tr.classList.add('is-selected');
      for (let d = 0; d < 7; d += 1) {
        const day = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + d);
        const td = document.createElement('td');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'mv2-cal-day' + (day.getMonth() !== calMonth ? ' is-muted' : '');
        btn.textContent = String(day.getDate());
        btn.addEventListener('click', () => {
          selectedWeekSunday = new Date(day.getFullYear(), day.getMonth(), day.getDate() - day.getDay());
          if (day.getMonth() !== calMonth) {
            calYear = day.getFullYear();
            calMonth = day.getMonth();
          }
          renderCalendar();
          renderWeekStrip();
        });
        td.appendChild(btn);
        tr.appendChild(td);
      }
      calendarBody.appendChild(tr);
    }
  }

  document.getElementById('mv2CalPrev').addEventListener('click', () => {
    calMonth -= 1;
    if (calMonth < 0) { calMonth = 11; calYear -= 1; }
    renderCalendar();
  });
  document.getElementById('mv2CalNext').addEventListener('click', () => {
    calMonth += 1;
    if (calMonth > 11) { calMonth = 0; calYear += 1; }
    renderCalendar();
  });

  // ---- 주차 스트립 렌더 -----------------------------------------------------
  const weekStrip = document.getElementById('mv2WeekStrip');

  function renderWeekStrip() {
    weekStrip.innerHTML = '';
    for (let d = 0; d < 7; d += 1) {
      const day = new Date(selectedWeekSunday.getFullYear(), selectedWeekSunday.getMonth(), selectedWeekSunday.getDate() + d);
      const key = toKey(day.getFullYear(), day.getMonth(), day.getDate());
      const data = DATA[key] || emptyDay();
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'mv2-day-cell' + (key === selectedDate ? ' is-selected' : '');
      cell.innerHTML = `
        <span>${dow[day.getDay()]}</span>
        <strong>${day.getDate()}</strong>
        <span class="mv2-cal-dots">
          <span class="mv2-dot mv2-dot-${mealStatus(data.조식)}" title="조식"></span>
          <span class="mv2-dot mv2-dot-${mealStatus(data.중식)}" title="중식"></span>
          <span class="mv2-dot mv2-dot-${mealStatus(data.석식)}" title="석식"></span>
        </span>
      `;
      cell.addEventListener('click', () => {
        selectedDate = key;
        form = null;
        renderWeekStrip();
        renderDayPanel();
      });
      weekStrip.appendChild(cell);
    }
  }

  // ---- 하단 일자별 관리 영역 렌더 --------------------------------------------
  const dayTitle = document.getElementById('mv2DayTitle');
  const reorderState = { 조식: false, 중식: false, 석식: false };

  function menuItemHTML(meal, item, idx, reordering) {
    const photoCell = item.image
      ? `<button class="photo-thumb" type="button" data-preview-src="${item.image}" data-preview-name="${item.name}"><img src="${item.image}" alt="${item.name} 사진"></button>`
      : `<label class="photo-btn" data-mv2-register-photo data-meal="${meal}" data-idx="${idx}">＋ 이미지 등록<input type="file" accept="image/*" hidden></label>`;
    const compText = item.composition.map((c) => `${c.name} ${c.kcal}kcal`).join(' · ');
    const n = item.nutrition;
    const nutriText = `탄수화물 ${n.carb}g · 단백질 ${n.protein}g · 지방 ${n.fat}g · 나트륨 ${n.sodium}mg · 총 ${n.kcal}kcal`;
    return `
      <div class="mv2-menu-item" draggable="${reordering}" data-meal="${meal}" data-idx="${idx}">
        <span class="mv2-drag-handle" aria-hidden="true">⋮⋮</span>
        <div class="mv2-menu-item-photo">${photoCell}</div>
        <div class="mv2-menu-item-body">
          <span class="mv2-menu-item-name">${item.name}</span>
          <span class="mv2-menu-item-line"><b>메뉴구성</b> ${compText || '-'}</span>
          <span class="mv2-menu-item-line"><b>영양성분</b> ${nutriText}</span>
          <span class="mv2-menu-item-meta"><span>원산지 ${item.origin || '-'}</span><span>알레르기 ${item.allergy || '-'}</span></span>
        </div>
        <div class="mv2-menu-item-actions">
          <label class="switch labeled">
            <input type="checkbox" data-mv2-publish-toggle data-meal="${meal}" data-idx="${idx}" ${item.exposed ? 'checked' : ''} ${item.image ? '' : 'disabled'}>
            <span class="switch-track" aria-hidden="true"></span>
            <span class="switch-track-label on">노출</span>
            <span class="switch-track-label off">임시저장</span>
          </label>
          <button class="link-btn" type="button" data-mv2-edit data-meal="${meal}" data-idx="${idx}">수정</button>
          <button class="link-btn danger" type="button" data-mv2-delete data-meal="${meal}" data-idx="${idx}">삭제</button>
        </div>
      </div>`;
  }

  function formHTML() {
    const f = form;
    const photoPreview = f.image
      ? `<img src="${f.image}" alt="">`
      : '이미지<br>없음';
    return `
      <div class="mv2-menu-form" data-meal="${f.meal}">
        <div class="mv2-form-row">
          <div class="mv2-form-photo">
            <span class="mv2-form-photo-preview" id="mv2FormPhotoPreview">${photoPreview}</span>
            <label class="btn outline" style="cursor:pointer">사진 선택<input type="file" accept="image/*" id="mv2FormPhotoInput" hidden></label>
          </div>
          <div class="mv2-form-field">
            <label for="mv2FormName">메뉴명</label>
            <input class="field" type="text" id="mv2FormName" value="${f.name}" placeholder="메뉴명">
          </div>
          <div class="mv2-form-field">
            <label for="mv2FormOrigin">원산지</label>
            <input class="field" type="text" id="mv2FormOrigin" value="${f.origin}" placeholder="예: 돼지고기(국내산)">
          </div>
          <div class="mv2-form-field">
            <label for="mv2FormAllergy">알레르기</label>
            <input class="field" type="text" id="mv2FormAllergy" value="${f.allergy}" placeholder="예: 대두">
          </div>
        </div>
        <div class="mv2-form-row">
          <div class="mv2-form-field">
            <label>메뉴구성 (항목별 칼로리를 개별로 입력)</label>
            <div class="mv2-comp-block" id="mv2CompBlock">
              <div class="mv2-comp-block-label">항목명 / 칼로리(kcal)</div>
              ${f.compositions.map((c, i) => `
                <div class="mv2-comp-row" data-comp-idx="${i}">
                  <input class="field" type="text" placeholder="항목명 (예: 잡곡밥)" data-comp-field="name" value="${c.name}">
                  <input class="field" type="number" placeholder="kcal" data-comp-field="kcal" value="${c.kcal}">
                  <button type="button" class="mv2-comp-remove" data-mv2-comp-remove data-idx="${i}" aria-label="구성 항목 삭제">✕</button>
                </div>`).join('')}
              <button type="button" class="mv2-comp-add" id="mv2CompAdd">+ 구성 추가</button>
            </div>
          </div>
          <div class="mv2-form-field" style="flex:2">
            <label>영양성분 (고정 항목, 값만 입력 · 총열량은 메뉴구성 합계로 자동 계산)</label>
            <div class="mv2-nutri-block">
              ${NUTRI_FIELDS.map((nf) => `
                <div class="mv2-nutri-field">
                  <label for="mv2Nutri-${nf.key}">${nf.label}(${nf.unit})</label>
                  <input class="field" type="number" id="mv2Nutri-${nf.key}" data-nutri-field="${nf.key}" value="${f.nutrition[nf.key]}">
                </div>`).join('')}
              <div class="mv2-nutri-field">
                <label>총열량(kcal)</label>
                <input class="field" type="text" id="mv2NutriTotalKcal" value="${sumKcal(f.compositions)}" disabled>
              </div>
            </div>
          </div>
        </div>
        <div class="mv2-form-actions">
          <button class="btn outline" type="button" id="mv2FormCancel">취소</button>
          <button class="btn primary" type="button" id="mv2FormSave">${f.mode === 'edit' ? '수정 저장' : '등록'}</button>
        </div>
      </div>`;
  }

  function renderDayPanel() {
    const day = new Date(selectedDate + 'T00:00:00');
    dayTitle.textContent = `${selectedDate} (${dow[day.getDay()]}) 식단 관리`;
    const data = dataFor(selectedDate);
    const formOpenElsewhere = !!form;

    root.innerHTML = MEALS.map((meal) => {
      const items = data[meal];
      const reordering = reorderState[meal];
      const isFormHere = form && form.meal === meal;
      const editingIdx = isFormHere && form.mode === 'edit' ? form.idx : -1;

      const rows = items.map((item, idx) => (idx === editingIdx ? formHTML() : menuItemHTML(meal, item, idx, reordering))).join('');
      const addRow = isFormHere && form.mode === 'add' ? formHTML() : '';
      const list = (rows || addRow) ? rows + addRow : '<p class="mv2-meal-empty">등록된 메뉴가 없습니다.</p>';

      return `
        <section class="panel mv2-meal-section${reordering ? ' is-reordering' : ''}" data-meal="${meal}">
          <div class="mv2-meal-head">
            <div class="mv2-meal-head-title">${meal} <span class="count">${items.length}/${MAX_ITEMS}</span></div>
            <div class="mv2-meal-head-actions">
              <button class="btn outline" type="button" data-mv2-add data-meal="${meal}" ${items.length >= MAX_ITEMS || formOpenElsewhere ? 'disabled' : ''}>+ 메뉴 추가</button>
              <button class="btn outline" type="button" data-mv2-reorder data-meal="${meal}" ${items.length < 2 || formOpenElsewhere ? 'disabled' : ''}>${reordering ? '완료' : '순서 변경'}</button>
            </div>
          </div>
          <div class="mv2-meal-list" data-meal-list="${meal}">${list}</div>
        </section>`;
    }).join('');

    bindDayPanelEvents();
  }

  function bindDayPanelEvents() {
    const data = dataFor(selectedDate);

    root.querySelectorAll('[data-mv2-add]').forEach((btn) => {
      btn.addEventListener('click', () => {
        form = blankForm(btn.dataset.meal, 'add', null, null);
        renderDayPanel();
      });
    });

    root.querySelectorAll('[data-mv2-edit]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const meal = btn.dataset.meal;
        const idx = Number(btn.dataset.idx);
        form = blankForm(meal, 'edit', idx, data[meal][idx]);
        renderDayPanel();
      });
    });

    root.querySelectorAll('[data-mv2-reorder]').forEach((btn) => {
      btn.addEventListener('click', () => {
        reorderState[btn.dataset.meal] = !reorderState[btn.dataset.meal];
        renderDayPanel();
      });
    });

    root.querySelectorAll('[data-mv2-delete]').forEach((btn) => {
      btn.addEventListener('click', () => openDeleteConfirm(btn.dataset.meal, Number(btn.dataset.idx)));
    });

    root.querySelectorAll('[data-mv2-publish-toggle]').forEach((input) => {
      input.addEventListener('change', () => {
        const meal = input.dataset.meal;
        const idx = Number(input.dataset.idx);
        const item = data[meal][idx];
        if (!input.checked) {
          openPublishConfirm(meal, idx, item);
        } else {
          item.exposed = true;
          showToast(item.name + ' 메뉴가 노출(으)로 변경되었습니다.');
          renderWeekStrip();
        }
      });
    });

    root.querySelectorAll('[data-mv2-register-photo] input[type="file"]').forEach((input) => {
      input.addEventListener('change', () => {
        const file = input.files[0];
        if (!file) return;
        const label = input.closest('[data-mv2-register-photo]');
        const meal = label.dataset.meal;
        const idx = Number(label.dataset.idx);
        const item = data[meal][idx];
        item.image = URL.createObjectURL(file);
        showToast(item.name + ' 이미지가 등록되었습니다.');
        renderDayPanel();
        renderWeekStrip();
      });
    });

    // ---- 등록/수정 폼 바인딩 ----
    const formEl = root.querySelector('.mv2-menu-form');
    if (formEl && form) {
      formEl.querySelector('#mv2FormName').addEventListener('input', (e) => { form.name = e.target.value; });
      formEl.querySelector('#mv2FormOrigin').addEventListener('input', (e) => { form.origin = e.target.value; });
      formEl.querySelector('#mv2FormAllergy').addEventListener('input', (e) => { form.allergy = e.target.value; });

      formEl.querySelectorAll('[data-comp-field]').forEach((input) => {
        input.addEventListener('input', (e) => {
          const row = e.target.closest('[data-comp-idx]');
          const i = Number(row.dataset.compIdx);
          form.compositions[i][e.target.dataset.compField] = e.target.value;
          // 총열량은 메뉴구성 합계 자동 계산 — 전체 재렌더 없이 그 값만 즉시 갱신(입력 포커스 유지)
          const totalInput = formEl.querySelector('#mv2NutriTotalKcal');
          if (totalInput) totalInput.value = sumKcal(form.compositions);
        });
      });
      formEl.querySelectorAll('[data-mv2-comp-remove]').forEach((btn) => {
        btn.addEventListener('click', () => {
          form.compositions.splice(Number(btn.dataset.idx), 1);
          if (form.compositions.length === 0) form.compositions.push({ name: '', kcal: '' });
          renderDayPanel();
        });
      });
      formEl.querySelector('#mv2CompAdd').addEventListener('click', () => {
        form.compositions.push({ name: '', kcal: '' });
        renderDayPanel();
      });

      formEl.querySelectorAll('[data-nutri-field]').forEach((input) => {
        input.addEventListener('input', (e) => { form.nutrition[e.target.dataset.nutriField] = e.target.value; });
      });

      const photoInput = formEl.querySelector('#mv2FormPhotoInput');
      photoInput.addEventListener('change', () => {
        const file = photoInput.files[0];
        if (!file) return;
        form.image = URL.createObjectURL(file);
        renderDayPanel();
      });

      formEl.querySelector('#mv2FormCancel').addEventListener('click', () => {
        form = null;
        renderDayPanel();
      });

      formEl.querySelector('#mv2FormSave').addEventListener('click', () => {
        if (!form.name.trim()) {
          showToast('메뉴명을 입력해주세요.');
          return;
        }
        const composition = form.compositions
          .filter((c) => c.name.trim() !== '')
          .map((c) => ({ name: c.name.trim(), kcal: Number(c.kcal) || 0 }));
        const nutrition = {};
        NUTRI_FIELDS.forEach((nf) => { nutrition[nf.key] = Number(form.nutrition[nf.key]) || 0; });
        nutrition.kcal = sumKcal(composition); // 총열량은 메뉴구성 합계로 자동 계산(직접 입력값 아님)

        const record = {
          name: form.name.trim(),
          composition,
          nutrition,
          origin: form.origin.trim(),
          allergy: form.allergy.trim(),
          image: form.image,
          exposed: form.exposed,
        };

        if (form.mode === 'edit') {
          data[form.meal][form.idx] = { ...data[form.meal][form.idx], ...record };
          showToast(record.name + ' 메뉴가 수정되었습니다.');
        } else {
          data[form.meal].push(record);
          showToast(record.name + ' 메뉴가 ' + form.meal + '에 추가되었습니다.');
        }
        form = null;
        renderDayPanel();
        renderWeekStrip();
      });
    }

    // 순서 변경(드래그) — 섹션 내부에서만 동작
    root.querySelectorAll('.mv2-meal-section.is-reordering .mv2-menu-item').forEach((el) => {
      el.addEventListener('dragstart', () => el.classList.add('is-dragging'));
      el.addEventListener('dragend', () => el.classList.remove('is-dragging'));
    });
    root.querySelectorAll('.mv2-meal-section.is-reordering .mv2-meal-list').forEach((list) => {
      list.addEventListener('dragover', (event) => {
        event.preventDefault();
        const dragging = list.querySelector('.is-dragging');
        if (!dragging) return;
        const after = [...list.querySelectorAll('.mv2-menu-item:not(.is-dragging)')].find((sibling) => {
          const rect = sibling.getBoundingClientRect();
          return event.clientY < rect.top + rect.height / 2;
        });
        if (after) list.insertBefore(dragging, after);
        else list.appendChild(dragging);
      });
      list.addEventListener('drop', () => {
        const meal = list.dataset.mealList;
        const newOrder = [...list.querySelectorAll('.mv2-menu-item')].map((el) => Number(el.dataset.idx));
        data[meal] = newOrder.map((i) => data[meal][i]);
        renderDayPanel();
        showToast(meal + ' 순서가 변경되었습니다.');
      });
    });
  }

  // ---- 삭제 확인 모달 -------------------------------------------------------
  const deleteModal = document.getElementById('mv2DeleteConfirmModal');
  const deleteDesc = document.getElementById('mv2DeleteConfirmDesc');
  const deleteOk = document.getElementById('mv2DeleteConfirmOk');
  let pendingDelete = null;

  function openDeleteConfirm(meal, idx) {
    const item = dataFor(selectedDate)[meal][idx];
    pendingDelete = { meal, idx };
    deleteDesc.textContent = `${meal}의 "${item.name}" 메뉴를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`;
    deleteModal.classList.add('show');
    deleteModal.setAttribute('aria-hidden', 'false');
  }
  function closeDeleteConfirm() {
    pendingDelete = null;
    deleteModal.classList.remove('show');
    deleteModal.setAttribute('aria-hidden', 'true');
  }
  deleteModal.querySelectorAll('[data-mv2-delete-cancel]').forEach((el) => el.addEventListener('click', closeDeleteConfirm));
  deleteOk.addEventListener('click', () => {
    if (!pendingDelete) return;
    const { meal, idx } = pendingDelete;
    const data = dataFor(selectedDate);
    const [removed] = data[meal].splice(idx, 1);
    closeDeleteConfirm();
    renderDayPanel();
    renderWeekStrip();
    showToast(removed.name + ' 메뉴가 삭제되었습니다.');
  });

  // ---- 비노출 전환 확인 모달 --------------------------------------------------
  const publishModal = document.getElementById('mv2PublishConfirmModal');
  const publishDesc = document.getElementById('mv2PublishConfirmDesc');
  const publishOk = document.getElementById('mv2PublishConfirmOk');
  let pendingPublish = null;

  function openPublishConfirm(meal, idx, item) {
    pendingPublish = { meal, idx };
    publishDesc.textContent = `${item.name} 메뉴를 비노출로 전환하시겠습니까? 전환 즉시 사용자 화면에서 보이지 않습니다.`;
    publishModal.classList.add('show');
    publishModal.setAttribute('aria-hidden', 'false');
    renderDayPanel();
  }
  publishModal.querySelectorAll('[data-mv2-publish-cancel]').forEach((el) => el.addEventListener('click', () => {
    if (pendingPublish) dataFor(selectedDate)[pendingPublish.meal][pendingPublish.idx].exposed = true;
    pendingPublish = null;
    publishModal.classList.remove('show');
    publishModal.setAttribute('aria-hidden', 'true');
    renderDayPanel();
  }));
  publishOk.addEventListener('click', () => {
    if (!pendingPublish) return;
    const { meal, idx } = pendingPublish;
    const item = dataFor(selectedDate)[meal][idx];
    item.exposed = false;
    pendingPublish = null;
    publishModal.classList.remove('show');
    publishModal.setAttribute('aria-hidden', 'true');
    renderDayPanel();
    renderWeekStrip();
    showToast(item.name + ' 메뉴가 임시저장(으)로 변경되었습니다.');
  });

  // ---- 엑셀 업로드 (이미지 제외, 사업장 컬럼으로 복수 사업장 처리) -------------------
  const excelInput = document.getElementById('mv2ExcelInput');
  if (excelInput) {
    excelInput.addEventListener('change', () => {
      const file = excelInput.files[0];
      if (!file) return;
      showToast(file.name + ' — 이미지를 제외한 메뉴 정보가 반영되었습니다. 이미지는 목록에서 개별 등록해주세요. (등록 완료 4건, 오류 1건)');
      excelInput.value = '';
    });
  }

  renderCalendar();
  renderWeekStrip();
  renderDayPanel();
});
