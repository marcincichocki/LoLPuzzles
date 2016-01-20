import {bootstrap} from 'angular2/platform/browser';
import {AppComponent} from './components/app/app';
import {ROUTER_PROVIDERS} from 'angular2/router';

import {GameService} from './services/game/game.service';
import {CanvasService} from './services/canvas/canvas.service';
import {EventService} from './services/event/event.service';


bootstrap(AppComponent, [
  ...ROUTER_PROVIDERS,
  GameService,
  CanvasService,
  EventService
]).catch(error => console.error(error));

