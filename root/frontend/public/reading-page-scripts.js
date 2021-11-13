let pageNum = 1;

window.addEventListener('load', () => {
    document.querySelector('#reading-heading').innerHTML = sessionStorage.getItem('chptNum');
})

const changePageText = (num) => {
    document.querySelector('.main-text').innerHTML += ' |Temp Text For Page| ' + pageNum;
}

const nextPage = document.querySelector('#prevPg');

nextPage.addEventListener('click', () => {
    if (pageNum === 1) return;
    pageNum--;
    changePageTitle('Chapter ' + pageNum);
    changePageText(pageNum);
})

const prevPage = document.querySelector('#nextPg');

prevPage.addEventListener('click', () => {
    pageNum++;
    changePageTitle('Chapter ' + pageNum);
    changePageText(pageNum);
})

const changePageTitle = (newTitle) => {
    let header = document.querySelector('#reading-heading');
    header.innerHTML = newTitle;
}