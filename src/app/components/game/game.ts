import {Component} from 'angular2/core';

import {ScoreComponent} from '../score/score';
import {SplashArtInfoComponent} from '../splashArtInfo/splashArtInfo';
import {ForegroundComponent} from '../foreground/foreground';
import {CanvasService} from '../../services/canvas/canvas.service';

@Component({
  selector: 'new-game-component',
  template: require('./newGame.html'),
  directives: [
    ScoreComponent,
    SplashArtInfoComponent,
    ForegroundComponent
  ]
})
export class NewGameComponent {
  constructor(public cs: CanvasService) { }
}
