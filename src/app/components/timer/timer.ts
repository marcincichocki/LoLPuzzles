import {Component} from 'angular2/core';

import {Layer} from '../layer/layer';
import {CanvasService} from '../../services/canvas/canvas.service';
import {GameService} from '../../services/game/game.service';
import {EventService} from '../../services/event/event.service';
import {Timer} from '../../services/game/Timer';


@Component({
  selector: 'timer-component',
  template: require('../layer/layer.html'),
  styles: [`
    canvas {
      z-index: 3;
    }
  `]
})
export class TimerComponent extends Layer {



  /**
   * Timer's constructor. In this component we draw "clock", so
   * user have notion how much time he has left.
   * @param {GameService} gs - Store game specific data.
   * @param {CanvasService} cs - Provide data about canvas.
   * @param {EventService} cs - Provide event hooks.
   */
  constructor(public gs: GameService, public cs: CanvasService, public es: EventService) {

    // Call parent constructor. Creates basic canvas playground.
    super();

    this.event.gameStart = this.es.gameStart.subscribe(() => {
      this.updateSize(this.cs.cWidth, this.cs.cHeight);

      if (this.gs.levelTimer) {
        this.gs.levelTimer.pause(true);
      }

      const { r1, r2 } = this.cs.cWidth > this.cs.cHeight
        ? this.getRadius(this.cs.cHeight)
        : this.getRadius(this.cs.cWidth);

      const preview = new Timer(this.context, this.gs.previewDuration, this.cs.cWidth / 2, this.cs.cHeight / 2, r1);

      // Animate preview timer.
      preview.animate(() => {
        this.es.shuffle.emit(null);

        this.gs.levelTimer = new Timer(this.context, this.gs.levelDuration, this.cs.dWidth / 2, this.cs.dHeight / 2, r2);

        // Animate level timer.
        this.gs.levelTimer.animate(() => {
          this.context.clearRect(0, 0, this.cs.cWidth, this.cs.cHeight);
          this.es.gameEnd.emit(null);
        });
      });
    });

    this.event.resolved = this.es.resolved.subscribe(() => this.gs.levelTimer.pause(true));
  }



  /**
   * Get radius for preview and level timer, based on given length.
   * @param {number} length - Length of smaller border(so timer will
   * always be visible).
   * @return {Object} Object which contains radiuses of preview and
   * level timer respectively.
   */
  private getRadius(length: number): { r1: number, r2: number } {
    const r1 = length / 4;
    const r2 = r1 / 3;

    return { r1, r2 };
  }
}
