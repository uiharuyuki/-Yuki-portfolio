const fs = require("node:fs");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");
const siteUrl = "https://uiharuyuki.github.io/-Yuki-portfolio";
const themeScript = "!function(){var d=document.documentElement;var t=null;try{t=localStorage.getItem('yuki-theme')}catch(e){}var m='light';try{m=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'}catch(e){}var c=d.classList.contains('contact-document');function s(){var w=window.innerWidth;d.style.setProperty('--viewport-width',w+'px');d.style.setProperty('--scrollbar-width',c?'0px':Math.max(0,w-d.clientWidth)+'px');d.style.setProperty('--page-frame-space',Math.min(24,Math.max(8,w*.0222))+'px')}d.setAttribute('data-theme',t||m);if(!c){d.style.overflowY='scroll'}s();if(!c){d.style.removeProperty('overflow-y')}window.addEventListener('resize',s)}();";
const arrowSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>';

const works = readJson("data/works.json");
const about = readJson("data/about.json");

function readText(relativePath) {
    return fs.readFileSync(path.join(rootDir, relativePath), "utf8");
}

function writeText(relativePath, content) {
    const filePath = path.join(rootDir, relativePath);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content, "utf8");
}

function readJson(relativePath) {
    return JSON.parse(readText(relativePath));
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
        };

        return entities[character];
    });
}

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function indent(content, spaces) {
    const prefix = " ".repeat(spaces);

    return content
        .split("\n")
        .map((line) => (line ? prefix + line : line))
        .join("\n");
}

function replaceGeneratedBlock(relativePath, blockName, html) {
    const start = `<!-- build:${blockName} -->`;
    const end = `<!-- /build:${blockName} -->`;
    const pattern = new RegExp(`^([ \\t]*)${escapeRegExp(start)}[\\s\\S]*?^\\1${escapeRegExp(end)}`, "m");
    const content = readText(relativePath);
    const match = content.match(pattern);

    if (!match) {
        throw new Error(`${relativePath} に ${start} / ${end} が見つかりません。`);
    }

    const baseIndent = match[1];
    const replacement = `${baseIndent}${start}\n${indent(html, baseIndent.length)}\n${baseIndent}${end}`;
    writeText(relativePath, content.replace(pattern, replacement));
}

function formatTechnologies(work) {
    return work.technologies.join(" / ");
}

function renderWorksLink(link, work, detailPrefix) {
    const href = link.type === "detail" ? `${detailPrefix}${work.slug}/` : link.href;
    const externalAttributes = link.external ? ' target="_blank" rel="noopener noreferrer"' : "";

    return `<a href="${escapeHtml(href)}" class="works-detail"${externalAttributes}>${escapeHtml(link.label)}${arrowSvg}</a>`;
}

function renderDescriptionLines(lines) {
    return lines.map(escapeHtml).join("<br>");
}

function renderWorksCard(work, imagePrefix, detailPrefix) {
    const desktopImage = work.images.desktop;
    const mobileImage = work.images.mobile;
    const links = work.links.map((link) => renderWorksLink(link, work, detailPrefix));
    const linksHtml = links.length > 1
        ? `<div class="works-links">\n${indent(links.join("\n"), 12)}\n            </div>`
        : links[0];

    return `<article class="works-card">
    <div class="works-media" aria-hidden="true">
        <img src="${escapeHtml(imagePrefix + desktopImage.src)}" width="${desktopImage.width}" height="${desktopImage.height}" loading="lazy" decoding="async" alt="">
        <img src="${escapeHtml(imagePrefix + mobileImage.src)}" width="${mobileImage.width}" height="${mobileImage.height}" loading="lazy" decoding="async" alt="">
    </div>
    <div class="works-content">
        <p class="works-genre">${escapeHtml(work.genre)}</p>
        <h3>${escapeHtml(work.title)}</h3>
        <dl class="works-meta">
            <div>
                <dt>使用技術</dt>
                <dd>${escapeHtml(formatTechnologies(work))}</dd>
            </div>
        </dl>
        <p>${renderDescriptionLines(work.description)}</p>
        ${linksHtml}
    </div>
</article>`;
}

function renderWorksList(imagePrefix, detailPrefix) {
    return `<div class="works-list">
${indent(works.map((work) => renderWorksCard(work, imagePrefix, detailPrefix)).join("\n\n"), 4)}
</div>`;
}

function renderAboutText(lines) {
    return lines.map(escapeHtml).join("<br>");
}

function renderAboutProfile(variant, imagePrefix) {
    const wrapperClass = variant === "page" ? "about-profile__inner" : "about-inner";
    const imageClass = variant === "page" ? "about-profile__image" : "about-image";
    const bodyClass = variant === "page" ? "about-profile__body" : "about-content";
    const headingTag = variant === "page" ? "h2" : "h3";
    const image = about.image;
    const detailLink = variant === "page" ? "" : `\n        <a href="about.html" class="works-detail">詳細${arrowSvg}</a>`;

    return `<div class="${wrapperClass}">
    <div class="${imageClass}">
        <img src="${escapeHtml(imagePrefix + image.src)}" width="${image.width}" height="${image.height}" alt="${escapeHtml(image.alt)}" loading="lazy" decoding="async">
    </div>

    <div class="${bodyClass}">
        <${headingTag}>${escapeHtml(about.name)}</${headingTag}>
        <p>${renderAboutText(about.profile)}</p>${detailLink}
    </div>
</div>`;
}

