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
            </header>
        `;
    }
}

customElements.define("site-header", SiteHeader);
