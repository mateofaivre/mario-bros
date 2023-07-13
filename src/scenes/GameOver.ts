import {Sprite, BitmapText} from "pixi.js";
import {AScene} from "./AScene";
import {Main} from "..";
import {gsap} from "gsap";
import {HomeScreen} from "./HomeScreen";

export class GameOver extends AScene {

    private _audioGameOver = new Audio('assets/mp3/game-over.mp3');

    constructor(timeFinal: number) {

        super();
        const timeFinalTxt = new BitmapText(`You only lasted ${timeFinal} s !`, {fontName: 'Space Invaders', fontSize: 42});

        const gameOver = Sprite.from("game-over-down.jpg");
        gameOver.y = -80;
        this.addChild(gameOver);

        timeFinalTxt.x = (Main.SCREEN_WIDTH - timeFinalTxt.width) / 2;
        timeFinalTxt.y = (Main.SCREEN_HEIGHT) / 2 + 80;

        this.addChild(timeFinalTxt);

        gameOver.interactive = true;
        gameOver.buttonMode = true;

        this._audioGameOver.play();

        gsap.to(gameOver, {alpha: 0.5, duration: 0.8, repeat: -1, yoyo: true})

        gameOver.once("pointerdown", () => {
            Main.instance.scene = new HomeScreen()
        });
    }
}