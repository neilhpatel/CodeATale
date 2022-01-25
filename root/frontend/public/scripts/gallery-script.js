$("document").ready(function() {
    let num = sessionStorage.getItem("chptNum"); // Gets corresponding chapter

    $("#gal-header").text(`Chapter ${num} Pictures`); // Sets the header to the chapter number

    // Loops 3 times (this can result in errors since there might be less than 3 images)
    // Also there might be more than 3 images and those images won't get shown
    let i = 1;
    while (i < 4) {
        // Creates a new div element with an image inside (the div is needed)
        let newImg = $(`
        <div class="slide">
            <img class="gal-img" src="../../assets/Dr.DolittlePictures/Ch. ${num}/img${num}_${i}.jpg">
        </div>
        `);
        $(".slideshow").append(newImg);
        i++;
    }

    // Modify the slidshow settings here
    $(".slideshow").slick({
        prevArrow: "<i class='fas fa-arrow-left prevArrowBtn'></i>",
        nextArrow: "<i class=fas fa-arrow-right nextArrowBtn'></i>"
    });
});
