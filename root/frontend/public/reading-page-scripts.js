window.addEventListener('load', () => {
    document.querySelector('#reading-heading').innerHTML = 'Chapter ' + sessionStorage.getItem('chptNum');
    document.querySelector("img").src = "../assets/chapter_images/chapter" + sessionStorage.getItem("chpNum") + ".png";
})

const nextPage = document.querySelector('#prevPg');
nextPage.addEventListener('click', () => {
    let num = sessionStorage.getItem('chptNum')
    if (num == 1) return;
    num =  parseInt(num) - 1;
    addImage("../assets/chapter_images/chapter" + num + ".png");
    changePageTitle('Chapter ' + num);
    sessionStorage.setItem('chptNum', num);
})

const prevPage = document.querySelector('#nextPg');
prevPage.addEventListener('click', () => {
    let num = sessionStorage.getItem('chptNum')
    if (num == 21) return;
    num = parseInt(num) + 1;
    addImage("../assets/chapter_images/chapter" + num + ".png");
    changePageTitle('Chapter ' + num);
    sessionStorage.setItem('chptNum', num);
})

const changePageTitle = (newTitle) => {
    let header = document.querySelector('#reading-heading');
    header.innerHTML = newTitle;
}

const changePageText = (num) => {
    document.querySelector('.main-text').innerHTML += ' |Temp Text For Page| ' + num;
}

const addImage = (srcPath) => {
    document.querySelector('img').src = srcPath;
}