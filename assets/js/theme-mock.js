// data-theme（ライト/ダーク）に応じて mock 画像を差し替える。
// 対象は data-src-light / data-src-dark を持つ <img> のみ。
// （works.json の画像に srcDark を指定すると、ビルド時にこれらの属性が付与される）
(function () {
    const root = document.documentElement;
    const imgs = document.querySelectorAll("img[data-src-dark]");

    if (!imgs.length) {
        return;
    }

    function apply() {
        const dark = root.getAttribute("data-theme") === "dark";

        imgs.forEach((img) => {
            const next = dark ? img.dataset.srcDark : img.dataset.srcLight;

            if (next && img.getAttribute("src") !== next) {
                img.setAttribute("src", next);
            }
        });
    }

    apply();
    new MutationObserver(apply).observe(root, {
        attributes: true,
        attributeFilter: ["data-theme"],
    });
})();
