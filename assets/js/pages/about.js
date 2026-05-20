const skillTabs = document.querySelectorAll("[data-skill-tab]");
const skillPanels = document.querySelectorAll("[data-skill-panel]");

skillTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        const target = tab.dataset.skillTab;

        skillTabs.forEach((currentTab) => {
            const isActive = currentTab === tab;
            currentTab.classList.toggle("is-active", isActive);
            currentTab.setAttribute("aria-selected", String(isActive));
        });

        skillPanels.forEach((panel) => {
            panel.hidden = panel.dataset.skillPanel !== target;
        });
    });
});
