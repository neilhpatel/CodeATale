import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2lfp2oGwlyluipIjXCt0ueQKXkq_UudA",
  authDomain: "junior-design-178a4.firebaseapp.com",
  databaseURL: "https://junior-design-178a4-default-rtdb.firebaseio.com",
  projectId: "junior-design-178a4",
  storageBucket: "junior-design-178a4.appspot.com",
  messagingSenderId: "503927178988",
  appId: "1:503927178988:web:343b4404b93c44c24787c9",
  measurementId: "G-SVL212L9YP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const username = "mtl10";
const userRef = doc(db, "Users", username);

// =============================
// Navigation bar custom element
// =============================
class Navbar extends HTMLElement {
    constructor() {
        super();

        // Create the HTML for the element
        this.innerHTML = `
        <nav id="navbar">
            <i class="fas fa-home" id="home-i" title="Home" style="padding-top: 40px"></i>
            <hr class="line">
            <i class="fas fa-arrow-alt-circle-left" id="back-i" title="Back"></i>
            <i class="fa-solid fa-pen-to-square" id="review-i" title="Review"></i>
            <i class="far fa-lightbulb" id="quiz-i" title="Quiz"></i>
        </nav>
        `;

        // Add click effects
        $("nav #home-i").click(function() {
            setTimeout(() => {window.location.href = "index.html";}, 250); 
        });
        $("nav #back-i").click(function() {
            history.back();
        });
        $("nav #quiz-i").click(function() {
            setTimeout(() => {window.location.href = "quiz.html";}, 250); 
        });
        $("nav #review-i").click(function() {
            setTimeout(() => {window.location.href = "review.html";}, 250); 
        });
    }
}
customElements.define("left-navbar", Navbar);

// =============================
// Bookmark custom element
// =============================
class Bookmark extends HTMLElement {
    constructor() {
        super();

        // Create the HTML for the element
        this.innerHTML = `
            <section class="bookmark">
                <button type="button" class="fas fa-bookmark" id="bookmark-button" title="Bookmark"></button>
                <div id="bookmark-modal-container">
                    <p class="bookmark-header">Select Bookmark</p>
                    <button type="button" id="add-bookmark">Add Page</button>
                    <div class="bookmark-list"></div>
                </div>
            </section>
        `;
        

        // Create a new bookmark element for a given chapter
        async function appendBookmark(chapterNum, pageNum) {
            const newBookMarkDel = $(document.createElement("button"));
            const newBookMark = $(document.createElement("button"));
            
            newBookMark.html("Chapter " + chapterNum);
            newBookMark.attr("class", "newBookmark");
            newBookMark.attr("type", "button");
            newBookMark.attr("id", "ch" + chapterNum);
            
            newBookMark.click(() => {
                sessionStorage.setItem("chptNum", chapterNum);
                sessionStorage.setItem("pageNum", pageNum);
                window.location.href = "reading-page.html";
            });

            newBookMarkDel.html("x");
            newBookMarkDel.attr("type", "button");
            newBookMarkDel.attr("class", "bookmarkDel");

            // Removes the bookmark from the list of bookmarks when the X is clicked
            // (this list pervents the user from making multiple bookmarks for the same page)
            newBookMarkDel.click(async () => {
                newBookMark.remove();
                newBookMarkDel.remove();
                let userSnap = await getDoc(userRef);
                let bookmarkList = userSnap.data().bookmarkList.split(" ");
                // const bookmarkList = sessionStorage.getItem("bookmarks").split(" ");
                let newBookmarkList = "";
                bookmarkList.forEach((bm) => {
                    if (!(bm === chapterNum + "-" + pageNum)) {
                        newBookmarkList += bm + " ";
                    }
                });
                await updateDoc(userRef, {
                    bookmarkList: newBookmarkList
                  });
                // sessionStorage.setItem("bookmarks", newBookmarkList);
            });

            const bookmarkModal = $(".bookmark-list");

            bookmarkModal.append(newBookMark);
            bookmarkModal.append(newBookMarkDel);
            
            const pageNumText = $(document.createElement("span"));
            pageNumText.html("Page " + pageNum);
            
            newBookMark.append(pageNumText);
        }

        // Look through the database storage to see which bookmarks
        // the user has added.
        async function populateBookmarks() {
            let userSnap = await getDoc(userRef);
            let remoteBookmarks = userSnap.data().bookmarkList;
            // Note: window.location.href will give you the complete url not just "index.html"
            // The - 10 comes from the fact that "index.html" is 10 characters long
            if (window.location.href.substring(window.location.href.length - 10, window.location.href.length) === "index.html") {
                $("#add-bookmark").hide();
            }

            // This should be a string of the format "1 2 3 4"
            let bookmarkList = remoteBookmarks.split(" ");
            bookmarkList.forEach((bm) => {
                if (bm !== null && typeof bm !== "undefined" && bm !== false && bm !== "") {
                    let chapterPage = bm.split("-");
                    appendBookmark(chapterPage[0], chapterPage[1]);
                }
            });
        }
        
        // List of chapter numbers
        populateBookmarks();

        async function addBookmarkHelper(alreadyAdded, onReadingPage) {
            
            if (alreadyAdded === false && onReadingPage === true) {
                let currBookMarks;
                let userSnap = await getDoc(userRef);
                let bookmarkList = userSnap.data().bookmarkList;
                if (bookmarkList) { // If there have been any bookmarks added 
                    if (!bookmarkList.includes(sessionStorage.getItem("chptNum") + "-" + sessionStorage.getItem("pageNum"))) {
                        currBookMarks = bookmarkList + " " + sessionStorage.getItem("chptNum") + "-" + sessionStorage.getItem("pageNum");
                    } else {
                        currBookMarks = bookmarkList;
                    }
                } else { // If this is the first bookmark to be added
                    currBookMarks = sessionStorage.getItem("chptNum") + "-" + sessionStorage.getItem("pageNum");
                }
                await updateDoc(userRef, {
                    bookmarkList: currBookMarks
                  });
                // sessionStorage.setItem("bookmarks", currBookMarks);

                appendBookmark(sessionStorage.getItem("chptNum"), sessionStorage.getItem("pageNum"));
            }
        }

        // onClick effect for adding a bookmark
        const addBookmark = $("#add-bookmark");
        addBookmark.click(async function() {
            let alreadyAdded = false;
            let onReadingPage = false;
            let userSnap = await getDoc(userRef);
            let bookmarkList = userSnap.data().bookmarkList.split(" ");
            // let bookmarkList = sessionStorage.getItem("bookmarks").split(" ");
            bookmarkList.forEach((bm) => {
                // Check if it is already in the list
                if (bm === sessionStorage.getItem("chptNum") + "-" + sessionStorage.getItem("pageNum")) {
                    alreadyAdded = true;
                }
            });
            if (window.location.href.substring(window.location.href.length - 17, window.location.href.length) === "reading-page.html") {
                onReadingPage = true;
            }
            addBookmarkHelper(alreadyAdded, onReadingPage);
        });

        // Popup modal to display the bookmark
        let modal = $("#bookmark-modal-container").plainModal({ duration: 150, offset: () => {
                // Fit the position to a button.
                var btnOffset = $("#bookmark-button").offset(), win = $(window);
                return {
                    left: btnOffset.left - $("#bookmark-modal-container").width()/4,
                    top: btnOffset.top + $("#bookmark-modal-container").height()/3
                };
            } 
        });
            
        $("#bookmark-button").click(function () {
            modal = $("#bookmark-modal-container").plainModal("open");
        });
    }
}
customElements.define("book-mark", Bookmark);
