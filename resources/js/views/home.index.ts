document.addEventListener('DOMContentLoaded', async () => {
    await loadFooter();
});

const loadFooter = async () => {
    const githubBadge: HTMLImageElement = document.getElementById('github') as HTMLImageElement;
    const url: string | undefined = githubBadge.dataset.url;
    if (!url) return;
    
    githubBadge.addEventListener('click', () => {
        window.location.href = url;
    });
}