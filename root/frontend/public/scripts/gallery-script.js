$("document").ready(function() {
    let num = sessionStorage.getItem("chptNum"); // Gets corresponding chapter
    const numOfImages = new Map(); // Hardcoding the number of images per chapter to a map
    const captions = new Map(); // Hardcoding the captions of every image
    
    // The order for .set is .set("chapterNum", "Number of Images")
    numOfImages.set(1, 2);
    numOfImages.set(2, 3);
    numOfImages.set(3, 4);
    numOfImages.set(4, 3);
    numOfImages.set(5, 3);
    numOfImages.set(6, 3);
    numOfImages.set(7, 3);
    numOfImages.set(8, 3);
    numOfImages.set(9, 2);
    numOfImages.set(10, 2);
    numOfImages.set(11, 2);
    numOfImages.set(12, 2);
    numOfImages.set(13, 2);
    numOfImages.set(14, 2);
    numOfImages.set(15, 2);
    numOfImages.set(16, 2);
    numOfImages.set(17, 1);
    numOfImages.set(18, 2);
    numOfImages.set(19, 2);
    numOfImages.set(20, 2);
    numOfImages.set(21, 4);

    captions.set("img1_2", "“And she never came to see him any more”");
    captions.set("img2_2", "“He could see as well as ever”");
    captions.set("img2_3", "“They came at once to his house on the edge of the town”");
    captions.set("img3_2", "“They used to sit in chairs on the lawn”");
    captions.set("img3_3", "“‘All right,’ said the Doctor, ‘go and get married’”");
    captions.set("img3_4", "“One evening when the Doctor was asleep in his chair”");
    captions.set("img4_2", "“‘I felt sure there was twopence left’”");
    captions.set("img4_3", "“And the voyage began”");
    captions.set("img5_2", "“‘We must have run into Africa’”");
    captions.set("img5_3", "“‘I got into it because I did not want to be drowned’”");
    captions.set("img6_2", "“And Queen Amina was asleep”");
    captions.set("img6_3", "“‘Who’s that?’”");
    captions.set("img7_2", "“Cheering and waving leaves and swinging out of the branches to greet him”");
    captions.set("img7_3", "“John Dolittle was the last to cross”");
    captions.set("img8_2", "“He made all the monkeys who were still well come and be vaccinated”");
    captions.set("img8_3", "“‘ME, the King of Beasts, to wait on a lot of dirty monkeys?’”");
    captions.set("img9_2", "“Then the Grand Gorilla got up”");
    captions.set("img10_2", "“‘Lord save us!’ cried the duck. ‘How does it make up its mind?’”");
    captions.set("img11_2", "“He began reading the fairy-stories to himself”");
    captions.set("img12_2", "“Crying bitterly and waving till the ship was out of sight”");
    captions.set("img13_2", "“‘They are surely the pirates of Barbary’”");
    captions.set("img14_2", "“‘And you have heard that rats always leave a sinking ship?’”");
    captions.set("img15_2", "“‘Look here, Ben Ali—’”");
    captions.set("img16_2", "“‘Sh!—Listen!—I do believe there’s some one in there!’”");
    captions.set("img18_2", "“‘You stupid piece of warm bacon!’”");
    captions.set("img19_2", "“‘Doctor!’ he cried. ‘I’ve got it!’”");
    captions.set("img20_2", "“And she kissed the Doctor many times”");
    captions.set("img21_2", "“The Doctor sat in a chair in front”");
    captions.set("img21_3", "“He began running round the garden like a crazy thing”");

    // Header
    $("#gal-header").text(`Chapter ${num} Pictures`);

    let i = 1;
    while (i < numOfImages.get(parseInt(sessionStorage.getItem("chptNum"), 10)) + 1) {
        // Creates a new div element with an image inside (the div is needed)
        // Checks to see if there is a caption for an image and shows no text if there is no caption
        let newImg = $(`
        <div class="slide">
            <img class="gal-img" src="../../assets/Dr.DolittlePictures/Ch. ${num}/img${num}_${i}.jpg">
            <div style="text-align: center; font-size:5em">${captions.has("img" + num + "_" + i) ? captions.get("img" + num + "_" + i) : ""}</div>
        </div>
        `);
        $(".slideshow").append(newImg);
        i++;
    }

    // Modify the slidshow settings here
    $(".slideshow").slick({
        // Adds next and previous transition arrows
        arrows: true,
        prevArrow: "<i class='fas fa-arrow-left prevArrowBtn' title='Previous Picture'></i>",
        nextArrow: "<i class='fas fa-arrow-right nextArrowBtn' title='Next Picture'></i>",
    });
});
