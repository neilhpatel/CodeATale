
$("#quiz").quiz({
  counter: false,

  // Questions are indexed from 0
  questions: [
    {
      "q": "Definition 1",
      "options": [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4"
      ],
      "correctIndex": 0,
      "correctResponse": "Correct!",
      "incorrectResponse": "Incorrect!",
    },
    {
      "q": "Definition 2",
      "options": [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4"
      ],
      "correctIndex": 1,
      "correctResponse": "Correct!",
      "incorrectResponse": "Incorrect!",
    }
  ]
});

let modal = $("#modal").plainModal({ duration: 150 }); // The number refers to the time to fade in
async function defModal() {
  $("#modal-text").html("<p>Each time you answer the question correctly for a given word you gain a <span class='gold'>gold star</span>. If you get a question wrong all <span class='gold'>gold stars</span> become <span class='silver'>silver</span>. If you correctly answer the quiz for <b>this word</b> 5 times in a row you get the maximum number of stars (5).</p>");
  modal = $("#modal").plainModal("open");
}

$("#help-btn").click(function () {
  setTimeout(() => {defModal();}, 50);
});
