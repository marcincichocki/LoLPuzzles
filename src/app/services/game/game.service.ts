import {Injectable} from 'angular2/core';

import {Piece} from './Piece';
import {Cell} from './Cell';


@Injectable()
export class GameService {

  // Store current streak of well placed pieces.
  public streak: number = 0;

  // Holds every piece's data used to swap and check if puzzle is solved.
  public pieces: Piece[] = [];

  // Amount of time in seconds, in which preview of image will be
  // displayed, and after which pieces will be created and randomized.
  public timeout: number = 5;


  /**
   * Check how many of given pieces are in right spot. Used to count
   * streak of last swap.
   * @param {Piece} p1 - First clicked piece.
   * @param {Piece} p2 - Second cliecked piece.
   * @return {number} Amount of given pieces in correct spot.
   */
  getStreak(p1: Piece, p2: Piece): number {
    const first = p1.isRightSpot();
    const second = p2.isRightSpot();

    // Both pieces are in right spot.
    if ( first && second ) {
      return 2;

    // None of them.
    } else if ( !first && !second ) {
      return 0;

    // If none of above, then at least one has to be placed right.
    } else {
      return 1;
    }
  }

  updateScore(currentStreak: number): void {
    // TODO: Create score formula.

    if (currentStreak) {
      this.streak += currentStreak;
    } else {
      this.streak = 0;
    }
  }

  /**
   * Add new piece to pieces array.
   * @param {number} index - Original place of piece in puzzle.
   * @param {number} currentIndex - Random place of piece in puzzle.
   * @param {number} sx - Left offset relative to source image.
   * @param {number} sy - Top offset relative to source image.
   * @param {number} dx - Left offset relative to canvas.
   * @param {number} dy - Top offset relative to canvas.
   * @returns {Piece} Returns piece from given parameters.
   */
  public addPiece(index: number, currentIndex: number, sx: number, sy: number, dx: number, dy: number): Piece {
    return this.pieces[this.pieces.length] = new Piece(index, currentIndex, sx, sy, dx, dy);
  }


  /**
   * Get piece for given currentIndex.
   * @param  {number} currentIndex - Index of clicked piece.
   * @returns {Piece} Object representing current piece.
   */
  public getPiece(currentIndex: number): Piece {
    return this.pieces.find(piece => piece.currentIndex === currentIndex);
  }


  /**
   * Determines if puzzle is solved.
   * @returns {boolean} Returns true if puzzle is solved. This means
   * every piece of the puzzle is in the original spot.
   */
  public isSolved(): boolean {
    return this.pieces.every(piece => piece.isRightSpot());
  }


  /**
   * Generates list of random cells.
   * @param {number} rows - Amount of rows, 1-based.
   * @param {number} cols - Amount of cols, 1-based.
   * @returns {Function} Function that return unique cell.
   */
  public raffle(rows: number, cols: number): (row: number, col: number) => Cell {

    /**
     * Array contains every cell. We will get elements
     * from this array via closure.
     */
    let cells: Cell[] = [];

    // Fill array with cells.
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        cells[cells.length] = new Cell(row, col);
      }
    }

    // Randomize them.
    cells.sort(() => 0.5 - Math.random());

    /**
     * Get random cell that is NOT in given row and column.
     * @param {number} row - Row of piece.
     * @param {number} col - Column of piece.
     * @returns {Cell} Unique cell.
     */
    return (row, col) =>
      ((cells[cells.length - 1].col !== col) && (cells[cells.length - 1].row !== row))
        ? cells.pop()
        : cells.shift();
  }
}
