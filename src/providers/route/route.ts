import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the RouteProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
// declare var google;

@Injectable()
export class RouteProvider {

  constructor(public http: Http) {
    console.log('Hello RouteProvider Provider');
  }

  public selectedRoute = [];

  getRoutes(){
    return this.http.get('http://umshopin.com/umshopin_admin/api/route/getRoute')
      .map(response => response.json());
  }

  setSelectedRoute(routes){
    this.selectedRoute = routes;
  }
}
