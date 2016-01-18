import {Component, Input} from 'angular2/core';

import {Champion} from '../../services/canvas/Champion';


@Component({
  selector: 'splash-art-info-component',
  template: require('./splashArtInfo.html')
})
export class SplashArtInfoComponent {
  @Input() champion: Champion;
}
