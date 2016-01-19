import {NewGameComponent} from './components/newGame/newGame';
import {HighscoresComponent} from './components/highscores/highscores';


export var Routes = {
  foreground: {
    path: '/',
    name: 'New game',
    component: NewGameComponent
  },
  highscores: {
    path: '/highscores',
    name: 'Highscores',
    component: HighscoresComponent
  }
}

export const APP_ROUTES = Object.keys(Routes).map(prop => Routes[prop]);
