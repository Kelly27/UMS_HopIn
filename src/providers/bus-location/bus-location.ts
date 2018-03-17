import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BusScheduleProvider } from '../bus-schedule/bus-schedule';
import { RouteProvider } from '../route/route';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import {
    GoogleMaps,
    GoogleMapsEvent,
} from '@ionic-native/google-maps';

/*
  Generated class for the BusLocationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BusLocationProvider {
    public allBusMarkers = [];

    constructor(
        public http: Http,
        public busScheduleProvider: BusScheduleProvider,
        public routeProvider: RouteProvider
     ) {
        console.log('Hello BusLocationProvider Provider');
    }

    getLocationService(){
        return this.http.get('http://umshopin.com/umshopin_admin/api/bus/getBusTrackingData')
        .map(response => response.json());
    }
}
