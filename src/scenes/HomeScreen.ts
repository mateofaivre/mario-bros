import {gsap, Back} from "gsap";
import {Container, Sprite, Texture, TilingSprite} from "pixi.js";
import {Main} from "../index";
import {AScene} from "./AScene";
import {Game} from "./Game";

export class HomeScreen extends AScene {

    private _timeline = gsap.timeline();
    private _ready = Sprite.from("smb-start-normal.png");
    private _bg !: Sprite;
    private _rules !: Sprite;
    private _soundIcon !: Sprite;
    private _ground !: TilingSprite;
    private _audio = new Audio('assets/mp3/ending.mp3');

    constructor() {
        super();


        this._bg = Sprite.from("bg-mountains.png");
        this.addChild(this._bg)
        this._rules = Sprite.from("rules+.png");
        this.addChild(this._rules)

        this._soundIcon = Sprite.from("sound-mute.png");
        this.addChild(this._soundIcon)
        this._audio.muted = true;
        this._soundPosition();

        // this._ready = Sprite.from("ready.png");
        this._ready.x = (Main.SCREEN_WIDTH - this._ready.width) / 2;
        // this._ready.y =  (Main.SCREEN_HEIGHT -  this._ready.height) / 2;
        this.addChild(this._ready)

        this._rules.x = (Main.SCREEN_WIDTH - this._rules.width) / 2;
        this._rules.y = -this._rules.height;
        this.addChild(this._rules)


        this._timeline = gsap.timeline();
        this._timeline.to(this._ready, {y: (Main.SCREEN_HEIGHT - this._ready.height * 2) / 2, duration: 0.6, ease: Back.easeOut})
        this._timeline.to(this._rules, {y: (Main.SCREEN_HEIGHT - this._rules.height + this._ready.height + 150) / 2, duration: 0.6, ease: Back.easeOut})

        this._timeline.to(this._ready, {alpha: 0.5, duration: 0.6, yoyo: true, repeat: -1})
        // this._timeline.to( this._rules, {alpha: 0.5, duration: 0.6, yoyo: true, repeat: -1})

        this._bg.interactive = true;
        this._bg.buttonMode = true;


        this._bg.once("pointerdown", this._play.bind(this));
        this._soundIcon.on("pointerdown", this._playSound.bind(this))

    }

    private _soundPosition() {
        this._soundIcon.x = 20
        this._soundIcon.y = Main.SCREEN_HEIGHT - this._soundIcon.height - 20
        this._soundIcon.interactive = true;
        this._soundIcon.buttonMode = true;
    }

    private _play() {
        this._audio.pause();
        this._timeline.kill();
        this._ready.alpha = 1;
        gsap.to(this._ready, {
            y: -this._ready.height, onComplete: () => {
                Main.instance.scene = new Game();
            }
        })
    }

    private _playSound() {

        if (this._audio.muted) {
            this._audio.muted = false;
            this._audio.play();
            this._soundIcon.texture = Texture.from("sound-up.png");
            this._soundPosition();
        } else {
            this._audio.muted = true;
            this._soundIcon.texture = Texture.from("sound-mute.png");
            this._soundPosition();
        }

    }


}