
/**
 * Class determines single piece of image.
 * @class
 */
export class Piece {

  /**
   * Piece class describes every "part" of puzzle.
   *
   * index and currentIndex are calculated in the same way:
   *
   * ```javascript
   *   var index = cols * row + col
   * ```
   *
   * where cols is ammount columns in row,
   * row is 0-based number of row and
   * col is 0-based number of col.
   *
   *
   * If index is equal currentIndex, that means piece is in right position.
   * If every piece's index is equal currentIndex, that means puzzle is solved.
   *
   *
   * @param {number} index - Original place of piece in puzzle.
   * @param {number} currentIndex - Random place of piece in puzzle.
   * @param {number} sx - Left offset relative to source image.
   * @param {number} sy - Top offset relative to source image.
   * @param {number} dx - Left offset relative to canvas.
   * @param {number} dy - Top offset relative to canvas.
   */
  constructor(

    // Original position of piece.
    public index: number,

    // Current position of piece, can be changed by the user.
    public currentIndex: number,

    /**
     * Left and top corner of the image(width and height are
     * calculated in canvas service)
     */
    public sx: number,
    public sy: number,

    /**
     * Left and top corner position of the piece in canvas.
     * Basically, those coordinates determines where on the
     * canvas, piece is displayed.
     */
    public dx: number,
    public dy: number
  ) { }


  /**
   * Determines if piece is in the right spot.
   * @returns {boolean} Boolean value determines if piece is
   * in the right position.
   */
  isRightSpot(): boolean {
    return this.index === this.currentIndex;
  }
}
