// When the reading screen's scripts get run this will update the chapter title
document.querySelector('#reading-heading').innerHTML = 'Chapter ' + sessionStorage.getItem('chptNum');


const nextPage = document.querySelector('#prevPg');
nextPage.addEventListener('click', () => {
    let num = sessionStorage.getItem('chptNum')
    if (num <= 1) return;
    num =  parseInt(num) - 1;
    changePageTitle('Chapter ' + num);
    changePageText(num);
    sessionStorage.setItem('chptNum', num);
})

const prevPage = document.querySelector('#nextPg');
prevPage.addEventListener('click', () => {
    let num = sessionStorage.getItem('chptNum')
    num = parseInt(num) + 1;
    changePageTitle('Chapter ' + num);
    changePageText(num);
    sessionStorage.setItem('chptNum', num);
})

const changePageTitle = (newTitle) => {
    let header = document.querySelector('#reading-heading');
    header.innerHTML = newTitle;
}

const changePageText = (num) => {
    document.querySelector('.main-text').innerHTML += ' |Temp Text For Page| ' + num;
}