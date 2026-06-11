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

function renderIconLinks(prefix) {
    return `<link rel="icon" href="${prefix}assets/images/icons/favicon.png" type="image/png" sizes="32x32">
    <link rel="apple-touch-icon" href="${prefix}assets/images/icons/apple-touch-icon.png" sizes="180x180">
    <link rel="manifest" href="${prefix}site.webmanifest">`;
}

function renderDescriptionLines(lines) {
    return lines.map(escapeHtml).join("<br>");
}

function renderWorksImage(image, imagePrefix) {
    return `<img src="${escapeHtml(imagePrefix + image.src)}" width="${image.width}" height="${image.height}" loading="lazy" decoding="async" alt="">`;
}

function renderWorksCard(work, imagePrefix, detailPrefix, headingLevel = 3) {
    const desktopImage = work.images.desktop;
    const mobileImage = work.images.mobile;
    const links = work.links.map((link) => renderWorksLink(link, work, detailPrefix));
    const linksHtml = links.length > 1
        ? `<div class="works-links">\n${indent(links.join("\n"), 12)}\n            </div>`
        : links[0];

    // mobile画像が無い作品（Web以外など）は1枚画像のカードとして描画する。
    const cardClass = mobileImage ? "works-card" : "works-card works-card--single";
    const mediaHtml = mobileImage
        ? `${renderWorksImage(desktopImage, imagePrefix)}\n        ${renderWorksImage(mobileImage, imagePrefix)}`
        : renderWorksImage(desktopImage, imagePrefix);

    // メタの見出しは metaLabel で変更可能（既定は「使用技術」）。技術が無ければメタ自体を省く。
    const metaHtml = work.technologies && work.technologies.length
        ? `<dl class="works-meta">
            <div>
                <dt>${escapeHtml(work.metaLabel || "使用技術")}</dt>
                <dd>${escapeHtml(formatTechnologies(work))}</dd>
            </div>
        </dl>`
        : "";

    return `<article class="${cardClass}">
    <div class="works-media" aria-hidden="true">
        ${mediaHtml}
    </div>
    <div class="works-content">
        <p class="works-genre">${escapeHtml(work.genre)}</p>
        <h${headingLevel}>${escapeHtml(work.title)}</h${headingLevel}>
        ${metaHtml}
        <p>${renderDescriptionLines(work.description)}</p>
        ${linksHtml}
    </div>
</article>`;
}

function renderWorksList(list, imagePrefix, detailPrefix, cardHeadingLevel = 3) {
    return `<div class="works-list">
${indent(list.map((work) => renderWorksCard(work, imagePrefix, detailPrefix, cardHeadingLevel)).join("\n\n"), 4)}
</div>`;
}

