// 1
window.onload = (e) => {
    document.querySelector("#generate").onclick = searchButtonClicked;
    document.querySelector("#export").onclick = ExportPool;
    document.querySelector("#funny").onclick = ToggleGenerateFunny;
    document.querySelector("#conspiracy").onclick = ToggleGenerateConspiracy;
    document.querySelector("#banned").onclick = ToggleGenerateBanned;
    document.querySelector("#mode").onchange = (e) => mode = e.target.value;
    leftLoad = document.querySelector("#leftLoad");
    rightLoad = document.querySelector("#rightLoad");
};


// 2
const randomURL = "https://api.scryfall.com/cards/random";
const PrismaticURL = "https://api.scryfall.com/cards/a69e6d8f-f742-4508-a83a-38ae84be228c";
const searchUrl = "https://api.scryfall.com/cards/search"
let loading = false;
let generatedSomething = false;
let mode = "one";
let generatefunny = false;
let generateConspiracy = false;
let generateBanned = false;
let genTotal = 0;
let genCalled = 0;
let genProgress = 0;
let leftLoad = undefined;
let rightLoad = undefined;

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

function updateLoadingBar(bar, num) {
    bar.ldBar.set(num);
}

//Called on Search Button being clicked
function searchButtonClicked() {
    //If Loading do not allowed interruption
    if (!loading) {
        loading = true;
        generatedSomething = true;

        //Set up Array
        cards = [];

        //Clear Selectors and obj
        document.querySelector("#spinner").innerHTML = "<img src='images/spinner2.gif'></img>"
        document.querySelector("#commander").innerHTML = "";
        document.querySelector("#content").innerHTML = "";
        obj = undefined;

        //Build API request


        switch (mode) {
            case "one":
                GenerateOnePool();
                break;
            case "two":
                GenerateTwoPool();
                break;
            case "raw":
                GenerateRawPool();
                break;
        }

    }
}


async function GenerateOnePool() {
    genTotal = 140;
    genProgress = 0;
    genCalled = 0;

    let poolColor = "";
    let total = 140;

    let cmdr = await GetCommander();
    let poolColorIdentity = cmdr.color_identity;


    let cmdrZone = document.querySelector("#commander");
    let crdZone = document.querySelector("#content");
    cmdrZone.innerHTML += FormatCardHtml(cmdr);
    cards.push("1 " + cmdr.name);

    if (cmdr.keywords.includes("Partner") && !cmdr.keywords.includes("Partner With")) {
        let partner = await GetPartner();
        total--;
        let redo = poolColorIdentity.concat(partner.color_identity);
        let iter = new Map();
        redo.forEach(x => iter.set(x));
        poolColorIdentity = [...iter.keys()];
        cmdrZone.innerHTML += FormatCardHtml(partner);
        cards.push("1 " + partner.name);
    }

    if (poolColorIdentity != undefined && poolColorIdentity.length >= 1) {
        for (let addColor of poolColorIdentity) {
            poolColor += addColor.toLowerCase();
        }
    } else {
        poolColor = "c";
    }

    let fetchUrl = randomURL + "?q=id<%3D" + poolColor;
    if (!generatefunny) {
        fetchUrl += "%20-is%3Afunny";
    }
    if (!generateConspiracy) {
        fetchUrl += "%20-t%3Aconspiracy"
    }
    if (!generateBanned) {
        fetchUrl += "%20format%3Acommander";
    }

    let poolCards = await FetchBulk(
        fetchUrl,
        total,
        () => {
            genCalled++;
            updateLoadingBar(leftLoad, Math.round(genCalled * 100 / genTotal));
        },
        () => {
            genProgress++;
            updateLoadingBar(rightLoad, Math.round(genProgress * 100 / genTotal));
        }
    );
    for (let poolcard of poolCards) {
        if (poolcard == undefined) continue;
        if (IsCommander(poolcard)) {
            cmdrZone.innerHTML += FormatCardHtml(poolcard);
        } else {
            crdZone.innerHTML += FormatCardHtml(poolcard);
        }
        cards.push("1 " + poolcard.name);
    }


    loading = false;
    document.querySelector("#spinner").innerHTML = ""
}

