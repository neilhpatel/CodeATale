const openModalButton = document.querySelector('#bookmark-button');

const overlay = document.querySelector('#overlay');

openModalButton.addEventListener('click', () =>  {
    const modal = document.querySelector('#bookmark-modal');
    openModal(modal);
})

overlay.addEventListener('click', () => {
    const modal = document.querySelector('#bookmark-modal');
    closeModal(modal);
})

function openModal(modal) {
    if (modal == null) return;

    modal.classList.add('active');
    overlay.classList.add('active');
}

function closeModal(modal) {
    if (modal == null) return;

    modal.classList.remove('active');
    overlay.classList.remove('active');
}

// Chapter Select Buttons
const chapterButtons = document.querySelectorAll('.chapter-button')

chapterButtons.forEach(button => {
    button.addEventListener('click', () => {
        window.location.href = 'reading-page.html';
    })
});


