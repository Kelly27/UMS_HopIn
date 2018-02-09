//ionic native google map tutorial : https://codeburst.io/native-google-maps-and-geolocation-ionic-fe635a00249d
import { Component, NgZone} from '@angular/core';
import { NavController } from 'ionic-angular';
import { BusLocationProvider } from '../../providers/bus-location/bus-location';
import { MapComponent } from '../../components/map/map';

// import { Geolocation } from '@ionic-native/geolocation';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
})
export class HomePage {

    public allBuses = null;
    public test:any;

    constructor(public navCtrl: NavController,
        public busLocationProvider: BusLocationProvider,
        public zone: NgZone
        // private _geoLoc: Geolocation
    ){
    }

    ionViewDidLoad() {
    }

}