async function GenerateTwoPool() {
    genTotal = 180;

    let poolColor = "";
    let poolColor2 = "";
    let total = 90;
    let total2 = 90;

    let cmdr = await GetCommander();
    let cmdr2 = await GetCommander();
    let poolColorIdentity = cmdr.color_identity;
    let poolColorIdentity2 = cmdr2.color_identity;

    let cmdrZone = document.querySelector("#commander");
    let crdZone = document.querySelector("#content");

    //Generate 1st group
    cmdrZone.innerHTML += FormatCardHtml(cmdr);
    cards.push("1 " + cmdr.name);

    if (cmdr.keywords.includes("Partner") && !cmdr.keywords.includes("Partner With")) {
        let partner = await GetPartner();
        total--;
        let redo = poolColorIdentity.concat(partner.color_identity);
        let iter = new Map();
        redo.forEach(x => iter.set(x));
        poolColorIdentity = [...iter.keys()];
        cmdrZone.innerHTML += FormatCardHtml(partner);
        cards.push("1 " + partner.name);
    }

    //generate 2nd group
    cmdrZone.innerHTML += FormatCardHtml(cmdr2);
    cards.push("1 " + cmdr2.name);

    if (cmdr2.keywords.includes("Partner") && !cmdr2.keywords.includes("Partner With")) {
        let partner = await GetPartner();
        total2--;
        let redo = poolColorIdentity2.concat(partner.color_identity);
        let iter = new Map();
        redo.forEach(x => iter.set(x));
        poolColorIdentity2 = [...iter.keys()];
        cmdrZone.innerHTML += FormatCardHtml(partner);
        cards.push("1 " + partner.name);
    }

    //First Fetch URL
    if (poolColorIdentity != undefined && poolColorIdentity.length >= 1) {
        for (let addColor of poolColorIdentity) {
            poolColor += addColor.toLowerCase();
        }
    } else {
        poolColor = "c";
    }
    let fetchUrl = randomURL + "?q=id<%3D" + poolColor;
    if (!generatefunny) {
        fetchUrl += "%20-is%3Afunny";
    }
    if (!generateConspiracy) {
        fetchUrl += "%20-t%3Aconspiracy"
    }
    if (!generateBanned) {
        fetchUrl += "%20format%3Acommander";
    }

    //Second Fetch URL
    if (poolColorIdentity2 != undefined && poolColorIdentity2.length >= 1) {
        for (let addColor2 of poolColorIdentity2) {
            poolColor2 += addColor2.toLowerCase();
        }
    } else {
        poolColor2 = "c";
    }
    let fetchUrl2 = randomURL + "?q=id<%3D" + poolColor2;
    if (!generatefunny) {
        fetchUrl2 += "%20-is%3Afunny";
    }
    if (!generateConspiracy) {
        fetchUrl2 += "%20-t%3Aconspiracy"
    }
    if (!generateBanned) {
        fetchUrl2 += "%20format%3Acommander";
    }

    let cardPool1 = await FetchBulk(fetchUrl, total, () => {
            genCalled++;
            updateLoadingBar(leftLoad, Math.round(genCalled * 100 / genTotal));
        },
        () => {
            genProgress++;
            updateLoadingBar(rightLoad, Math.round(genProgress * 100 / genTotal));
        })
    let cardPool2 = await FetchBulk(fetchUrl2, total2, () => {
            genCalled++;
            updateLoadingBar(leftLoad, Math.round(genCalled * 100 / genTotal));
        },
        () => {
            genProgress++;
            updateLoadingBar(rightLoad, Math.round(genProgress * 100 / genTotal));
        });
    poolCards = [].concat(cardPool1).concat(cardPool2);
    for (let poolcard of poolCards) {
        if (poolcard == undefined) continue;
        if (IsCommander(poolcard)) {
            cmdrZone.innerHTML += FormatCardHtml(poolcard);
        } else {
            crdZone.innerHTML += FormatCardHtml(poolcard);
        }
        cards.push("1 " + poolcard.name);
    }


    loading = false;
    document.querySelector("#spinner").innerHTML = "";
}

async function GetCardPool(Search) {
    let pool = [];
    let obj = undefined;
    let page = 1;
    do {
        let poolUrl = `${searchUrl}?q=${Search}&page=${page}`;
        let response = await fetch(poolUrl, options);
        if (response.ok) {
            obj = await response.json();
            pool = pool.concat(obj.data);
        }
    } while (obj != undefined && obj.has_more && page++);
    return pool;
}

