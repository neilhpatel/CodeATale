import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-analytics.js";
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc, getDocs, where, query, increment} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";
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
const analytics = getAnalytics(app);
const db = getFirestore(app);

// This code only fires once per session and is just 
// here to setup chapterNum and bookmarks in the sessionStorage.
// This will reset session storage information.
if (!sessionStorage.getItem("firstLoad")) {
    sessionStorage.setItem("firstLoad", "1");
    sessionStorage.setItem("chptNum", "");
    sessionStorage.setItem("bookmarks", "");
    sessionStorage.setItem("pageNum", "");
}

const username = "mtl10";

async function checkAccount() {
    let dummyQueue = [];
    let dummyArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let dummyStringArray = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
    let dummyBookmarkList = "";
    let userDoc = await getDoc(doc(db, "Users", username));
    if (!userDoc.exists()) {
        await setDoc(doc(db, "Users", username), {
            queue: dummyQueue,
            chapterProgress: dummyArray,
            pagesViewed: dummyStringArray,
            bookmarkList: dummyBookmarkList
        });
        await setDoc(doc(db, "Users", username, "wordBank", "placeholder"), {
            dummyData: true
        });
    }
}

await checkAccount();

let userRef = doc(db, "Users", username);

let userSnap = await getDoc(userRef);
let chapterProgressArray = userSnap.data().chapterProgress;

let chptArr = [
"Puddleby",

"Animal Language",

"More Money Troubles",

"A Message from Africa",

"The Great Journey",

"Polynesia and the King",

"The Bridge of Apes",

"The Leader of the Lions",
 
"The Monkeys' Council",

"The Rarest Animal of All",

"The Black Prince",

"Medicine and Magic",

"Red Sails and Blue Wings",

"The Rats' Warning",

"The Barbary Dragon",

"Too-Too, The Listener",

"The Ocean Gossips",

"Smells",

"The Rock",

"The Fisherman's Town",

"Home Again"
];

let chapterStartPageNumber = [1, 7, 24, 34, 46, 58, 69, 84, 93, 102, 114, 125, 142, 150, 159, 172, 181, 192, 209, 222, 233, 240];

// Loop for each chapter and create a chapter-box component
for (let i = 1; i <= 21; i++) {
    let chapterProgress = chapterProgressArray[i];
    
    // ~~ Converts a float into an int by flipping the bits twice
    let percentComplete = ~~ (100 * (chapterProgress  / (chapterStartPageNumber[parseInt(i, 10)] - chapterStartPageNumber[parseInt(i-1, 10)])));
    
    let newChapter = $(`
    <section class="chapter-box">
        <button class="chapter-button" id="${i}">${chptArr[i-1]}</button>
        <button class="img-button" id="${i}" title="Pictures">
            <i class="fa-solid fa-image img-button-icon"></i>
        </button>

        <p>Chapter ${i}</p>
        <div class="progress-bar" title="Chapter Progress">
            <div class="progress" id="chp${i}-prog" style="width: ${percentComplete}%"></div>
        </div>
        <p class="progress-num percent${percentComplete}">${percentComplete}%</p>
    </section>
    `);

    $("#selboxes").append(newChapter);
}

// Chapter Select Buttons
const chapterButtons = $(".chapter-button");

// Add click functionality for each chapter select button
chapterButtons.each(function(i) {
    $(this).click(function() {
        let chapterNum = parseInt($(this).attr("id"), 10);
        
        sessionStorage.setItem("chptNum", chapterNum);
        sessionStorage.setItem("pageNum", chapterStartPageNumber[chapterNum - 1]); // Chapters are indexed from 0
        setTimeout(() => {window.location.href = "reading-page.html";}, 250); // Adds a delay so the button can be seen being pressed down
        
    });
});

// Chapter Image Buttons
const imgButtons = $(".img-button");

// Add click functionality for each gallery button
imgButtons.each(function(i) {
    $(this).click(function() {
        let chapterNum = parseInt($(this).attr("id"), 10);
        sessionStorage.setItem("chptNum", chapterNum);
        window.location.href = "gallery.html";
    });
});


