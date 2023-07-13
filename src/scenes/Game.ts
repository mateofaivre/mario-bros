import {AScene} from "./AScene";
import {Player} from "../objects/Player";
import {BitmapText, Sprite, Texture, TilingSprite, Container} from "pixi.js";
import {Main} from "..";
import {IObject} from "../objects/IObject";
import {Enemy} from "../objects/Enemy";
import {GameOver} from "./GameOver";


export class Game extends AScene {

    private _player = new Player();
    private _objects: IObject[] = [];

    private _ground !: TilingSprite;
    private _bg !: Sprite;

    private _audio = new Audio('assets/mp3/home.mp3');
    private _audioChoc = new Audio('assets/mp3/down.mp3');
    private _isEnd = false;

    private _timeTxt = new BitmapText('0 s', {fontName: 'Space Invaders', fontSize: 32});
    private _time = 0;

    constructor() {
        super();
        this._audio.play();

        this._player.x = 200;
        this._player.y = 200;

        this.addChild(this._player);

        this._objects.push(this._player);
        this._loop();
    }

    private _loop() {
        let rand = ((Math.random() * (1.25 - 0.8 + 1)) + 0.8) * 1000;
        setTimeout(() => {
            const enemy = new Enemy()
            enemy.x = 1920;
            enemy.y = Main.SCREEN_HEIGHT - this._ground.height - enemy.height;
            this.addChild(enemy);
            this._objects.push(enemy);
            this._loop();
        }, rand);
    };

    public initialize() {
        super.initialize();
        this._bg = Sprite.from("bg-mountains.png");
        this.addChild(this._bg)

        this._timeTxt.x = 10;
        this._timeTxt.y = 20;
        this.addChild(this._timeTxt);

        this._ground = new TilingSprite(Texture.from("sol-nes.png"), 1920, 150);
        this._ground.y = Main.SCREEN_HEIGHT - this._ground.height;
        this.addChild(this._ground)

        this._player.x = (Main.SCREEN_WIDTH - this._player.width) * 0.5;
        this._player.y = Main.SCREEN_HEIGHT - this._ground.height - this._player.height;
        this.addChild(this._player);

        window.addEventListener("keyup", this._onKeyboard.bind(this))
        window.addEventListener("pointerdown", this._jump.bind(this))
    }

    public update(timeDelta: number) {
        super.update(timeDelta);

        this._player.update(timeDelta)

        for (const object of this._objects) {
            object.update(timeDelta)
        }

        if (!this._isEnd) {
            this._ground.tilePosition.x -= 4;
            this._time += timeDelta / 55;
            this._timeTxt.text = Math.floor(this._time) + " s"
        }

        for (const enemy of this._objects.filter(obj => obj instanceof Enemy)) {
            if (!this._isEnd && this._isIntersecting(this._player, enemy as Enemy)) {
                (enemy as Enemy).hurt = true;

                this._ground.tilePosition.x = 0;
                this._end()

                this._isEnd = true;
            }
        }
        //garbage
        for (const object of this._objects) {
            if (object.kill) {
                this.removeChild(object as unknown as Container);
                this._objects.splice(this._objects.indexOf(object), 1)
            }

        }
    }

    private _isIntersecting(r1: Container, r2: Container): boolean {
        return !(
            r2.x > r1.x + r1.width ||
            r2.x + r2.width < r1.x ||
            r2.y > r1.y + r1.height ||
            r2.y + r2.height < r1.y
        );
    }

    private _end() {
        this._ground.tilePosition.x = 0;
        this._audio.pause();
        this._audioChoc.play();
        this._player.die();
        setTimeout(() => {
            Main.instance.scene = new GameOver(Math.floor(this._time));
        }, 3500)
    }

    private _jump() {
        this._player.jump();
    }

    private _onKeyboard(kEvt: KeyboardEvent) {
        if (kEvt.keyCode == 32 && !this._isEnd) {
            this._jump();
        }
    }
}
