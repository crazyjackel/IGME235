class Horn extends PIXI.Graphics {
    DrawHorn(x, y, width, height, rotation) {
        this.clear();
        this.beginFill(0x411300);
        this.drawRect(x + width / 6, y - height / 12, width, height);
        this.endFill();
        this.beginFill(0x7f3300);
        this.drawRect(x - width / 4, y - height / 3, width, height);
        this.endFill();
        this.beginFill(0x562932);
        this.drawRect(x, y, width, height);
        this.endFill();
        this.position.x = 252;
        this.position.y = 201;
        this.pivot = new PIXI.Point(250, 200);
        this.rotation = rotation;

    }
}

class Upgrade {
    constructor(name = "", baseCost = 1, baseReturn = 0, costMultiplier = 1.1, href) {
        this.name = name;
        if (localStorage.getItem(name + "_owned")) {
            this.owned = Number.parseInt(localStorage.getItem(name + "_owned"));
        } else {
            this.owned = 0;
        }
        this.returnPerOne = baseReturn;
        this.costMultiplier = costMultiplier;
        this.cost = baseCost * Math.pow(this.costMultiplier, this.owned);
        this.spriteLink = href;
        this.buyable = false;
        this.Text = [];
    }
    CreateUpgradeBox(x = 0, y = 0, Callback) {
        this.UpgradeBox = new BorderedRectangle(x, y, 170, 60);
        this.UpgradeBox.addChild(this.CreateSprite(x + 25, y + 32));
        this.UpgradeBox.addChild(this.CreateText(x + 45, y + 16, this.name, new PIXI.TextStyle({
            fill: 0x0000000,
            fontSize: 18,
            fontFamily: "Futura",
            stroke: 0x0000FF,
            strokeThickness: 1
        })));
        this.UpgradeBox.addChild(this.CreateText(x + 130, y + 16, `x${this.owned}`, new PIXI.TextStyle({
            fill: 0x0000000,
            fontSize: 18,
            fontFamily: "Futura",
            stroke: 0x0000FF,
            strokeThickness: 1
        })));
        this.UpgradeBox.addChild(this.CreateText(x + 46, y + 40, `Cost: ${Format(Math.ceil(this.cost),2)}`, new PIXI.TextStyle({
            fill: 0x0000000,
            fontSize: 12,
            fontFamily: "Futura",
            stroke: 0x0000FF,
            strokeThickness: 1
        })));
        this.UpdateBackground(false);
        this.UpgradeBox.interactive = true;
        this.UpgradeBox.on("click", Callback);
        return this.UpgradeBox;
    }
    UpdateText() {
        if (this.Text.length == 3) {
            this.Text[1].text = `x${this.owned}`;
            this.Text[2].text = `Cost: ${Format(Math.ceil(this.cost),2)}`;
        }
    }
    CreateSprite(x = 0, y = 0) {
        this.sprite = new PIXI.Sprite(app.loader.resources[this.spriteLink].texture);
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.anchor.set(.5, .5);
        this.sprite.scale.set(1);
        return this.sprite;
    }
    CreateText(x = 0, y = 0, Text, TextStyle) {
        let txt = new PIXI.Text(Text, TextStyle);
        txt.x = x;
        txt.y = y;
        this.Text.push(txt);
        return txt;
    }
    BuyOne(Callback) {
        if (this.buyable) {
            this.owned++;
            localStorage.setItem(this.name + "_owned", this.owned);
            this.cost = this.cost * this.costMultiplier;
            this.UpdateText();
            Callback();
        }
    }
    SetOwned(owned) {
        this.owned = owned;
        localStorage.setItem(this.name + "_owned", this.owned);
        this.UpdateText();
    }
    GetReturn() {
        return this.returnPerOne * this.owned;
    }
    UpdateBackground(canbuy = false) {
        if (canbuy) {
            this.UpgradeBox.SetBackgroundColor(0xFFFFFF);
            this.buyable = true;
        } else {
            this.UpgradeBox.SetBackgroundColor(0xAAAAAA);
            this.buyable = false;
        }
    }
}
class BorderedRectangle extends PIXI.Graphics {
    constructor(x = 0, y = 0, width = 0, height = 0, borderWidth = 1, color = 0xFAFAFA, borderColor = 0x0000ff) {
        super();
        this.DrawBox(x, y, width, height, borderWidth, color, borderColor);
        this.x = x;
        this.y = y;
        this.boxwidth = width;
        this.boxheight = height;
        this.borderWidth = borderWidth;
        this.color = color;
        this.borderColor = borderColor;
    }
    SetBackgroundColor(color = 0xFAFAFA) {
        this.clear();
        this.DrawBox(this.x, this.y, this.boxwidth, this.boxheight, this.borderWidth, color, this.borderColor);
        this.color = color;
    }
    DrawBox(x = 0, y = 0, width = 0, height = 0, borderWidth = 1, color = 0xFAFAFA, borderColor = 0x0000ff) {
        this.beginFill(color)
        this.drawRect(x, y, width, height)
        this.endFill();
        this.beginFill(borderColor);
        this.drawRect(x, y, borderWidth, height);
        this.drawRect(x + width - borderWidth, y, borderWidth, height);
        this.drawRect(x, y - borderWidth, width, borderWidth)
        this.drawRect(x, y + height - borderWidth, width, borderWidth);
        this.endFill();
    }
}



/*
class Ship extends PIXI.Sprite {
    constructor(x = 0, y = 0) {
        super(app.loader.resources["images/Spaceship.png"].texture);
        this.anchor.set(.5, .5);
        this.scale.set(0.1);
        this.x = x;
        this.y = y;
    }
}
class Circle extends PIXI.Graphics {
    constructor(radius, color = 0xFF0000, x = 0, y = 0) {
        super();
        this.beginFill(color);
        this.drawCircle(0, 0, radius);
        this.endFill();
        this.x = x;
        this.y = y;
        this.radius = radius;

        this.fwd = getRandomUnitVector();
        this.speed = 50;
        this.isAlive = true;
    }

    move(dt = 1 / 60) {
        this.x += this.fwd.x * this.speed * dt;
        this.y += this.fwd.y * this.speed * dt;
    }

    reflectX() {
        this.fwd.x *= -1;
    }
    reflectY() {
        this.fwd.y *= -1;
    }
}
*/