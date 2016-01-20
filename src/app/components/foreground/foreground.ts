import {Component, ViewChild, ViewEncapsulation, Renderer, AfterViewInit, OnDestroy} from 'angular2/core';
import {Observable, Subscription} from 'rxjs/Rx';

import {CanvasService} from '../../services/canvas/canvas.service';
import {EventService} from '../../services/event/event.service';
import {LinesComponent} from '../lines/lines';
import {PuzzlesComponent} from '../puzzles/puzzles';


@Component({
  selector: 'foreground-component',
  directives: [
    LinesComponent,
    PuzzlesComponent
  ],
  encapsulation: ViewEncapsulation.None,
  template: require('./foreground.html'),
  styles: [ require('./foreground.css') ]
})
export class ForegroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('element') element;

  // Events to unsubscribe from on destroy of the component.
  private load: Subscription<any> = null;
  private error: Subscription<any> = null;

  /**
   * Foreground's constructor. This component serves as "wrapper"
   * for canvas layers. It emits specific click and image load events.
   * @param {CanvasService} cs - Provide data about canvas.
   */
  constructor(public cs: CanvasService, public es: EventService, public renderer: Renderer) {

    /**
     * Listen for image load events. Because Riot servers might be
     * inaccessible sometimes, we try few times to load image before
     * throwing error.
     */
    this.load = Observable.fromEvent(this.cs.image, 'load')
      .retry(3)
      .subscribe(() => {
        this.cs.loading = false;

        this.cs.offsetLeft = this.element.nativeElement.offsetLeft;
        this.cs.offsetTop = this.element.nativeElement.offsetTop;

        this.renderer.setElementStyle(this.element, 'width', `${this.cs.cWidth}px`);
        this.renderer.setElementStyle(this.element, 'height', `${this.cs.cHeight}px`);

        this.es.gameStart.emit(null);
       });

    // Something went wrong. Let's try to load another image.
    // TODO: Stop loading new images if error is thrown multiple
    // times in a row. Maybe user lost internet connection, and
    // we don't want to drop into infinite loop.
    this.error = Observable.fromEvent(this.cs.image, 'error')
      .subscribe(() => this.cs.loadNewImage());
  }



  /**
   * Update canvas' wrapper dimensions.
   */
  public ngAfterViewInit(): void {
    this.renderer.setElementStyle(this.element, 'width', `${this.cs.cWidth}px`);
    this.renderer.setElementStyle(this.element, 'height', `${this.cs.cHeight}px`);
  }


  /**
   * Prevent memory leak and bugs if user change route during game.
   */
  public ngOnDestroy(): void {
    this.load.unsubscribe();
    this.error.unsubscribe();
  }


  /**
   * Get valuable information about click on canvas.
   * @param {MouseEvent} event - Event object of click/mousemove etc.
   * @returns {Object} Object containing info about mouse position relative
   * to the canvas, row and col of clicked position(both 0-based), and index
   * of piece(0-based).
   */
  private getClickInfo(event: MouseEvent): {x: number, y: number, row: number, col: number, index: number} {

    // Click position relative to canvas.
    const x: number = event.pageX - this.cs.offsetLeft;
    const y: number = event.pageY - this.cs.offsetTop;

    // Get clicked row and col.
    const row: number = Math.floor(y / this.cs.dHeight);
    const col: number = Math.floor(x / this.cs.dWidth);

    // Get clicked piece index.
    const index: number = row * this.cs.cols  + col;

    return {
      x, y, row, col, index
    }
  }


  /**
   * Emit proper events on click.
   * @param {MouseEvent} event - Mouse click event.
   */
  private emit(event: MouseEvent): void {

    // Do nothing if pieces are not shuffle yet.
    if (this.cs.preview || !this.cs.show) {
      return;
    }

    // Get index of clicked piece.
    const {index} = this.getClickInfo(event);

    // On even clicks, emit selection.
    if ( !(this.cs.clicks++ % 2) ) {
      this.es.select.emit(index);

    // On odd, emit swap.
    } else {
      this.es.swap.emit(index);
    }
  }
}
