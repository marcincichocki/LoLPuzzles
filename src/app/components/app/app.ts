import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {Routes, APP_ROUTES} from '../../route.config';


@Component({
  selector: 'app-component',
  template: require('./app.html'),
  directives: [ROUTER_DIRECTIVES]
})
@RouteConfig(APP_ROUTES)
export class AppComponent {
  private routes = Routes;
}
