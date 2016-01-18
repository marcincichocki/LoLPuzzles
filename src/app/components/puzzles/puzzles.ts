import {Component, EventEmitter, Output} from 'angular2/core';

import {Layer} from '../layer/layer';
import {CanvasService} from '../../services/canvas/canvas.service';
import {GameService} from '../../services/game/game.service';


@Component({
  selector: 'puzzles-component',
  outputs: ['resolved'],
  template: require('../layer/layer.html'),
  styles: [`
    canvas {
      z-index: 1;
    }
  `]
})
export class PuzzlesComponent extends Layer {

  // Store selected index.
  private firstIndex: number = null;

  /**
   * Success event. Foreground component can subscribe to it,
   * and run a callback.
   */
  private resolved: EventEmitter<any> = new EventEmitter();


  /**
   * Puzzle's constructor. It is a canvas layer on which puzzle
   * is displayed. This component emit `resolved` events.
   * @param {GameService} gs - Store game specific data.
   * @param {CanvasService} cs - Provide data about canvas.
   */
  constructor(private gs: GameService, private cs: CanvasService) {

    // Call parent constructor. Creates basic canvas playground.
    super();

    // Subscribe to events.
    this.event.imageLoaded = this.cs.imageLoaded.subscribe(() => {
      this.updateSize(this.cs.cWidth, this.cs.cHeight);

      this.context.clearRect(0, 0, this.cs.cWidth, this.cs.cHeight);
      this.context.drawImage(this.cs.image, 0, 0, this.cs.cWidth, this.cs.cHeight);

      window.setTimeout(this.shuffle.bind(this), this.gs.timeout * 1000);
    });

    this.event.select = this.cs.select.subscribe((index) => {
      this.firstIndex = index;
    });

    this.event.swap = this.cs.swap.subscribe((index) => {
      const resolved = this.swap(this.firstIndex, index, true);

      // TODO: Refector this...
      // Update score after swap.
      this.gs.updateScore(
        this.gs.getStreak(
          this.gs.getPiece(this.firstIndex),
          this.gs.getPiece(index)
        )
      );

      // TODO: Some nice looking confirm modal.
      // Puzzle is resolved!
      if (resolved && confirm('Nice job! Next level?')) {
        this.resolved.emit(null);
      }
    });
  }



  /**
   * Draw given text in the middle of the canvas.
   * @param {string} message - Text to be printed.
   * @param {string} [bgcolor = '#f00'] - Background color(CSS selector).
   */
  private drawText(text: string | number, bgcolor: string = '#fff'): void {

    // Clear canvas.
    this.context.clearRect(0, 0, this.cs.cWidth, this.cs.cHeight);

    /**
     * Draw background.
     */
    this.context.fillStyle = bgcolor;
    this.context.fillRect(0, 0, this.cs.cWidth, this.cs.cHeight);

    /**
     * Font settings.
     */
    this.context.textBaseline = 'middle';
    this.context.textAlign = 'center';
    this.context.font = '48px serif';
    this.context.fillStyle = '#000';

    // Draw text in the middle.
    this.context.fillText(text.toString(), this.cs.cWidth / 2, this.cs.cHeight / 2);
  }


  /**
   * Devide image to given amount of rows and columns, and shufle pieces.
   * @param {number} [rows = this.cs.rows] - Amount of rows, 1-based.
   * @param {number} [cols = this.cs.cols] - Amount of columns, 1-based.
   */
  private shuffle(rows: number = this.cs.rows, cols: number = this.cs.cols): void {

    // Clear canvas.
    this.context.clearRect(0, 0, this.cs.cWidth, this.cs.cHeight);

    // We don't need old pieces.
    this.gs.pieces = [];

    // Generate randomize array of cells.
    const getRandomCell = this.gs.raffle(rows, cols);

    for (let row: number = 0; row < rows; row += 1) {
      for (let col: number = 0; col < cols; col += 1) {

        // Generate random row and col.
        const {row: rRow, col: rCol} = getRandomCell();

        // Calculate positions of piece and image.
        const sx = (this.cs.dWidth * col) / this.cs.ratio;
        const sy = (this.cs.dHeight * row) / this.cs.ratio;
        const dx = this.cs.dWidth * rCol;
        const dy = this.cs.dHeight * rRow;

        // Push array of with new piece.
        this.gs.addPiece(
          cols * row + col,
          cols * rRow + rCol,
          sx, sy, dx, dy
        );

        // Draw part of image on canvas.
        this.context.drawImage(
          this.cs.image,
          sx, sy, (this.cs.dWidth / this.cs.ratio), (this.cs.dHeight / this.cs.ratio),
          dx, dy, this.cs.dWidth, this.cs.dHeight
        );
      }
    }

    // Redraw image if puzzle is solved alredy(yeah, no luck allowed).
    if ( this.gs.isSolved() ) {
      return this.shuffle();
    }


    this.cs.preview = false;
  }


  /**
   * Swap two pieces for given ids.
   *
   * Id is calculated by:
   * Max columns multiplied by row of piece plus column of piece.
   *
   * Example:
   * On 3x3 layout last piece would have id = 3 * 2 + 2 = 8.
   *
   * Attention! row and column of piece are 0-based,
   * but max columns is 1-based.
   *
   * @param {number} firstId - Id of first piece to swap.
   * @param {number} secondId - Id of second piece to swap.
   * @param {boolean} [checkIfSolved] - Check if the puzzle is solved.
   * @returns {void | boolean} Returns boolean value if puzzle is
   * solved, but only if `checkIfSolved` parametr is specified and
   * it is truthy.
   */
  private swap(firstId: number, secondId: number, checkIfSolved?: boolean): void | boolean {

    // Get pieces to swap.
    const fp = this.gs.getPiece(firstId);
    const sp = this.gs.getPiece(secondId);

    // Clear space which will be redrawn.
    this.context.clearRect(fp.dx, fp.dy, this.cs.dWidth, this.cs.dHeight);
    this.context.clearRect(sp.dx, sp.dy, this.cs.dWidth, this.cs.dHeight);


    // Draw second piece in place of the first.
    this.context.drawImage(
      this.cs.image,
      sp.sx, sp.sy, (this.cs.dWidth / this.cs.ratio), (this.cs.dHeight / this.cs.ratio),
      fp.dx, fp.dy, this.cs.dWidth, this.cs.dHeight
    );

    // And first in place of the second piece.
    this.context.drawImage(
      this.cs.image,
      fp.sx, fp.sy, (this.cs.dWidth / this.cs.ratio), (this.cs.dHeight / this.cs.ratio),
      sp.dx, sp.dy, this.cs.dWidth, this.cs.dHeight
    );

    // Swap currentIndex, dx and dy properties.
    [fp.currentIndex, sp.currentIndex] = [sp.currentIndex, fp.currentIndex];
    [fp.dx, sp.dx] = [sp.dx, fp.dx];
    [fp.dy, sp.dy] = [sp.dy, fp.dy];

    // Check if puzzle is solved.
    if (checkIfSolved) {
      return this.gs.isSolved();
    }
  }
}
