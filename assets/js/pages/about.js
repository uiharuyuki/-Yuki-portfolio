const skillTabs = document.querySelectorAll("[data-skill-tab]");
const skillPanels = document.querySelectorAll("[data-skill-panel]");

function activateSkillTab(tab, shouldFocus = false) {
    const target = tab.dataset.skillTab;

    skillTabs.forEach((currentTab) => {
        const isActive = currentTab === tab;
        currentTab.classList.toggle("is-active", isActive);
        currentTab.setAttribute("aria-selected", String(isActive));
        currentTab.tabIndex = isActive ? 0 : -1;
    });

    skillPanels.forEach((panel) => {
        panel.hidden = panel.dataset.skillPanel !== target;
    });

    if (shouldFocus) {
        tab.focus();
    }
}

skillTabs.forEach((tab, index) => {
    tab.tabIndex = tab.classList.contains("is-active") ? 0 : -1;

    tab.addEventListener("click", () => {
        activateSkillTab(tab);
    });

    tab.addEventListener("keydown", (event) => {
        const lastIndex = skillTabs.length - 1;
        let nextIndex = index;

        if (event.key === "ArrowRight") {
            nextIndex = index === lastIndex ? 0 : index + 1;
        } else if (event.key === "ArrowLeft") {
            nextIndex = index === 0 ? lastIndex : index - 1;
        } else if (event.key === "Home") {
            nextIndex = 0;
        } else if (event.key === "End") {
            nextIndex = lastIndex;
        } else {
            return;
        }

        event.preventDefault();
        activateSkillTab(skillTabs[nextIndex], true);
    });
});
