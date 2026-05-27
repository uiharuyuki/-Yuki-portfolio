(function () {
    // スパムボット対策: メールアドレスはHTMLに完全な形では書かず、
    // 「user [at] domain」表記で記述する。ここで「@」に戻して
    // 表示テキストと mailto リンクを組み立てる。
    var links = document.querySelectorAll(".contact-mail");

    links.forEach(function (link) {
        var address = link.textContent.trim().replace(/\s*\[at\]\s*/i, "@");

        if (address.indexOf("@") === -1) return;

        link.textContent = address;
        link.href = "mailto:" + address;
    });
})();