async function GenerateRawPool() {
    genTotal = 250;
    genProgress = 0;
    genCalled = 0;

    let total = 250;

    let cmdr = await GetCommander();
    let poolColorIdentity = cmdr.color_identity;


    let cmdrZone = document.querySelector("#commander");
    let crdZone = document.querySelector("#content");
    cmdrZone.innerHTML += FormatCardHtml(cmdr);
    cards.push("1 " + cmdr.name);

    if (cmdr.keywords.includes("Partner") && !cmdr.keywords.includes("Partner With")) {
        let partner = await GetPartner();
        total--;
        let redo = poolColorIdentity.concat(partner.color_identity);
        let iter = new Map();
        redo.forEach(x => iter.set(x));
        poolColorIdentity = [...iter.keys()];
        cmdrZone.innerHTML += FormatCardHtml(partner);
        cards.push("1 " + partner.name);
    }

    let poolCards = [];
    for (; total > 0; total -= 50) {
        let cardPool1 = await FetchBulk(GetRandomUrl(), Math.min(total, 50), () => {
                genCalled++;
                updateLoadingBar(leftLoad, Math.round(genCalled * 100 / genTotal));
            },
            () => {
                genProgress++;
                updateLoadingBar(rightLoad, Math.round(genProgress * 100 / genTotal));
            });
        poolCards = poolCards.concat(cardPool1);
    }
    for (let poolcard of poolCards) {
        if (poolcard == undefined) continue;
        if (IsCommander(poolcard)) {
            cmdrZone.innerHTML += FormatCardHtml(poolcard);
        } else {
            crdZone.innerHTML += FormatCardHtml(poolcard);
        }
        cards.push("1 " + poolcard.name);
    }


    loading = false;
    document.querySelector("#spinner").innerHTML = "";
}

function IsValidCommander(obj) {
    //Log fail states
    if (obj == undefined) {
        document.querySelector("#spinner").innerHTML = "<b>Invalid Commander is undefined</b>";
        return false;
    }
    if (obj.image_uris == undefined) {
        document.querySelector("#spinner").innerHTML = "<b>Invalid Commander: image was not found";
        return false;
    }
    return true;
}

function IsValid(obj) {
    if (obj == undefined || obj.image_uris == undefined) return false;
    return true;
}

function IsCommander(obj) {
    if ((obj.type_line != undefined && obj.type_line.includes("Legendary") && obj.type_line.includes("Creature")) || (obj.oracle_text != undefined && obj.oracle_text.includes("can be your commander."))) {
        return true;
    }
    return false;
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

function FormatCardHtml(obj) {
    //Grab an Image to use
    let image_to_use = obj.image_uris.normal;
    if (image_to_use == undefined) {
        image_to_use == obj.image_uris.small;
    }

    return "<div><p>" + obj.name + "</p><img src=" + image_to_use + " alt=" + obj.name + "</img></div>";
}

async function FetchBulk(url, num, callForward, callback) {
    let numc = num;
    let fetchNum = 0;
    let promises = [];
    for (fetchNum = 0; fetchNum < numc; fetchNum++) {
        if (callForward != undefined) callForward();
        promises.push(GetCard(url, callback));
        await delay(100);
    }
    return Promise.all(promises).catch((reason) => console.log(reason));
}

const MAX_TRIES = 3;
const options = {
    headers: new Headers({ 'content-type': 'application/json; charset=utf-8' })
}
async function GetCard(url, callback) {
    for (numTry = 0; numTry < MAX_TRIES; numTry++) {
        let response = await fetch(url, options).catch(reason => console.log(reason));
        if (response.ok) {
            let json = await response.json();
            if (IsValid(json)) {
                if (callback != undefined) callback();
                return json;
            }
        } else {
            alert(response);
        }
    }
}

function GetRandomUrl() {
    let randomUrl = randomURL + "?q=";
    if (!generatefunny) {
        randomUrl += "%20-is%3Afunny";
    }
    if (!generateConspiracy) {
        randomUrl += "%20-t%3Aconspiracy"
    }
    if (!generateBanned) {
        randomUrl += "%20format%3Acommander";
    }
    return randomUrl;
}

async function GetCommander() {
    const MTG_Commander = "https://api.scryfall.com/cards/random?q=is%3Acommander";

    let dataUrl = MTG_Commander;
    if (!generatefunny) {
        dataUrl += "%20-is%3Afunny";
    }
    if (!generateBanned) {
        dataUrl += "%20format%3Acommander";
    }

    return await GetCard(dataUrl);
}

async function GetPartner() {
    const MTG_Partner = "https://api.scryfall.com/cards/random?q=is%3Acommander%20o%3Apartner+-o%3A'Partner+With'";

    let dataUrl = MTG_Partner;
    if (!generatefunny) {
        dataUrl += "%20-is%3Afunny";
    }
    if (!generateBanned) {
        dataUrl += "%20format%3Acommander";
    }

    return await GetCard(dataUrl);
}

function delay(milisec) {
    return new Promise(resolve => {
        setTimeout(() => { resolve('') }, milisec);
    })
}