const MOON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const SUN_SVG  = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`;

class SiteHeader extends HTMLElement {
    connectedCallback() {
        const currentPage = this.getAttribute("current-page") || "";
        const navItems = [
            { id: "home",  href: "index.html",  label: "home"  },
            { id: "about", href: "about.html",  label: "about" },
            { id: "works", href: "works.html",  label: "works" },
        ];

        const makeNavLinks = (items) => items.map((item) => {
            const isActive  = item.id === currentPage;
            const cls       = isActive ? ` class="is-active"` : "";
            const aria      = isActive ? ` aria-current="page"` : "";
            return `<li><a href="${item.href}"${cls}${aria}>${item.label}</a></li>`;
        }).join("");

        this.innerHTML = `
            <header class="site-header">
                <p class="site-brand"><a href="index.html">Yuki portfolio</a></p>

                <nav class="site-nav" aria-label="primary navigation">
                    <ul>${makeNavLinks(navItems)}</ul>
                </nav>

                <div class="header-end">
                    <button class="theme-toggle" aria-label="ダークモードに切り替え">${MOON_SVG}</button>

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
                </div>

                <div class="mobile-nav-backdrop" data-open="false"></div>

                <div class="mobile-nav-menu" id="mobile-nav-menu" aria-hidden="true">
                    <nav aria-label="mobile navigation">
                        <ul>${makeNavLinks(navItems)}</ul>
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

        /* ---- ハンバーガーメニュー ---- */
        const toggle   = this.querySelector(".header-menu-toggle");
        const menu     = this.querySelector(".mobile-nav-menu");
        const backdrop = this.querySelector(".mobile-nav-backdrop");

        const setMenu = (open) => {
            toggle.setAttribute("aria-expanded", String(open));
            menu.setAttribute("aria-hidden", String(!open));
            backdrop.setAttribute("data-open", String(open));
            toggle.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
        };

        toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
        backdrop.addEventListener("click", () => setMenu(false));
        menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

        /* ---- テーマトグル ---- */
        const themeBtn = this.querySelector(".theme-toggle");

        const getTheme = () => document.documentElement.getAttribute("data-theme") || "light";

        const applyThemeIcon = (theme) => {
            themeBtn.innerHTML = theme === "dark" ? SUN_SVG : MOON_SVG;
            themeBtn.setAttribute("aria-label", theme === "dark" ? "ライトモードに切り替え" : "ダークモードに切り替え");
        };

        applyThemeIcon(getTheme());

        themeBtn.addEventListener("click", () => {
            const next = getTheme() === "dark" ? "light" : "dark";
            document.documentElement.setAttribute("data-theme", next);
            localStorage.setItem("yuki-theme", next);
            applyThemeIcon(next);
        });

        /* ---- カスタムカーソル（デスクトップのみ） ---- */
        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
            const ring = document.createElement("div");
            ring.className = "cursor-ring";
            document.body.appendChild(ring);

            document.addEventListener("mousemove", (e) => {
                ring.style.left = e.clientX + "px";
                ring.style.top  = e.clientY + "px";
            }, { passive: true });

            document.addEventListener("mouseover", (e) => {
                ring.classList.toggle("is-hovering", !!e.target.closest("a, button"));
            });
        }
    }
}

customElements.define("site-header", SiteHeader);
