// 1
window.onload = (e) => {
    document.querySelector("#search").onclick = searchButtonClicked
};

// 2
let displayTerm = "";

// 3
function searchButtonClicked() {
    console.log("searchButtonClicked() called");

    const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";

    let GIPHY_KEY = "sAUfyjtanXPI24Cl1oqQdIWDN6Y2iGIZ";

    let url = GIPHY_URL;
    url += "api_key=" + GIPHY_KEY;

    let term = document.querySelector("#searchterm").value;
    displayTerm = term;

    term = term.trim();

    term = encodeURIComponent(term);
    if (term.length < 1) return;

    url += "&q=" + term;

    let limit = document.querySelector("#limit").value;
    url += "&limit=" + limit;

    document.querySelector("#status").innerHTML = "<img src='images/spinner.gif'></img>";
    document.querySelector("#status").style.height = "15rem";
    console.log(url);

    getData(url);
}

function getData(url) {
    let xhr = new XMLHttpRequest();

    xhr.onload = dataLoaded;
    xhr.onerror = dataError;

    xhr.open("GET", url);
    xhr.send();

}

function dataLoaded(e) {
    let xhr = e.target;
    console.log(xhr.responseText);
    let obj = JSON.parse(xhr.responseText);

    if (!obj.data || obj.data.length == 0) {
        docuemnt.querySelector("#status").innerHTML = "<b>No results found for'" + displayTerm + "'</b>";
        return;
    }

    let results = obj.data;
    console.log(results.length);
    let bigString = "";
    for (let i = 0; i < results.length; i++) {
        let result = results[i];

        let smallURL = result.images.fixed_width_downsampled.url;
        if (!smallURL) smallURL = "../images/no-image-found.png";

        let url = result.url;

        let line = "<div class='result'>";
        line += "<img src ='";
        line += smallURL;
        line += "' title= '";
        line += result.id;
        line += "' />";

        line += "<span><a target='_blank' href='" + url + "'>View On Giphy</a></span><span>Rating: " + result.rating.toUpperCase() + "</span>";
        line += "</div>";

        bigString += line;
    }
    document.querySelector("#content").innerHTML = bigString;
    document.querySelector("#status").innerHTML = "<b>Success!</b><p><i>Here are " + results.length + " results for '" + displayTerm + "'</i></p>";
    document.querySelector("#status").style.height = "auto";
}

function dataError(e) {
    console.log("error has occured");
}