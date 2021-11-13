// Navigation bar custom element
class Navbar extends HTMLElement {
    connectedCallback() {
        setTimeout(() => console.log());
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
        this.querySelector('nav #home-i').onclick = (evt) => {
            window.location.href = 'index.html';
        };     
    }
}
customElements.define('left-navbar', Navbar)

// Bookmark custom element
class Bookmark extends HTMLElement {
    connectedCallback() {
        setTimeout(() => console.log());
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
        
        const openModalButton = this.querySelector('#bookmark-button');

        const overlay = this.querySelector('#overlay');

        openModalButton.onclick = (evt) =>  {
            const modal = this.querySelector('#bookmark-modal');
            openModal(modal);
        };

        overlay.onclick = (evt) => {
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
