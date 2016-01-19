import {NewGameComponent} from './components/game/game';
import {HighscoresComponent} from './components/highscores/highscores';


export var Routes = {
  game: {
    path: '/game',
    name: 'Game',
    component: NewGameComponent,
    useAsDefault: true
  },
  highscores: {
    path: '/highscores',
    name: 'Highscores',
    component: HighscoresComponent
  }
}

export const APP_ROUTES = Object.keys(Routes).map(prop => Routes[prop]);