// category が2種類以上あるときだけ見出し付きセクションに分ける。
// 1種類だけのときは従来どおりフラットな一覧を返す。
// headingLevel はページ内の見出し階層に合わせる（Works一覧は h2、ホームは h3）。
function renderWorksByCategory(list, imagePrefix, detailPrefix, headingLevel = 2) {
    const groups = [];

    list.forEach((work) => {
        const label = work.category || "Works";
        let group = groups.find((item) => item.label === label);

        if (!group) {
            group = { label, items: [] };
            groups.push(group);
        }

        group.items.push(work);
    });

    if (groups.length <= 1) {
        return renderWorksList(list, imagePrefix, detailPrefix);
    }

    return groups
        .map((group) => `<section class="works-category" aria-label="${escapeHtml(group.label)}">
    <h${headingLevel} class="works-category-title">${escapeHtml(group.label)}</h${headingLevel}>
${indent(renderWorksList(group.items, imagePrefix, detailPrefix, headingLevel + 1), 4)}
</section>`)
        .join("\n\n");
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
        .split(/\n[ \t]*\n/)
        .map((block) => {
            const lines = block.split("\n").map((line) => line.trim());
            const heading = lines.length === 1 && lines[0].match(/^(#{2,6})\s+(.+)$/);

            if (heading) {
                const level = heading[1].length;
                return `<h${level}>${escapeHtml(heading[2])}</h${level}>`;
            }

            const note = lines.length === 1 && lines[0].match(/^_(.+)_$/);

            if (note) {
                return `<p class="work-note">${escapeHtml(note[1])}</p>`;
            }

            return `<p>${lines.map(escapeHtml).join("<br>\n")}</p>`;
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

    if (Array.isArray(work.aiTools) && work.aiTools.length > 0) {
        specs.push({
            term: "使用したAI",
            description: work.aiTools.join(" / "),
        });
    }

    return `<dl>
${indent(specs.map((spec) => `<div>
    <dt>${escapeHtml(spec.term)}</dt>
    <dd>${escapeHtml(spec.description)}</dd>
</div>`).join("\n"), 4)}
</dl>`;
}

function getDetailLinks(work) {
    const links = [];
    const seen = new Set();

    function addLink(link) {
        if (!link || !link.href) {
            return;
        }

        const key = `${link.href}\n${link.label || ""}`;

        if (seen.has(key)) {
            return;
        }

        seen.add(key);
        links.push(link);
    }

    if (Array.isArray(work.links)) {
        work.links.forEach(addLink);
    }

    if (Array.isArray(work.detail.links)) {
        work.detail.links.forEach(addLink);
    }

    return links;
}

function renderDetailLinks(work) {
    const detailLinks = getDetailLinks(work);

    if (detailLinks.length === 0) {
        return "";
    }

    const links = detailLinks.map((link) => {
        const externalAttributes = link.external ? ' target="_blank" rel="noopener noreferrer"' : "";

        return `<a href="${escapeHtml(link.href)}" class="works-detail"${externalAttributes}>${escapeHtml(link.label)}${arrowSvg}</a>`;
    });

    return `\n<div class="work-detail-links">\n${indent(links.join("\n"), 4)}\n</div>`;
}

function renderWorkDetailPage(work) {
    const detail = work.detail;
    // タグはタイトル下の1箇所にまとめて表示する（旧 primary / secondary を統合、重複は除去）。
    const detailTags = [...new Set([...(detail.primaryTags || []), ...(detail.secondaryTags || [])])];
    const desktopImage = work.images.desktop;
    const mobileImage = work.images.mobile;
    const workUrl = `${siteUrl}/works/${work.slug}/`;
    const markdown = readText(`content/works/${work.slug}.md`);
    // mobile画像が無い作品は詳細ページのメインビジュアルも1枚で描画する。
    const detailMediaHtml = mobileImage
        ? `<img src="../../assets/images/works/${escapeHtml(desktopImage.src)}" width="${desktopImage.width}" height="${desktopImage.height}" decoding="async" alt="${escapeHtml(detail.pageTitle)} デスクトップ表示">
                        <img src="../../assets/images/works/${escapeHtml(mobileImage.src)}" width="${mobileImage.width}" height="${mobileImage.height}" decoding="async" alt="${escapeHtml(detail.pageTitle)} モバイル表示">`
        : `<img src="../../assets/images/works/${escapeHtml(desktopImage.src)}" width="${desktopImage.width}" height="${desktopImage.height}" decoding="async" alt="${escapeHtml(detail.pageTitle)}">`;

    return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script>${themeScript}</script>
    <title>${escapeHtml(detail.pageTitle)} | Works | Yuki Portfolio</title>
    <meta name="author" content="内山 倖徳">
    <meta name="description" content="${escapeHtml(detail.metaDescription)}">
    <meta name="format-detection" content="telephone=no,email=no,address=no">
    <link rel="canonical" href="${escapeHtml(workUrl)}">
    ${renderIconLinks("../../")}

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
    <link href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@400;700&family=DotGothic16&family=Zen+Kaku+Gothic+New:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/yakuhanjp@4.1.1/dist/css/yakuhanjp.css">

    <link rel="stylesheet" href="../../assets/css/kiso.css">
    <link rel="stylesheet" href="../../assets/css/base.css">
    <link rel="stylesheet" href="../../assets/css/common.css">
    <link rel="stylesheet" href="../../assets/css/component.css">
    <link rel="stylesheet" href="../../assets/css/pages/work-detail.css">
    <script src="../../assets/js/header.js" defer></script>
    <script src="../../assets/js/loading.js" defer></script>
    <script src="../../assets/js/reveal.js" defer></script>
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
                        <h1>「${escapeHtml(detail.pageTitle)}」</h1>
                        ${indent(renderTagList(detailTags), 24).trimStart()}
                    </header>

                    <div class="work-detail-media">
                        ${detailMediaHtml}
                    </div>

                    <div class="work-detail-body">
                        <section class="work-detail-description">
                            ${indent(markdownToHtml(markdown), 28).trimStart()}
                        </section>

                        <aside class="work-detail-specs" aria-label="制作仕様">
                            ${indent(renderSpecs(work), 28).trimStart()}${indent(renderDetailLinks(work), 28)}
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
    // ホームは featured を付けた作品だけを表示（1件も無ければ安全のため全件）。
    const featuredWorks = works.filter((work) => work.featured);
    const homeWorks = featuredWorks.length ? featuredWorks : works;

    replaceGeneratedBlock("index.html", "works-list-home", renderWorksByCategory(homeWorks, "assets/images/works/", "works/", 3));
    replaceGeneratedBlock("index.html", "about-profile-home", renderAboutProfile("home", "assets/images/about/"));
    replaceGeneratedBlock("works/index.html", "works-list-index", renderWorksByCategory(works, "../assets/images/works/", ""));
    replaceGeneratedBlock("about.html", "about-profile-page", renderAboutProfile("page", "assets/images/about/"));

    works.forEach((work) => {
        writeText(`works/${work.slug}/index.html`, renderWorkDetailPage(work));
    });

    console.log(`Generated ${works.length} work detail pages and shared content blocks.`);
}

build();
