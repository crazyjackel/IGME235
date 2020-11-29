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

//Toggles Internal Bool: generateFunny
function ToggleGenerateFunny() {
    generatefunny = !generatefunny;
}
//Toggles Internal Bool: generateConspiracy
function ToggleGenerateConspiracy() {
    generateConspiracy = !generateConspiracy;
}
//Toggles Internal Bool: generateBanned
function ToggleGenerateBanned() {
    generateBanned = !generateBanned;
}
//Exports and Download from cards array in specificied format
function ExportPool() {
    //Check that cards have been generated and not loading, then download to file
    if (generatedSomething && !loading) {
        let text = "";
        for (let card of cards) {
            text += card + "\n";
        }
        let filename = "sealedPooled.txt";
        download(filename, text);
    }
}

//Called on Search Button being clicked
function searchButtonClicked() {
    //If Loading do not allowed interruption
    if (!loading) {
        loading = true;
        generatedSomething = true;

        //Set up Array
        cards = ["1 The Prismatic Piper"];

        //Clear Selectors and obj
        document.querySelector("#spinner").innerHTML = "<img src='images/spinner2.gif'></img>"
        document.querySelector("#commander").innerHTML = "";
        document.querySelector("#content").innerHTML = "";
        obj = undefined;

        //Build API request
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
//Do XMLHttpRequest with Callback Function onload
function getData(url, callback) {
    let xhr = new XMLHttpRequest();

    xhr.onload = callback;
    xhr.onerror = dataError;

    xhr.open("GET", url);
    xhr.send();
}
//Downloads to a file by creating and clicking, then deleting an element
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
//Function called when 'Commander is loaded', used for future queries
function CommanderLoaded(e) {
    let xhr = e.target;
    obj = JSON.parse(xhr.responseText);
    //Log fail states
    if (obj == undefined) {
        document.querySelector("#spinner").innerHTML = "<b>Commander is undefined</b>";
        return;
    }
    if (obj.image_uris == undefined) {
        document.querySelector("#spinner").innerHTML = "<b>Commander image is was not found";
        return;
    }

    //Grab an Image to use
    let image_to_use = obj.image_uris.normal;
    if (image_to_use == undefined) {
        image_to_use == obj.image_uris.small;
    }

    //Setup web content
    let content = document.querySelector("#commander");
    content.innerHTML += "<div><p>" + obj.name + "</p><img src=" + image_to_use + " alt=" + obj.name + "</img></div>";

    cards.push("1 " + obj.name);

    //Generate Future Queries from Commander information
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
    //Add Prismatic
    getData(PrismaticURL, CardLoaded);
    //Get Data for load
    for (let i = 0; i < numToGenerate - 1; i++) {
        getData(url, CardLoaded);
    }
    //Get Last CardLoaded Last (This isn't always accurate due to asynchronous requests, but guarentees something special for this specific request)
    getData(url, LastCardLoaded)
}
//Loads the Last card
function LastCardLoaded(e) {
    //Typical card loading
    CardLoaded(e);
    //Resets specific page information
    loading = false;
    document.querySelector("#spinner").innerHTML = "";
}
//Loads a card
function CardLoaded(e) {
    let xhr = e.target;
    obj = JSON.parse(xhr.responseText);
    //Log failstates
    if (obj == undefined) {
        document.querySelector("#status").innerHTML = "<b>No results found for'" + displayTerm + "'</b>";
        return;
    }
    //Regenerate on failure
    if (obj.image_uris == undefined) {
        getData(randomURL + "?q=id<%3D" + color, CardLoaded);
        return;
    }

    let image_to_use = obj.image_uris.normal;
    if (image_to_use == undefined) {
        image_to_use == obj.image_uris.small;
    }

    //Update Content, positioning in proper area
    let content = document.querySelector("#content");
    if ((obj.type_line.includes("Legendary") && obj.type_line.includes("Creature")) || (obj.oracle_text != undefined && obj.oracle_text.includes("can be your commander."))) {
        content = document.querySelector("#commander");
    }

    content.innerHTML += "<div><p>" + obj.name + "</p><img src=" + image_to_use + " alt=" + obj.name + "</img></div>";
    cards.push("1 " + obj.name);
}
//Data Error function to resolve issue with XMLHTTPREQUEST
function dataError(e) {
    console.log("error has occured");
}