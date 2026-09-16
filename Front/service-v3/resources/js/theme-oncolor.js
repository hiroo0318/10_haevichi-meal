/* =========================================================
   해비치 급식 App — 대표색 위 글자색 결정

   회사 대표색(--brand-primary) 위에 얹는 글자색을 --brand-on-primary로 공급한다.

   [A] 테마 파일이 --brand-on-primary를 직접 지정하면 그 값을 그대로 쓴다. 이 스크립트는 관여하지 않는다.
   [B] 지정이 없을 때만 대표색의 밝기를 계산해 흰색 또는 #171A1F를 넣는다.

   판정 기준은 CIE L* 55다.
   흰 글자와 #171A1F 글자의 대비가 같아지는 교차점이 L* 52이므로, 이 근처를 기준으로 잡으면
   두 후보 중 대비가 높은 쪽이 선택된다. 52가 아니라 55로 조금 올린 것은 경계 부근의 색을
   흰 글자 쪽으로 약하게 치우치게 하기 위함이다(선택 상태는 진한 배경 + 흰 글자가 관례).

   런타임에 대비를 비교해 고르는 방식은 쓰지 않는다. 회색 계열은 흰색·검정 대비가 둘 다 4 언저리라
   대표색이 조금만 달라져도 결과가 뒤집히고, 고객사마다 결과를 예측하기 어렵기 때문이다.
   해비치 #70747A는 L* 48.7로 기준선 아래이므로 흰색이 유지된다. 지금까지와 동일하다.

   이 파일은 <head>에서 테마 링크 뒤에 동기 로드해야 한다.
   본문 스크립트처럼 </body> 앞에 두면 첫 페인트 이후에 값이 바뀌어 글자색이 한 번 튄다.
   ========================================================= */
(function(){
  var root = document.documentElement;
  var LSTAR_THRESHOLD = 55;
  var ON_LIGHT = '#171A1F';   /* 밝은 대표색 위 */
  var ON_DARK  = '#FFFFFF';   /* 어두운 대표색 위 */

  /* 대표색 표기는 hex / rgb() / hsl() / 색상명 무엇이든 올 수 있다.
     canvas fillStyle에 넣었다 되읽으면 어떤 표기든 #rrggbb 또는 rgba()로 정규화된다. */
  var normalize = function(value){
    try{
      var ctx = document.createElement('canvas').getContext('2d');
      ctx.fillStyle = '#000000';
      ctx.fillStyle = value;
      return ctx.fillStyle;
    }catch(e){ return ''; }
  };

  var toRgb = function(css){
    if(/^#[0-9a-f]{6}$/i.test(css)){
      return [parseInt(css.substr(1,2),16), parseInt(css.substr(3,2),16), parseInt(css.substr(5,2),16)];
    }
    var m = css.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
    return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
  };

  var lstar = function(rgb){
    var f = function(c){ c = c / 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    var Y = 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2]);
    return Y > 0.008856 ? 116 * Math.pow(Y, 1 / 3) - 16 : 903.3 * Y;
  };

  var apply = function(){
    /* 이전에 이 스크립트가 넣은 값을 먼저 걷어내야, 테마 교체 후 지정 여부를 다시 판정할 수 있다. */
    root.style.removeProperty('--brand-on-primary');

    var styles = window.getComputedStyle(root);
    if(styles.getPropertyValue('--brand-on-primary').trim()) return;   /* [A] 테마가 지정함 */

    var primary = styles.getPropertyValue('--brand-primary').trim();
    if(!primary) return;
    var rgb = toRgb(normalize(primary));
    if(!rgb) return;

    root.style.setProperty('--brand-on-primary', lstar(rgb) < LSTAR_THRESHOLD ? ON_DARK : ON_LIGHT);
  };

  apply();

  /* 테마 링크를 런타임에 교체하면(앱 셸 주입, ?theme= 스위처) CSS가 비동기로 다시 로드된다.
     교체 직후 값은 이전 테마 기준이므로 load 시점에 다시 판정한다. */
  var themeLink = document.getElementById('themeLink');
  if(themeLink) themeLink.addEventListener('load', apply);
})();
