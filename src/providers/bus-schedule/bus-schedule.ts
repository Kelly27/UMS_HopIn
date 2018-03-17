import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the BusScheduleProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BusScheduleProvider {

    constructor(public http: Http) {
        console.log('Hello BusScheduleProvider Provider');
    }

    getETA(origin, destination){
        return this.http.get('http://umshopin.com/umshopin_admin/api/bus/getETA/origin=' + origin + '/destination=' + destination)
            .map(response => response.json());
    }

}
