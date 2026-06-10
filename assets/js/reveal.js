/* スクロール出現演出（全ページ共通）
   実行時に対象へ .is-reveal を付与する方式のため、JS無効時は普通に表示される。 */
(function () {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    var SELECTORS = [
        ".works-card",
        ".works-category-title",
        ".about-inner",
        ".about-profile__inner",
        ".skill-list li",
        ".contact-section .container",
        ".work-detail-media",
        ".work-detail-body"
    ];
    var targets = document.querySelectorAll(SELECTORS.join(","));
    if (!targets.length) return;

    targets.forEach(function (el, i) {
        el.classList.add("is-reveal");
        /* 同時に出現する要素が一斉に動かないよう軽い時差を付ける */
        el.style.setProperty("--reveal-delay", (i % 4) * 70 + "ms");
    });

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-shown");
            observer.unobserve(entry.target);
        });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });

    function arm() {
        targets.forEach(function (el) {
            observer.observe(el);
        });
    }

    /* ローディングのスキップ時はクラスが先に立つため、イベント待ちと二段構えにする */
    if (document.documentElement.classList.contains("is-loaded")) {
        arm();
    } else {
        document.addEventListener("yuki:loading-done", arm, { once: true });
    }
})();
