// 1
window.onload = (e) => {
    document.querySelector("#generate").onclick = searchButtonClicked
    document.querySelector("#export").onclick = ExportPool;
    document.querySelector("#funny").onclick = ToggleGenerateFunny;
    document.querySelector("#conspiracy").onclick = ToggleGenerateConspiracy;
    document.querySelector("#banned").onclick = ToggleGenerateBanned;
};



// 2
let obj = undefined;
let numToGenerate = 140;
const randomURL = "https://api.scryfall.com/cards/random";
const PrismaticURL = "https://api.scryfall.com/cards/a69e6d8f-f742-4508-a83a-38ae84be228c";
let loading = false;
let generatedSomething = false;
let color = "";
let url = "";
let generatefunny = false;
let generateConspiracy = false;
let generateBanned = false;

let cards = ["1 The Prismatic Piper"];

function ToggleGenerateFunny() {
    generatefunny = !generatefunny;
}

function ToggleGenerateConspiracy() {
    generateConspiracy = !generateConspiracy;
}

function ToggleGenerateBanned() {
    generateBanned = !generateBanned;
}

function ExportPool() {
    if (generatedSomething && !loading) {
        let text = "";
        for (let card of cards) {
            text += card + "\n";
        }
        let filename = "sealedPooled.txt";
        download(filename, text);
    }
}

// 3
function searchButtonClicked() {
    if (!loading) {
        loading = true;
        generatedSomething = true;
        console.log("searchButtonClicked() called");
        cards = ["1 The Prismatic Piper"];

        document.querySelector("#spinner").innerHTML = "<img src='images/spinner.gif'></img>"
        document.querySelector("#commander").innerHTML = "";
        document.querySelector("#content").innerHTML = "";
        obj = undefined;

        const MTG_Commander = "https://api.scryfall.com/cards/random?q=is%3Acommander";

        let dataUrl = MTG_Commander;
        if (!generatefunny) {
            dataUrl += "%20-is%3Afunny";
        }
        if (!generateBanned) {
            dataUrl += "%20format%3Acommander";
        }

        getData(dataUrl, CommanderLoaded);
    }
}

function getData(url, callback) {
    let xhr = new XMLHttpRequest();

    xhr.onload = callback;
    xhr.onerror = dataError;

    xhr.open("GET", url);
    xhr.send();
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function CommanderLoaded(e) {
    let xhr = e.target;
    obj = JSON.parse(xhr.responseText);
    if (obj == undefined) {
        document.querySelector("#spinner").innerHTML = "<b>Commander is undefined</b>";
        return;
    }
    if (obj.image_uris == undefined) {
        document.querySelector("#spinner").innerHTML = "<b>Commander image is was not found";
        return;
    }

    let image_to_use = obj.image_uris.normal;
    if (image_to_use == undefined) {
        image_to_use == obj.image_uris.small;
    }

    let content = document.querySelector("#commander");
    content.innerHTML += "<div><p>" + obj.name + "</p><img src=" + image_to_use + " alt=" + obj.name + "</img></div>";

    cards.push("1 " + obj.name);
    //Commander Special Stuff
    let colorIdentity = obj.color_identity;
    color = "";
    if (colorIdentity != undefined && colorIdentity.length >= 1) {
        for (let addColor of colorIdentity) {
            color += addColor.toLowerCase();
        }
    } else {
        color = "c";
    }
    url = randomURL + "?q=id<%3D" + color;
    if (!generatefunny) {
        url += "%20-is%3Afunny";
    }
    if (!generateConspiracy) {
        url += "%20-t%3Aconspiracy"
    }
    if (!generateBanned) {
        url += "%20format%3Acommander";
    }
    console.log();
    getData(PrismaticURL, CardLoaded);

    for (let i = 0; i < numToGenerate - 1; i++) {
        getData(url, CardLoaded);
    }
    getData(url, LastCardLoaded)
}

function LastCardLoaded(e) {
    CardLoaded(e);
    loading = false;
    document.querySelector("#spinner").innerHTML = "";
}

function CardLoaded(e) {
    let xhr = e.target;
    obj = JSON.parse(xhr.responseText);
    if (obj == undefined) {
        document.querySelector("#status").innerHTML = "<b>No results found for'" + displayTerm + "'</b>";
        return;
    }
    if (obj.image_uris == undefined) {
        getData(randomURL + "?q=id<%3D" + color, CardLoaded);
        return;
    }

    let image_to_use = obj.image_uris.normal;
    if (image_to_use == undefined) {
        image_to_use == obj.image_uris.small;
    }

    let content = document.querySelector("#content");
    if ((obj.type_line.includes("Legendary") && obj.type_line.includes("Creature")) || (obj.oracle_text != undefined && obj.oracle_text.includes("can be your commander."))) {
        content = document.querySelector("#commander");
    }

    content.innerHTML += "<div><p>" + obj.name + "</p><img src=" + image_to_use + " alt=" + obj.name + "</img></div>";
    cards.push("1 " + obj.name);
}

function dataError(e) {
    console.log("error has occured");
}