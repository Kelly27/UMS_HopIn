import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
/**
 * Generated class for the BusSchedulePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-bus-schedule',
    templateUrl: 'bus-schedule.html',
})
export class BusSchedulePage {

    public route:string = 'Basic Campus';
    public stops = ['Kolej Kediaman E', 'TM/TF', 'FKJ', 'PPIB', 'Dewan Resital', 'IPB', 'IPMB/Simpang Odec', 'Canselori'];

    constructor(
        public navCtrl: NavController, 
        public navParams: NavParams,
        public http: Http
    ) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad BusSchedulePage');
    }

    

}
