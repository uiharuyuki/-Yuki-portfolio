(function () {
    var fv = document.querySelector(".first-view");
    if (!fv) return;

    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var message = fv.querySelector(".fv-message");
    var typed = fv.querySelector(".fv-message-typed");

    /* 演出開始まで要素を隠す(無JS時はこのクラスが付かず静的表示になる) */
    fv.classList.add("is-armed");

    /* タイトル文字(13文字 × 90ms + 0.3s)→ ウィンドウ出現(1.4s + 0.25s)の後にタイプ開始 */
    var TYPE_START_DELAY = 1700;
    var TYPE_INTERVAL = 55;

    function typewriter() {
        var chars = Array.from(typed.dataset.text || "");

        if (reduced) {
            typed.textContent = chars.join("");
            message.classList.add("is-done");
            return;
        }

        var count = 0;
        (function tick() {
            count += 1;
            typed.textContent = chars.slice(0, count).join("");
            if (count < chars.length) {
                setTimeout(tick, TYPE_INTERVAL);
            } else {
                message.classList.add("is-done");
            }
        })();
    }

    function start() {
        fv.classList.add("is-play");
        setTimeout(typewriter, reduced ? 0 : TYPE_START_DELAY);
    }

    /* ローディングのスキップ時はクラスが先に立つため、イベント待ちと二段構えにする */
    if (document.documentElement.classList.contains("is-loaded")) {
        start();
    } else {
        document.addEventListener("yuki:loading-done", start, { once: true });
    }

    /* 軽いパララックス(ヒーロー内のみ・rAFスロットル) */
    if (!reduced) {
        var ambient = fv.querySelector(".fv-ambient");
        var content = fv.querySelector(".fv-content");
        var ticking = false;

        window.addEventListener("scroll", function () {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(function () {
                var y = window.scrollY;
                if (y <= fv.offsetHeight) {
                    ambient.style.translate = "0 " + (y * 0.15).toFixed(1) + "px";
                    content.style.translate = "0 " + (y * 0.3).toFixed(1) + "px";
                }
                ticking = false;
            });
        }, { passive: true });
    }
})();
