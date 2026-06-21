document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.nav-btn');
    const iframe = document.getElementById('app-frame');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));

            button.classList.add('active');

            const targetApp = button.getAttribute('data-target');
            iframe.src = targetApp;
        })
    })
});