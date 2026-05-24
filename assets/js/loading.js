(function () {
    var overlay = document.getElementById("loading-overlay");
    if (!overlay) return;

    /* 同一セッション内での2回目以降はスキップ */
    if (sessionStorage.getItem("yuki-loaded")) {
        overlay.style.display = "none";
        return;
    }

    sessionStorage.setItem("yuki-loaded", "1");

    /* 1.8秒表示 → 0.5秒でフェードアウト */
    setTimeout(function () {
        overlay.classList.add("is-hiding");
        setTimeout(function () {
            overlay.style.display = "none";
        }, 500);
    }, 1800);
})();
