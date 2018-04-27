import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BusScheduleProvider } from '../bus-schedule/bus-schedule';
import { RouteProvider } from '../route/route';
import 'rxjs/add/operator/map';
import { ToastController  } from 'ionic-angular';

/*
  Generated class for the BusLocationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BusLocationProvider {

    public all_buses = [];

    constructor(
        public http: Http,
        public busScheduleProvider: BusScheduleProvider,
        public routeProvider: RouteProvider,
        public toastCtrl: ToastController,
     ) {
        console.log('Hello BusLocationProvider Provider');
    }

    getLocationService(){
        this.http.get('http://umshopin.com/umshopin_admin/api/bus/getBusTrackingData')
        .map(response => response.json())
        .subscribe((res) => {
            this.all_buses = res;
        }, (err) => {
            // this.resetObs();
            let toast = this.toastCtrl.create({
                message: 'something is wrong! ' + err,
                duration: 1500,
                position: 'top'
            });

            toast.present();
            console.log('something is wrong! ' + err); //KIV: always internal server error
        });
    }
}