function markdownToHtml(markdown) {
    const normalizedMarkdown = markdown.replace(/\r\n/g, "\n").trim();

    if (!normalizedMarkdown) {
        return "";
    }

    return normalizedMarkdown
        .split(/\n{2,}/)
        .map((block) => {
            const lines = block.split("\n").map((line) => line.trim());
            const heading = lines.length === 1 && lines[0].match(/^(#{2,6})\s+(.+)$/);

            if (heading) {
                const level = heading[1].length;
                return `<h${level}>${escapeHtml(heading[2])}</h${level}>`;
            }

            return `<p>${lines.map(escapeHtml).join("\n")}</p>`;
        })
        .join("\n");
}

function renderTagList(tags) {
    return `<ul class="works-tags">
${indent(tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join("\n"), 4)}
</ul>`;
}

function renderSpecs(work) {
    const specs = [
        ...work.detail.specs,
        {
            term: "使用技術",
            description: formatTechnologies(work),
        },
    ];

    return `<dl>
${indent(specs.map((spec) => `<div>
    <dt>${escapeHtml(spec.term)}</dt>
    <dd>${escapeHtml(spec.description)}</dd>
</div>`).join("\n"), 4)}
</dl>`;
}

function renderWorkDetailPage(work) {
    const detail = work.detail;
    const desktopImage = work.images.desktop;
    const mobileImage = work.images.mobile;
    const workUrl = `${siteUrl}/works/${work.slug}/`;
    const markdown = readText(`content/works/${work.slug}.md`);

    return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="utf-8">
    <script>${themeScript}</script>
    <title>${escapeHtml(detail.pageTitle)} | Works | Yuki Portfolio</title>
    <meta name="author" content="内山 倖徳">
    <meta name="description" content="${escapeHtml(detail.metaDescription)}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="format-detection" content="telephone=no,email=no,address=no">
    <link rel="canonical" href="${escapeHtml(workUrl)}">
    <link rel="icon" href="../../assets/images/icons/favicon.svg" type="image/svg+xml">

    <!-- OGP -->
    <meta property="og:url" content="${escapeHtml(workUrl)}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${escapeHtml(detail.pageTitle)} | Works | Yuki Portfolio">
    <meta property="og:description" content="${escapeHtml(detail.metaDescription)}">
    <meta property="og:site_name" content="Yuki Portfolio">
    <meta property="og:image" content="${siteUrl}/assets/images/og/portfolio-og.jpg">
    <meta property="og:locale" content="ja_JP">

    <!-- OGP X (Twitter) -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@U_K_0211">
    <meta name="twitter:creator" content="@U_K_0211">
    <meta name="twitter:title" content="${escapeHtml(detail.pageTitle)} | Works | Yuki Portfolio">
    <meta name="twitter:description" content="${escapeHtml(detail.metaDescription)}">
    <meta name="twitter:image" content="${siteUrl}/assets/images/og/portfolio-og.jpg">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@400;700&family=Zen+Kaku+Gothic+New:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/yakuhanjp@4.1.1/dist/css/yakuhanjp.css">

    <link rel="stylesheet" href="../../assets/css/kiso.css">
    <link rel="stylesheet" href="../../assets/css/base.css">
    <link rel="stylesheet" href="../../assets/css/common.css">
    <link rel="stylesheet" href="../../assets/css/component.css">
    <link rel="stylesheet" href="../../assets/css/pages/work-detail.css">
    <script src="../../assets/js/header.js" defer></script>
    <script src="../../assets/js/loading.js" defer></script>
</head>

<body>
    <div id="loading-overlay" aria-hidden="true">
        <span class="loading-ring" aria-hidden="true"></span>
        <p>Yuki portfolio</p>
    </div>
    <div class="page-frame-blur" aria-hidden="true"></div>
    <div class="page-frame" aria-hidden="true"></div>

    <div id="page-layout__wrapper">
        <site-header current-page="works"></site-header>

        <main class="page-main">
            <div class="container">

                <nav class="work-breadcrumb" aria-label="パンくずリスト">
                    <a href="../">← Works一覧</a>
                </nav>

                <article class="work-detail">

                    <header class="work-detail-header">
                        ${indent(renderTagList(detail.primaryTags), 24).trimStart()}
                        <h1>「${escapeHtml(detail.pageTitle)}」</h1>
                        ${indent(renderTagList(detail.secondaryTags), 24).trimStart()}
                    </header>

                    <div class="work-detail-media">
                        <img src="../../assets/images/works/${escapeHtml(desktopImage.src)}" width="${desktopImage.width}" height="${desktopImage.height}" decoding="async" alt="${escapeHtml(detail.pageTitle)} デスクトップ表示">
                        <img src="../../assets/images/works/${escapeHtml(mobileImage.src)}" width="${mobileImage.width}" height="${mobileImage.height}" decoding="async" alt="${escapeHtml(detail.pageTitle)} モバイル表示">
                    </div>

                    <div class="work-detail-body">
                        <section class="work-detail-description">
                            ${indent(markdownToHtml(markdown), 28).trimStart()}
                        </section>

                        <aside class="work-detail-specs" aria-label="制作仕様">
                            ${indent(renderSpecs(work), 28).trimStart()}
                        </aside>
                    </div>

                </article>
            </div>
        </main>

        <site-footer current-page="works"></site-footer>
    </div>
</body>
</html>
`;
}

function build() {
    replaceGeneratedBlock("index.html", "works-list-home", renderWorksList("assets/images/works/", "works/"));
    replaceGeneratedBlock("index.html", "about-profile-home", renderAboutProfile("home", "assets/images/about/"));
    replaceGeneratedBlock("works/index.html", "works-list-index", renderWorksList("../assets/images/works/", ""));
    replaceGeneratedBlock("about.html", "about-profile-page", renderAboutProfile("page", "assets/images/about/"));

    works.forEach((work) => {
        writeText(`works/${work.slug}/index.html`, renderWorkDetailPage(work));
    });

    console.log(`Generated ${works.length} work detail pages and shared content blocks.`);
}

build();
