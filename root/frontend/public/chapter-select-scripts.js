// Chapter Select Buttons
const chapterButtons = document.querySelectorAll('.chapter-button')

chapterButtons.forEach(button => {
    button.addEventListener('click', () => {
        window.location.href = 'reading-page.html';
        chptNum = button.nextElementSibling.innerText;
        sessionStorage.setItem('chptNum', chptNum)
    })
});

