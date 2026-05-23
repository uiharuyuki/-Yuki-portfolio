class SiteHeader extends HTMLElement {
    connectedCallback() {
        const currentPage = this.getAttribute("current-page") || "";
        const navItems = [
            { id: "home", href: "index.html", label: "home" },
            { id: "about", href: "about.html", label: "about" },
            { id: "works", href: "works.html", label: "works" },
        ];

        const navLinks = navItems.map((item) => {
            const isActive = item.id === currentPage;
            const className = isActive ? " class=\"is-active\"" : "";
            const ariaCurrent = isActive ? " aria-current=\"page\"" : "";

            return `<li><a href="${item.href}"${className}${ariaCurrent}>${item.label}</a></li>`;
        }).join("");

        const mobileNavLinks = navItems.map((item) => {
            const isActive = item.id === currentPage;
            const className = isActive ? " class=\"is-active\"" : "";
            const ariaCurrent = isActive ? " aria-current=\"page\"" : "";

            return `<li><a href="${item.href}"${className}${ariaCurrent}>${item.label}</a></li>`;
        }).join("");

        this.innerHTML = `
            <header class="site-header">
                <p class="site-brand"><a href="index.html">Yuki portfolio</a></p>

                <nav class="site-nav" aria-label="primary navigation">
                    <ul>
                        ${navLinks}
                    </ul>
                </nav>

                <div class="header-links">
                    <a href="https://github.com/uiharuyuki" class="header-link" target="_blank" rel="noopener noreferrer">
                        <span>github</span>
                        <img src="assets/images/icons/arrow-outward.svg" width="14" height="14" alt="" aria-hidden="true">
                    </a>
                    <a href="https://x.com/U_K_0211" class="header-link" target="_blank" rel="noopener noreferrer">
                        <span>X</span>
                        <img src="assets/images/icons/arrow-outward.svg" width="14" height="14" alt="" aria-hidden="true">
                    </a>
                </div>

                <button class="header-menu-toggle" aria-expanded="false" aria-controls="mobile-nav-menu" aria-label="メニューを開く">
                    <span class="burger-bar"></span>
                    <span class="burger-bar"></span>
                    <span class="burger-bar"></span>
                </button>

                <div class="mobile-nav-backdrop" data-open="false"></div>

                <div class="mobile-nav-menu" id="mobile-nav-menu" aria-hidden="true">
                    <nav aria-label="mobile navigation">
                        <ul>
                            ${mobileNavLinks}
                        </ul>
                    </nav>
                    <div class="mobile-nav-links">
                        <a href="https://github.com/uiharuyuki" class="header-link" target="_blank" rel="noopener noreferrer">
                            <span>github</span>
                            <img src="assets/images/icons/arrow-outward.svg" width="14" height="14" alt="" aria-hidden="true">
                        </a>
                        <a href="https://x.com/U_K_0211" class="header-link" target="_blank" rel="noopener noreferrer">
                            <span>X</span>
                            <img src="assets/images/icons/arrow-outward.svg" width="14" height="14" alt="" aria-hidden="true">
                        </a>
                    </div>
                </div>
            </header>
        `;

        const toggle = this.querySelector(".header-menu-toggle");
        const menu = this.querySelector(".mobile-nav-menu");
        const backdrop = this.querySelector(".mobile-nav-backdrop");

        const setMenu = (open) => {
            toggle.setAttribute("aria-expanded", String(open));
            menu.setAttribute("aria-hidden", String(!open));
            backdrop.setAttribute("data-open", String(open));
            toggle.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
        };

        toggle.addEventListener("click", () => {
            const isOpen = toggle.getAttribute("aria-expanded") === "true";
            setMenu(!isOpen);
        });

        // 範囲外（オーバーレイ）をタップしたら閉じる
        backdrop.addEventListener("click", () => setMenu(false));

        // メニュー内リンクをタップしたら閉じる
        menu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => setMenu(false));
        });
    }
}

customElements.define("site-header", SiteHeader);
