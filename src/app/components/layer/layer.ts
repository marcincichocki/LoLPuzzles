import {AfterViewInit, ViewChild, OnDestroy} from 'angular2/core';
import {Subscription} from 'rxjs/Rx';


/**
 * Extend any component to implement basic canvas playground.
 *
 * You can use basic template or your own, but canvas html element
 * MUST includes "#element" property.
 *
 * ```html
 * <canvas #element></canvas>
 * ```
 */
export class Layer implements AfterViewInit, OnDestroy {
  @ViewChild('element') element;

  // Canvas html element.
  public canvas: HTMLCanvasElement = null;

  // 2d context.
  public context: CanvasRenderingContext2D = null;

  // Events which every layer will subscribe to.
  public event = {
    imageLoaded: null,
    select: null,
    swap: null
  };


  /**
   * Get canvas and its context after view is created.
   */
  ngAfterViewInit(): void {
    this.canvas = this.element.nativeElement;
    this.context = this.canvas.getContext('2d');
  }

  /**
   * Unsubscribe from events when component is destroyed.
   */
  ngOnDestroy(): void {
    Object.keys(this.event).forEach((key) => {
      this.event[key].unsubscribe();
    });
  }

  /**
   * Update size of canvas.
   * @param {number} width - Width to be set on the canvas.
   * @param {number} height - Height to be set on the canvas.
   */
  updateSize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
  }
}
