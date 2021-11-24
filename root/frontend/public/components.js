// Navigation bar custom element
class Navbar extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = `
        <nav id='navbar'>
            <i class="fas fa-home" id='home-i'></i>
            <hr class="line">
            <i class="fas fa-arrow-alt-circle-left" id='back-i'></i>
            <i class="fas fa-brain"></i>
            <i class="far fa-lightbulb" id='quiz-i'></i>
            <i class="fas fa-sign-out-alt" id='exit-i'></i>
        </nav>
        `;
        this.querySelector('nav #home-i').onclick = () => {
            window.location.href = 'index.html';
        };
        this.querySelector('nav #back-i').onclick = () => {
            history.back();
        };
    }
}
customElements.define('left-navbar', Navbar)

// Bookmark custom element
class Bookmark extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = `
            <section class='bookmark'>
                <div id='overlay'></div>
                <button type='button' class="fas fa-bookmark" id='bookmark-button'></button>
                <div class='modal' id='bookmark-modal'>
                    Select Bookmark
                    <button type='button' id='add-bookmark'>Add Page</button>
                </div>
            </section>
        `;
        
        populateBookmarks(sessionStorage.getItem('bookmarks'));

        // Look through the local storage to see which bookmarks
        // the user has added.
        function populateBookmarks(localBookmarks) {
            // This should be a string of the format "1 2 3 4"
            let bookmarkList = localBookmarks.split(' ');
            bookmarkList.forEach(bm => {
                if (bm != null && bm != undefined && bm != false) {
                    appendBookmark(bm);
                }
            });
        }

        // Create a new bookmark element for a given chapter
        function appendBookmark(bm) {
            const newBookMark = document.createElement('button');
            newBookMark.innerHTML = 'Chapter ' + bm;
            newBookMark.setAttribute('class', 'newBookmark');
            newBookMark.setAttribute('type', 'button');
            newBookMark.setAttribute('id', 'ch' + bm);
            
            newBookMark.onclick = () => {
                sessionStorage.setItem('chptNum', bm);
                window.location.href = 'reading-page.html';
            };
            const bookmarkModal = document.querySelector('#bookmark-modal');

            bookmarkModal.appendChild(newBookMark);
        }

        // onClick effect for adding a bookmark
        const addBookmark = this.querySelector('#add-bookmark');
        addBookmark.onclick = () => {
            let alreadyAdded = false;
            let onReadingPage = false;
            let bookmarkList = sessionStorage.getItem('bookmarks').split(' ');
            bookmarkList.forEach(bm => {
                // Check if it is already in the list
                if (bm === sessionStorage.getItem('chptNum')) {
                    alreadyAdded = true;
                }
            });
            if (window.location.href.substring(window.location.href.length - 17, window.location.href.length) == "reading-page.html") {
                onReadingPage = true;
            }
            if (alreadyAdded === false && onReadingPage === true) {
                let currBookMarks;
                if (sessionStorage.getItem('bookmarks')) { // If there have been any bookmarks added 
                    currBookMarks = sessionStorage.getItem('bookmarks') + ' ' + sessionStorage.getItem('chptNum');
                } else { // If this is the first bookmark to be added
                    currBookMarks = sessionStorage.getItem('chptNum');
                }
                sessionStorage.setItem('bookmarks', currBookMarks);

                appendBookmark(sessionStorage.getItem('chptNum'));
            }
        };

        // Handleing the modal functionality
        const openModalButton = this.querySelector('#bookmark-button');

        const overlay = this.querySelector('#overlay');

        openModalButton.onmousedown = () =>  {
            const modal = this.querySelector('#bookmark-modal');
            openModal(modal);
        };

        overlay.onclick = () => {
            const modal = this.querySelector('#bookmark-modal');
            closeModal(modal);
        };

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
    }
}
customElements.define('book-mark', Bookmark);
