(function () {
    var overlay = document.getElementById("loading-overlay");
    if (!overlay) return;

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
        return;
    }

    setSessionLoaded();

    /* 1.8秒表示 → 0.5秒でフェードアウト */
    setTimeout(function () {
        overlay.classList.add("is-hiding");
        setTimeout(function () {
            overlay.style.display = "none";
        }, 500);
    }, 1800);
})();
