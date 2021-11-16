// Chapter Select Buttons
const chapterButtons = document.querySelectorAll('.chapter-button')

chapterButtons.forEach(button => {
    button.addEventListener('click', () => {
        window.location.href = 'reading-page.html';
        let chptNum = parseInt(button.id);
        sessionStorage.setItem('chptNum', chptNum);
    })
});

