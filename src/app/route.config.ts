import {NewGameComponent} from './components/newGame/newGame';
import {HighscoresComponent} from './components/highscores/highscores';


export var Routes = {
  foreground: {
    path: '/',
    as: 'New game',
    component: NewGameComponent
  },
  highscores: {
    path: '/highscores',
    as: 'Highscores',
    component: HighscoresComponent
  }
}

export const APP_ROUTES = Object.keys(Routes).map(prop => Routes[prop]);
