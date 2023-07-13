import {AnimatedSprite} from "pixi.js";
import {AObjectAnimated} from "./AObjectAnimated";
import {Game} from "../scenes/Game";
import {Sprite} from "pixi.js";
import {gsap} from "gsap"

export class Player extends AObjectAnimated {
    private _run = AnimatedSprite.fromFrames(["mario-shadow.png", "mario-walk.png", "mario-run.png"]);
    private _jump = AnimatedSprite.fromFrames(["mario-jump.png"]);
    private _die = Sprite.from("mario-die.png");
    private _audioJump = new Audio('assets/mp3/jump.mp3');

    private _isJumping = false;

    private _isDead = false;

    constructor() {
        super();

        this._audioJump.volume = 0.2;
        this.addChild(this._run);
        this._run.animationSpeed = 0.15
        this._jump.animationSpeed = 0.1
        this._run.play();
    }

    public jump() {
        if (this._isJumping || this._isDead)
            return;

        this._audioJump.play();
        this.removeChild(this._run);
        this.addChild(this._jump);
        this._isJumping = true;
        gsap.to(this, {
            duration: 0.5,
            y: 660,
            yoyo: true,
            repeat: 1,
            ease: "sine.out",
            onComplete: () => {
                this.removeChild(this._jump);
                if (!this._isDead)
                    this.addChild(this._run)
                this._isJumping = false;
            },
        });
        this._jump.play();
    }

    public die() {
        this.removeChildAt(0);
        this.addChild(this._die);

        this._isDead = true;
    }
}