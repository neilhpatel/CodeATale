// This code only fires once per session and is just 
// here to setup chptNum and bookmarks in the sessionStorage.
if (!sessionStorage.getItem('firstLoad')) {
    sessionStorage.setItem('firstLoad', "1");
    sessionStorage.setItem('chptNum', '');
    sessionStorage.setItem('bookmarks', '');
}


// Chapter Select Buttons
const chapterButtons = document.querySelectorAll('.chapter-button')

chapterButtons.forEach(button => {
    button.addEventListener('click', () => {
        window.location.href = 'reading-page.html';
        let chptNum = parseInt(button.id);
        sessionStorage.setItem('chptNum', chptNum)
    })
});

