import {Injectable, EventEmitter} from 'angular2/core';

import {Splash} from './Splash';
import {Champion} from './Champion';


@Injectable()
export class CanvasService {


  // Events.
  // ==========================================================================


  // Emit after image is loaded.
  public imageLoaded: EventEmitter<{}> = new EventEmitter();

  // Even click. Emits index of clicked piece.
  public select: EventEmitter<number> = new EventEmitter();

  /**
   * Consecutive(basicly this mean odd) click on canvas.
   * Emits index of clicked piece.
   */
  public swap: EventEmitter<number> = new EventEmitter();

  /**
   * Store amount of clicks on canvas. Even clicks emit select
   * event, where odd clicks emit swap events.
   */
  public clicks: number = 0;


  // Current image data and settings.
  // ==========================================================================


  // Current image object displayed on canvas.
  public image: HTMLImageElement = new Image();

  // TODO: Use method rather than getter.
  // Random image source out of remaining splashes.
  public get src(): string {

    // Get random index and proper champion key as well as skin id.
    const index = Math.floor(Math.random() * this.splashArts.length);
    const [championKey, skinId] = this.splashArts[index].split('/');

    // Update splash art info.
    this.champion = this.getSplashArtInfo(championKey, skinId);

    // Remove image alredy used.
    this.splashArts.splice(index, 1);

    return `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/` +
      `${championKey}_${skinId}.jpg`;
  }

  // Amount of rows which image will be devided to.
  public rows: number = 3;

  // Amount of columns which image will be devided to.
  public cols: number = 3;

  // Store currently displayed splash art info.
  public champion: Champion = null;


  // Canvas and piece dimensions.
  // ==========================================================================


  // Canvas width. Highest that fit window width.
  public get cWidth(): number {
    return this.getMaxWidth(window.innerWidth);
  }

  // Canvas height. Multiplied by ratio to maintain aspect ratio of the image.
  public get cHeight(): number {
    return this.image.height * this.ratio;
  }

  /**
   * Single piece width and height.
   */
  public get dWidth(): number {
    return this.cWidth / this.cols;
  }

  public get dHeight(): number {
    return this.cHeight / this.rows;
  }

  /**
   * Image displayed on canvas(and canvas itself) will be smaller
   * by this ratio to fit the screen properly. Ratio is calculated
   * of width because originally width is tuned down, not height.
   */
  public get ratio(): number {
    return this.cWidth / this.image.width;
  }

  public offsetLeft: number = 0;
  public offsetTop: number = 0;


  // Splash arts.
  // ==========================================================================

  // Holds info about splash arts.
  private CHAMPION_SPLASH_ARTS: Splash[] = require('images');

  /**
   * Store every image as [championName]/[skinId].
   * Displayed images are removed, so there won't be any* duplicates.
   *
   * *But splashes where there are multiple champions
   * (eg. SKT world championship skins).
   */
  public splashArts: string[] = [];



  // TODO: Find better solution.
  // Boolean values which determines if some parts of view are interactive.
  public show: boolean = false;
  public preview: boolean = false;
  public loading: boolean = false;


  /**
   * Creates service which will be used across application.
   */
  constructor() {

    // Get "fresh" splash arts list.
    this.setImages();
  }



  /**
   * Calculates maximum width of an image, that will fit screen in x-axis.
   * @param {number} screenWidth - Window inner width.
   * @param {number} [breakpoints = 10] - Amount of widths to compare width
   * window width.
   * @param {number} [step = 100] - Amout of pixels to increment width
   * for every step
   * @return {number} Width of image that will fit the screen.
   */
  getMaxWidth(screenWidth: number, breakpoints: number = 10, step: number = 100): number {
    const arr = Array.apply(null, new Array(breakpoints)).map((x,i) => (i + 5) * step);

    return arr.reduce((prev, curr) =>
      screenWidth < curr ? prev : curr
    );
  }


  /**
   * Fill in images array.
   */
  setImages(): void {

    // Clear images.
    this.splashArts = [];

    // Fill in.
    this.CHAMPION_SPLASH_ARTS.forEach((champion) => {
      this.splashArts.push(...champion.skins.map((skin, index) =>
        champion.key + '/' + index
      ));
    });
  }

  /**
   * Get splash art info.
   * @param {string} championKey - Champion key(it is NOT champion name).
   * @param {string | number} skinId - 0-based consecutive skin number.
   * @returns {Champion} Splash art info(chamion name and title, skin name).
   */
  getSplashArtInfo(championKey: string, skinId: string | number): Champion {
    const champion = this.CHAMPION_SPLASH_ARTS.find((champion) =>
      champion.key === championKey
    );

    return {
      name: champion.name,
      title: champion.title,
      skin: champion.skins[skinId]
    }
  }


  /**
   * These two methods where basicly copied from foreground component.
   * However startNewGame should be in game service, because this class
   * is for canvas related stuff.
   */

  /**
   * Starts new game.
   */
  public startNewGame(): void {
    // TODO: Reset game specyfic variables like clicks, moves, level..
    this.clicks = 0;

    // Refresh images.
    this.setImages();

    this.loadNewImage();
  }

  /**
   * Load image for given source path.
   * @param {string} src - Path to image which will be loaded.
   */
  public loadNewImage(src: string = this.src): void {

    // Show elements of view.
    this.loading = true;
    this.show = true;
    this.preview = true;


    // Update src.
    this.image.src = src;
  }
}
