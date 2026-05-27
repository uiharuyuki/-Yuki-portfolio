const WORKS_ARROW_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>`;

function createElement(tagName, options = {}) {
    const element = document.createElement(tagName);

    if (options.className) {
        element.className = options.className;
    }

    if (options.text) {
        element.textContent = options.text;
    }

    if (options.attributes) {
        Object.entries(options.attributes).forEach(([name, value]) => {
            element.setAttribute(name, value);
        });
    }

    return element;
}

function appendDescriptionLines(paragraph, lines) {
    lines.forEach((line, index) => {
        if (index > 0) {
            paragraph.appendChild(document.createElement("br"));
        }

        paragraph.appendChild(document.createTextNode(line));
    });
}

function createWorksImage(imagePrefix, image) {
    return createElement("img", {
        attributes: {
            src: imagePrefix + image.src,
            width: image.width,
            height: image.height,
            loading: "lazy",
            decoding: "async",
            alt: "",
        },
    });
}

function createWorksLink(link, work, detailPrefix) {
    const href = link.type === "detail" ? `${detailPrefix}${work.slug}/` : link.href;
    const anchor = createElement("a", {
        className: "works-detail",
        text: link.label,
        attributes: {
            href,
        },
    });

    if (link.external) {
        anchor.setAttribute("target", "_blank");
        anchor.setAttribute("rel", "noopener noreferrer");
    }

    anchor.insertAdjacentHTML("beforeend", WORKS_ARROW_SVG);
    return anchor;
}

function createWorksCard(work, options) {
    const article = createElement("article", { className: "works-card" });
    const media = createElement("div", {
        className: "works-media",
        attributes: {
            "aria-hidden": "true",
        },
    });
    const content = createElement("div", { className: "works-content" });
    const genre = createElement("p", {
        className: "works-genre",
        text: work.genre,
    });
    const title = createElement("h3", { text: work.title });
    const meta = createElement("dl", { className: "works-meta" });
    const metaRow = createElement("div");
    const metaTerm = createElement("dt", { text: "使用技術" });
    const metaDescription = createElement("dd", { text: work.technologies });
    const paragraph = createElement("p");
    const links = work.links.map((link) => createWorksLink(link, work, options.detailPrefix));

    media.appendChild(createWorksImage(options.imagePrefix, work.images.desktop));
    media.appendChild(createWorksImage(options.imagePrefix, work.images.mobile));

    metaRow.appendChild(metaTerm);
    metaRow.appendChild(metaDescription);
    meta.appendChild(metaRow);

    appendDescriptionLines(paragraph, work.description);

    content.appendChild(genre);
    content.appendChild(title);
    content.appendChild(meta);
    content.appendChild(paragraph);

    if (links.length > 1) {
        const linksWrapper = createElement("div", { className: "works-links" });
        links.forEach((link) => linksWrapper.appendChild(link));
        content.appendChild(linksWrapper);
    } else {
        content.appendChild(links[0]);
    }

    article.appendChild(media);
    article.appendChild(content);
    return article;
}

function renderWorksLists() {
    if (!Array.isArray(window.YUKI_WORKS)) {
        return;
    }

    document.querySelectorAll("[data-works-list]").forEach((list) => {
        const imagePrefix = list.hasAttribute("data-image-prefix") ? list.getAttribute("data-image-prefix") : "assets/images/works/";
        const detailPrefix = list.hasAttribute("data-detail-prefix") ? list.getAttribute("data-detail-prefix") : "works/";

        list.replaceChildren(...window.YUKI_WORKS.map((work) => createWorksCard(work, {
            imagePrefix,
            detailPrefix,
        })));
    });
}

document.addEventListener("DOMContentLoaded", renderWorksLists);
