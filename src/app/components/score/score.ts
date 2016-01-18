import {Component} from 'angular2/core';

import {GameService} from '../../services/game/game.service';


@Component({
  selector: 'score-component',
  template: require('./score.html')
})
export class ScoreComponent {
  constructor(public gs: GameService) { }
}
