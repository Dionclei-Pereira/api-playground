document.addEventListener('DOMContentLoaded', async (): Promise<void> => {
    loadFooter();
});

const loadFooter = (): void => {
    const githubBadge = document.getElementById('github');
    if (!(githubBadge instanceof HTMLImageElement)) return;

    const url = githubBadge.dataset.url;
    if (!url) return;

    githubBadge.addEventListener('click', () => {
        window.location.href = url;
    });
};