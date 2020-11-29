// We will use `strict mode`, which helps us by having the browser catch many common JS mistakes
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
"use strict";
const app = new PIXI.Application({
    width: 800,
    height: 800,
});
document.body.appendChild(app.view);

// constants
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

// pre-load the images
app.loader.
add([
    "images/Grass.png",
    "images/Bush.png",
    "images/Stones.png",
    "images/Salt.png",
    "images/Magic.png",
    "images/Gold.png",
    "images/Milk.png",
    "images/Nanomachines.png",
    "images/Mountain.png",
    "images/Valhalla.png",
    "images/Ibex.png"
]);
app.loader.onProgress.add(e => { console.log(`progress=${e.progress}`) });
app.loader.onComplete.add(setup);
app.loader.load();

let stage;

let score = 0;

let scene, clickArea, upgradeArea, statsArea, scoreLabel, Title, Ibex;

const frameForSaveEvent = 240;
let frameCounter = 0;

let upgrades = [];
let horns = [];

let TextStyleDefault = new PIXI.TextStyle({
    fill: 0x0000000,
    fontSize: 18,
    fontFamily: "Futura",
    stroke: 0x0000FF,
    strokeThickness: 1
});

let TitleText = new PIXI.TextStyle({
    fill: 0xFFFFFF,
    fontSize: 22,
    fontFamily: "Futura",
    stroke: 0x0000FF,
    strokeThickness: 5
});

function setup() {

    stage = app.stage;
    // #1 - Create the `start` scene
    scene = new PIXI.Container();
    stage.addChild(scene);

    let background = new PIXI.Graphics();
    scene.addChild(background);
    background.beginFill(0xFFFFFF);
    background.drawRect(0, 0, 800, 800);
    background.endFill();

    clickArea = new BorderedRectangle(5, 20, 580, 630, 5);
    clickArea.interactive = true;
    clickArea.on("click", IncrementScore);
    scene.addChild(clickArea);

    Ibex = new PIXI.Sprite(app.loader.resources["images/Ibex.png"].texture);
    Ibex.x = 360;
    Ibex.y = 360;
    Ibex.anchor.set(.5, .5);
    Ibex.scale.set(2);
    clickArea.addChild(Ibex);

    upgradeArea = new BorderedRectangle(300, 20, 190, 630, 5);
    scene.addChild(upgradeArea);

    statsArea = new BorderedRectangle(5, 350, 780, 100, 5);
    scene.addChild(statsArea);

    SetupScene();
    SetupUpgrades();

    if (localStorage.getItem("score")) {
        score = Number.parseInt(localStorage.getItem("score"));
    }

    SetupHorns();
    UpdateHorns();


    app.ticker.add(gameLoop);
}

function SetupScene() {
    scoreLabel = new PIXI.Text("Score:    ");
    scoreLabel.style = TextStyleDefault;
    scoreLabel.x = 600;
    scoreLabel.y = 5;
    scene.addChild(scoreLabel);

    Title = new PIXI.Text("Ibex IDLE");
    Title.style = TitleText;
    Title.x = 10;
    Title.y = 0;
    scene.addChild(Title);
}

function SetupUpgrades() {
    let GrassUpgrade = new Upgrade("Grass", 10, 1, 1.1, "images/Grass.png");
    let BushUpgrade = new Upgrade("Bush", 100, 12, 1.2, "images/Bush.png");
    let StoneUpgrade = new Upgrade("Stone", 1200, 150, 1.15, "images/Stones.png");
    let SaltUpgrade = new Upgrade("Salt", 15000, 2000, 1.2, "images/Salt.png");
    let MilkUpgrade = new Upgrade("Milk", 300000, 30000, 1.05, "images/Milk.png");
    let GoldUpgrade = new Upgrade("Gold", 10000000, 500000, 1.2, "images/Gold.png");
    let MagicUpgrade = new Upgrade("Magic", 500000000, 40000000, 1.3, "images/Magic.png");
    let NanoUpgrade = new Upgrade("Nano", 10000000000, 1000000000, 1.1, "images/Nanomachines.png");
    let MountainUpgrade = new Upgrade("Mountain", 300000000000, 10000000000, 1.1, "images/Mountain.png");
    let ValhallaUpgrade = new Upgrade("Valhalla", 30000000000000, 9000000000, 1.05, "images/Valhalla.png");
    upgrades.push(GrassUpgrade);
    upgrades.push(BushUpgrade);
    upgrades.push(StoneUpgrade);
    upgrades.push(SaltUpgrade);
    upgrades.push(MilkUpgrade);
    upgrades.push(GoldUpgrade);
    upgrades.push(MagicUpgrade);
    upgrades.push(NanoUpgrade);
    upgrades.push(MountainUpgrade);
    upgrades.push(ValhallaUpgrade);
    for (let i = 0; i < upgrades.length; i++) {
        let upgrade = upgrades[i].CreateUpgradeBox(155, 12 + i * 31, () => BuyUpgrade(upgrades[i]));
        upgradeArea.addChild(upgrade);
    }
}

function SetupHorns() {
    let numHorns = Math.log10(score) + 1;
    for (let i = 0; i < numHorns; i++) {
        let horn = new Horn();
        if (i == 0) {
            clickArea.addChild(horn);
        } else {
            horns[i - 1].addChild(horn);
        }
        horns.push(horn);
    }
}

function UpdateHorns() {
    if (Math.log10(score) + 1 > horns.length) {
        let horn = new Horn();
        if (horns.length == 0) {
            clickArea.addChild(horn);
        } else {
            horns[horns.length - 1].addChild(horn);
        }
        horns.push(horn);
    }

    let originX = 250;
    let originY = 200;
    let rotation = 0;
    let radius = 150;
    for (let i = 0; i < horns.length; i++) {
        let horn = horns[i];
        let x = originX + radius * Math.cos(rotation);
        let y = originY - radius * Math.sin(rotation);
        let Size = GetSize(score, i);
        horn.DrawHorn(x, y, Size * radius / 2, Size * radius / 2, 0.1);
        radius *= 0.9;
        rotation += Math.PI / 4;
    }
}

function GetSize(score, order) {
    return (score) / (score + Math.pow(10, order));
}

function IncrementScore() {
    UpdateScore(1);
}

function ResetGame() {
    UpdateScore(-score);
    for (let upgrade of upgrades) {
        upgrade.SetOwned(0);
    }
}

function UpdateScore(val = 0) {
    score += val;
    scoreLabel.text = `Score: ${Format(Math.trunc(score),2)}`;

    if (val < 0) {
        localStorage.setItem("score", score.toFixed(2));
    }

    UpdateUpgrades();
}

function BuyUpgrade(Upgrade) {
    Upgrade.BuyOne(() => UpdateScore(-Upgrade.cost));
    UpdateUpgrades();
}

function UpdateUpgrades() {
    for (let upgrade of upgrades) {
        if (!upgrade.buyable && score >= upgrade.cost) {
            upgrade.UpdateBackground(true);
        } else if (upgrade.buyable && score < upgrade.cost) {
            upgrade.UpdateBackground(false);
        }
    }
}

function gameLoop() {
    let dt = 1 / app.ticker.FPS;
    if (dt > 1 / 12) dt = 1 / 12;

    frameCounter++;
    if (frameCounter % frameForSaveEvent == 0) {
        localStorage.setItem("score", score.toFixed(2));
    }

    if (score < 0) {
        score = 0;
    }

    for (let upgrade of upgrades) {
        UpdateScore(dt * upgrade.GetReturn());
    }

    UpdateHorns();
}