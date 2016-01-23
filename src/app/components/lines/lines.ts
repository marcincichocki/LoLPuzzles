import {Component} from 'angular2/core';

import {Layer} from '../layer/layer';
import {CanvasService} from '../../services/canvas/canvas.service';
import {GameService} from '../../services/game/game.service';
import {EventService} from '../../services/event/event.service';


@Component({
  selector: 'lines-component',
  template: require('../layer/layer.html'),
  styles: [`
    canvas {
      z-index: 2;
    }
  `]
})
export class LinesComponent extends Layer {

  // "Clock" is expressed as full circle.
  private degrees: number = 360;

  // Time in milliseconds when previous frame of clock was displayed.
  private clockStart: number = null;



  /**
   * Lines' constructor. In this component we draw lines and "clock", so
   * user have notion where "is he", what is going on, and how much time
   * he has left till the end of preview image.
   * @param {GameService} gs - Store game specific data.
   * @param {CanvasService} cs - Provide data about canvas.
   */
  constructor(public gs: GameService, public cs: CanvasService, public es: EventService) {

    // Call parent constructor. Creates basic canvas playground.
    super();

    // Subscribe to events.
    this.event.gameStart = this.es.gameStart.subscribe(() => this.updateSize(this.cs.cWidth, this.cs.cHeight));

    this.event.shuffle = this.es.shuffle.subscribe(() => this.drawLines());

    this.event.gameEnd = this.es.gameEnd.subscribe(() => {
      this.drawLines();

      // Game over
    });

    this.event.select = this.es.select.subscribe((index) => this.select(index));

    this.event.swap = this.es.swap.subscribe((index) => this.drawLines());
  }


  /**
   * Draw area of circle to given radians from 0.
   * @param {number} to - Radian value to be drawed to.
   */
  private drawClock(to: number): void {

    // Save current styles.
    this.context.save();

    // Styles.
    this.context.strokeStyle = '#fff';
    this.context.lineWidth = 3;

    // Start path.
    this.context.beginPath();

    // Make line from center to circle border.
    this.context.moveTo(this.cs.cWidth / 2, this.cs.cHeight / 2);
    this.context.lineTo(this.cs.cWidth / 2 + this.cs.dWidth * 0.7, this.cs.cHeight / 2);

    // Create arc with length of [to].
    this.context.arc(this.cs.cWidth / 2, this.cs.cHeight / 2, this.cs.dWidth * 0.7, 0, to, false);

    // Make line to center and close path.
    this.context.lineTo(this.cs.cWidth / 2, this.cs.cHeight / 2);
    this.context.closePath();

    // Draw it!
    this.context.stroke();

    // Restore styles after job.
    this.context.restore();
  }


  /**
   * Animate clock with fixed time.
   */
  private animateClock(): void {

    // Current time.
    const now = Date.now();

    // Time difference between last frame and current one in miliseconds.
    const delta = now - this.clockStart || 1;

    // Degrees to be drawed to in current frame.
    const degreesCurrentFrame = (360 / this.gs.timeout) * delta / 1000;
    this.degrees -= degreesCurrentFrame;

    // No more clocks to draw?
    if (this.degrees <= 0) {

      // Reset clock before next animation.
      this.degrees = 360;

      // Draw lines.
      this.drawLines();

      // Quit.
      return;
    }

    // Set new time for starting frame.
    this.clockStart = now;

    // Count radians.
    const radians = (this.degrees * Math.PI) / 180;

    // Redraw clock.
    this.context.clearRect(0, 0, this.cs.cWidth, this.cs.cHeight);
    this.drawClock(radians);

    // TODO: Use various prefixed raf for better support.
    // Let browser handle animation.
    window.requestAnimationFrame(this.animateClock.bind(this));
  }


  /**
   * Draw indicator on selected piece, for better user experience.
   * @param {number} index - Index of piece.
   */
  private select(index: number): void {

    // Get piece of given index.
    const piece = this.gs.getPiece(index);

    // Save context.
    this.context.save();

    // Set styles.
    this.context.lineWidth = 3;
    this.context.strokeStyle = 'green';

    // Draw mightier border, with different color.
    this.context.clearRect(piece.dx, piece.dy, this.cs.dWidth, this.cs.dHeight);
    this.context.strokeRect(piece.dx, piece.dy, this.cs.dWidth, this.cs.dHeight);

    // Restore styles, so borders will be drawn as intended.
    this.context.restore();
  }


  /**
   * Draw lines between puzzle pieces.
   * @param {string} [color = '#f00'] - Color of lines(parsed as CSS).
   */
  private drawLines(color: string = '#f00'): void {
    this.context.clearRect(0, 0, this.cs.cWidth, this.cs.cHeight);
    this.context.beginPath();
    /**
     * Vertical lines
     */
    for (let x: number = this.cs.dWidth; x < this.cs.cWidth; x += this.cs.dWidth) {
      this.context.moveTo(0.5 + x, 0);
      this.context.lineTo(0.5 + x, this.cs.cHeight);
    }

    /**
     * Horizontal lines.
     */
    for (let y: number = this.cs.dHeight; y < this.cs.cHeight; y += this.cs.dHeight) {
      this.context.moveTo(0, 0.5 + y);
      this.context.lineTo(this.cs.cWidth, 0.5 +  y);
    }

    this.context.strokeStyle = color;

    // border
    this.context.strokeRect(0.5, 0.5, this.cs.cWidth - 0.5, this.cs.cHeight - 0.5);
    this.context.stroke();
  }
}
