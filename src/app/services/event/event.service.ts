import {Injectable, EventEmitter} from 'angular2/core';


@Injectable()
export class EventService {

  // After image is loaded.
  public gameStart: EventEmitter<{}> = new EventEmitter();

  // After all time elapsed
  public gameEnd: EventEmitter<{}> = new EventEmitter();

  // Puzzle solved.
  public resolved: EventEmitter<{}> = new EventEmitter();

  // After preview.
  public shuffle: EventEmitter<{}> = new EventEmitter();


  /**
   * Clicks on canvas.
   */

  // Even clicks. Emits index of clicked piece.
  public select: EventEmitter<number> = new EventEmitter();

  /**
   * Odd clicks on canvas.
   * Emits index of clicked piece.
   */
  public swap: EventEmitter<number> = new EventEmitter();
}
