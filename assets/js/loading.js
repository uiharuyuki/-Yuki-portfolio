(function () {
    /* ローディング完了をページ演出(home.jsなど)へ通知する */
    function notifyDone() {
        document.documentElement.classList.add("is-loaded");
        document.dispatchEvent(new CustomEvent("yuki:loading-done"));
    }

    var overlay = document.getElementById("loading-overlay");
    if (!overlay) {
        notifyDone();
        return;
    }

    function getSessionLoaded() {
        try {
            return sessionStorage.getItem("yuki-loaded");
        } catch (error) {
            return null;
        }
    }

    function setSessionLoaded() {
        try {
            sessionStorage.setItem("yuki-loaded", "1");
        } catch (error) {
            // Storage may be unavailable in some privacy or local-file contexts.
        }
    }

    /* 同一セッション内での2回目以降はスキップ */
    if (getSessionLoaded()) {
        overlay.style.display = "none";
        notifyDone();
        return;
    }

    setSessionLoaded();

    /* 1.8秒表示 → 0.5秒でフェードアウト(フェード開始と同時に演出を始める) */
    setTimeout(function () {
        overlay.classList.add("is-hiding");
        notifyDone();
        setTimeout(function () {
            overlay.style.display = "none";
        }, 500);
    }, 1800);
})();
