/**
 * Class representing a timer.
 * @class
 */
export class Timer {

  // Time of previous frame in miliseconds.
  private prevFrame: number = null;

  // Timer is circle, so base timer has to have 360 degress.
  private degrees: number = 360;

  // Amount of degrees to be drawn pew 1 second.
  private degreesPerSecond: number = null;

  // Id of requestAnimationFrame.
  private id: number = null;



  /**
   * Creates circle which represents a timer.
   * @param {CanvasRenderingContext2D} context - Context on which timer
   * will be drawed.
   * @param {number} seconds - Amount of seconds for timer to be animated.
   * @param {number} cx - x-center of circle.
   * @param {number} cy - y-center of circle.
   * @param {number} radius - Radius of circle.
   */
  constructor(
    private context: CanvasRenderingContext2D,
    private duration: number,
    private cx: number,
    private cy: number,
    private radius: number
  ) {

    this.degreesPerSecond = this.degrees / this.duration;

    this.context.save();

    // Context settings.
    this.context.globalAlpha = 0.7;
    this.context.globalCompositeOperation = 'source-out';
    this.context.fillStyle = '#fff';

    // Set time of not existing frame on creating time.
    this.prevFrame = Date.now();
  }


  /**
   * Draw full circle of part of it.
   */
  private draw(): void {

    // Calculate radians from degrees.
    const radians = (this.degrees * Math.PI) / 180 - (0.5 * Math.PI);

    this.context.moveTo(this.cx, this.cy);

    // Start path.
    this.context.beginPath();

    // Create arc to given degrees.
    this.context.arc(this.cx, this.cy, this.radius, 1.5 * Math.PI, radians, false);

    // Make line to center and close path.
    this.context.lineTo(this.cx, this.cy);
    this.context.closePath();

    // Draw it!
    this.context.fill();
  }


  /**
   * Animate timer from base length of arc to 0.
   * @param {Function} callback - Callback to be executed when
   * animation is completed.
   * @param {any} thisArg - Context for callback.
   * @param {any[]} argArray - Arguments to be passed to the callback.
   * @return {any | void} Value returned bu callback or undefined.
   */
  public animate(callback: Function, thisArg?: any, ...argArray: any[]): any | void {

    // Calculate time difference between last frame and current one in seconds.
    const now = Date.now();
    const delta = (now - this.prevFrame) / 1000;

    // Degrees to be drawed to in current frame.
    this.degrees -= this.degreesPerSecond * delta;

    // No more circle to draw?
    if (this.degrees <= 0) {

      // Restore styles after job.
      this.context.restore();

      // Reset timer before next animation.
      this.reset();

      // Better safe than sorry.
      if (callback instanceof Function) {
        return callback.apply(thisArg, argArray);
      }

      // Looks like callback is not a function!
      return;
    }

    // Set time of current frame to previous one.
    this.prevFrame = now;

    // Redraw timer!
    this.draw();

    // TODO: Use various prefixed raf for better support.
    // Let browser handle animation and save id.
    this.id = window.requestAnimationFrame(this.animate.bind(this, callback, thisArg, ...argArray));
  }


  /**
   * Reset degrees of timer to full circle.
   */
  public reset(): void {
    this.degrees = 360;
  }


  /**
   * Pause or totaly cancel animation.
   * @param {boolean} reset - Determines if timer is reseted.
   */
  public pause(reset: boolean): void {
    if (reset) {
      this.reset();
    }

    window.cancelAnimationFrame(this.id);
  }
}
