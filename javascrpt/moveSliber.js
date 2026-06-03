(() => {

    // ===== 要素の取得 =====

    const slider = document.getElementById('slider');

    if (!slider) return;

    const prevBtn = document.getElementById('prevBtn');

    const nextBtn = document.getElementById('nextBtn');

    const dotsWrap = document.getElementById('dots');
 
    const slides = slider.querySelectorAll('.slide');

    const totalSlides = slides.length;

    let currentIndex = 0;
 
    // ===== ドット生成 =====

    slides.forEach((_, i) => {

        const dot = document.createElement('button');

        dot.className = 'dot' + (i === 0 ? ' active' : '');

        dot.setAttribute('aria-label', `slide ${i + 1}`);

        dot.addEventListener('click', () => goTo(i));

        dotsWrap.appendChild(dot);

    });
 
    const dots = dotsWrap.querySelectorAll('.dot');
 
    // ===== スライド移動 =====

    function goTo(index) {

        currentIndex = (index + totalSlides) % totalSlides;

        slider.style.transform = `translateX(-${currentIndex * 100}%)`;

        dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));

    }
 
    // ===== 矢印ボタン =====

    prevBtn.addEventListener('click', () => goTo(currentIndex - 1));

    nextBtn.addEventListener('click', () => goTo(currentIndex + 1));
 
    // ===== スワイプ（タッチ & マウス） =====

    const SWIPE_THRESHOLD = 50;

    let startX = 0;

    let isDragging = false;

    let didSwipe = false; // ← 追加：変数宣言
 
    function onDragStart(x) {

        startX = x;

        isDragging = true;

        didSwipe = false; // ← 追加：ドラッグ開始時にリセット

        slider.classList.add('grabbing');

    }
 
    function onDragEnd(x) {

        if (!isDragging) return;

        isDragging = false;

        slider.classList.remove('grabbing');
 
        const diff = startX - x;

        if (Math.abs(diff) >= SWIPE_THRESHOLD) {

            goTo(diff > 0 ? currentIndex + 1 : currentIndex - 1);

            didSwipe = true; // ← 追加：スワイプしたフラグを立てる

        }

    }
 
    // スワイプ後のクリックをキャンセル（onDragEndの外に出す）

    slider.addEventListener('click', e => {

        if (didSwipe) {

            e.preventDefault();

            didSwipe = false;

        }

    });
 
    // --- タッチ ---

    slider.addEventListener('touchstart', e => onDragStart(e.touches[0].clientX), { passive: true });

    slider.addEventListener('touchend', e => onDragEnd(e.changedTouches[0].clientX), { passive: true });
 
    // --- マウス ---

    slider.addEventListener('mousedown', e => onDragStart(e.clientX));

    slider.addEventListener('mouseup', e => onDragEnd(e.clientX));

    slider.addEventListener('mouseleave', e => { if (isDragging) onDragEnd(e.clientX); });
 
    // ===== 初期表示 =====

    goTo(0);

})();

// 今回追加：小さい画像がポインターに追従
const cursorImage = document.getElementById('cursorImage');
let currentX = window.innerWidth / 2;
let currentY = window.innerWidth / 2;
let targetX = window.innerWidth / 2;
let targetY = window.innerWidth / 2;

document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
});

function animate() {
    currentX += (targetX - currentX) * 0.1;
    currentY += (targetY - currentY) * 0.1;
    cursorImage.style.left = currentX + 'px';
    cursorImage.style.top  = currentY + 'px';
    requestAnimationFrame(animate);
}

animate();