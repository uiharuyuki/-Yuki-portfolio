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

        toggle.addEventListener("click", () => {
            const isOpen = toggle.getAttribute("aria-expanded") === "true";
            toggle.setAttribute("aria-expanded", String(!isOpen));
            menu.setAttribute("aria-hidden", String(isOpen));
            toggle.setAttribute("aria-label", isOpen ? "メニューを開く" : "メニューを閉じる");
        });

        // メニュー内リンクをタップしたら閉じる
        menu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                toggle.setAttribute("aria-expanded", "false");
                menu.setAttribute("aria-hidden", "true");
                toggle.setAttribute("aria-label", "メニューを開く");
            });
        });
    }
}

customElements.define("site-header", SiteHeader);
