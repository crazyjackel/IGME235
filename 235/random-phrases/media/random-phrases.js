"use strict";

let phrases = [
    "Nothing is easier than to have good intentions but, without an understanding of how an economy works, good intentions can lead to counterproductive, or even disastrous, consequences for a whole nation.",
    "We may differ among ourselves as to what is worth sacrificing in order to have more of something else. The point  here is more fundamental: merely demonstrating an unmet need is not sufficient to say that it should be met-- not when resources are scarce and have alternative uses.",
    "\"First, do no harm\" is a principle that has endured for centuries. Understanding the distinction between systemic causation and intentional causation is one way to do less harm with economic policies. It is especially important to do no harm to people who are already in painful economic circumstances.",
    "There has never been enough to satisfy everyone completely. That is the real constraint. That is what scarcity means.",
    "Prices rise because the amount demanded exceeds the amount supplied at existing prices. Prices fall because the amount supplied exceeds the amount demanded at existing prices."
];

let randomNum = 0;

let quote = document.getElementById("quotes");
let quoteButton = document.getElementById("quotebutton");

quoteButton.addEventListener("click", displayQuote);

displayQuote();

function displayQuote() {
    let currentQuote = randomNum;
    while (currentQuote == randomNum) {
        randomNum = Math.floor(Math.random() * 5);
    }
    quote.innerHTML = phrases[randomNum];
}