import {AnimatedSprite} from "pixi.js";
import {AObjectAnimated} from "./AObjectAnimated";

export class Enemy extends AObjectAnimated {

    private _run = AnimatedSprite.fromFrames(["goomba-right.png", "goomba-base.png", "goomba-right.png"]);

    public hurt = false;

    constructor() {
        super();
        const number = (Math.floor(Math.random() * (2 - 1 + 1)) + 1);
        if (number == 1) {
            this._run = AnimatedSprite.fromFrames(["koopa-down.png", "koopa-up.png"]);
        } else {
            this._run = AnimatedSprite.fromFrames(["goomba-right.png", "goomba-base.png", "goomba-right.png"]);
        }
        this.addChild(this._run);
        this._run.animationSpeed = 0.15
        this._run.play();
    }

    public update(timeDelta: number) {
        super.update(timeDelta)

        if (!this.hurt) {
            this.x -= 6;
        } else {
            this._run.stop();
        }

        if (this.x < (0 - this.width))
            this.kill = true;

    }

}