import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the BusLocationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BusLocationProvider {
    public allBuses = null;
    constructor(public http: Http) {
        console.log('Hello BusLocationProvider Provider');
    }

    getLocationService(){
        return this.http.get('http://umshopin.com/umshopin_admin/api/bus/getBusTrackingData')
        .map(response => response.json());
    }
}
