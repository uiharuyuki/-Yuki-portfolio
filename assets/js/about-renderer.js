function appendAboutLines(paragraph, lines) {
    lines.forEach((line, index) => {
        if (index > 0) {
            paragraph.appendChild(document.createElement("br"));
        }

        paragraph.appendChild(document.createTextNode(line));
    });
}

function renderAboutProfiles() {
    if (!window.YUKI_ABOUT) {
        return;
    }

    document.querySelectorAll("[data-about-profile]").forEach((profile) => {
        const imagePrefix = profile.hasAttribute("data-image-prefix") ? profile.getAttribute("data-image-prefix") : "assets/images/about/";
        const imageMount = profile.querySelector("[data-about-image]");
        const name = profile.querySelector("[data-about-name]");
        const body = profile.querySelector("[data-about-body]");

        if (imageMount) {
            const image = imageMount.matches("img") ? imageMount : document.createElement("img");

            image.src = imagePrefix + window.YUKI_ABOUT.image.src;
            image.width = window.YUKI_ABOUT.image.width;
            image.height = window.YUKI_ABOUT.image.height;
            image.alt = window.YUKI_ABOUT.image.alt;
            image.loading = "lazy";
            image.decoding = "async";

            if (image !== imageMount) {
                imageMount.replaceChildren(image);
            }
        }

        if (name) {
            name.textContent = window.YUKI_ABOUT.name;
        }

        if (body) {
            body.replaceChildren();
            appendAboutLines(body, window.YUKI_ABOUT.profile);
        }
    });
}

document.addEventListener("DOMContentLoaded", renderAboutProfiles);
