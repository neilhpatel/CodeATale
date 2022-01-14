// This code only fires once per session and is just 
// here to setup chptNum and bookmarks in the sessionStorage.
if (!sessionStorage.getItem('firstLoad')) {
    sessionStorage.setItem('firstLoad', "1");
    sessionStorage.setItem('chptNum', '');
    sessionStorage.setItem('bookmarks', '');
}

// Chapter Select Buttons
const chapterButtons = $(".chapter-button");

chapterButtons.each(function(i) {
    $(this).click(function() {
        let chptNum = parseInt($(this).attr("id"));
        sessionStorage.setItem("chptNum", chptNum);
        window.location.href = "reading-page.html";
    })
})