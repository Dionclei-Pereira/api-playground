document.addEventListener('DOMContentLoaded', async () => {
    await loadFooter();
});

const loadFooter = async () => {
    const githubBadge: HTMLImageElement = document.getElementById('github') as HTMLImageElement;
    githubBadge.addEventListener('click', () => {
        window.location.href = 'https://github.com/Dionclei-Pereira/api-playground';
    });
}