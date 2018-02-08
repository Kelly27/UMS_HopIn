//ionic native google map tutorial : https://codeburst.io/native-google-maps-and-geolocation-ionic-fe635a00249d
import { Component, ViewChild, ElementRef, NgZone} from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { BusLocationProvider } from '../../providers/bus-location/bus-location';
import {
    GoogleMaps,
    GoogleMap,
    GoogleMapsEvent,
    GoogleMapOptions,
    CameraPosition,
    MarkerOptions,
    Marker
} from '@ionic-native/google-maps';
// import { Observable } from 'rxjs/Observable';

// import { Geolocation } from '@ionic-native/geolocation';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    map: GoogleMap;
    @ViewChild('map') mapElement: ElementRef;
    private trafficFlag:boolean = false;
    testCheckboxOpen: boolean;
    testCheckboxResult = [true, false, false, false];
    public allBuses = [];
    public test:any;

    constructor(public navCtrl: NavController,
        public alertCtrl: AlertController,
        private googleMaps: GoogleMaps,
        public busLocationProvider: BusLocationProvider,
        public zone: NgZone
        // private _geoLoc: Geolocation
        ) {
    }

    ionViewDidLoad() {
        // this.busLocationProvider.getLocationService();
        this.loadMap();
    }

    loadMap(){
        let mapOptions: GoogleMapOptions = {
            camera: {
                // target: {
                //     lat: 5.978840,
                //     lng: 116.07532
                // },
                zoom: 13
            }
        };

        let element = this.mapElement.nativeElement;
        this.map = this.googleMaps.create(element, mapOptions);

        // Wait the MAP_READY before using any methods.
        this.map.one(GoogleMapsEvent.MAP_READY)
        .then(() => {
            console.log('Map is ready!');
            this.map.setMyLocationEnabled(true);

            this.map.getMyLocation().then((location) => {
                let Loc = location.latLng;
                console.log(Loc);
                let option : CameraPosition <any> = {
                    target : Loc,
                    zoom : 15
                }
                this.map.moveCamera(option);
            });

            // let task = setInterval(() => {
            // }, 1000);

            // Now you can use all methods safely.
            this.map.addMarker({
                title: 'Ionic',
                icon: { url: './assets/icon/bus.png',
                size: { width: 35, height: 35}
            },
                animation: 'DROP',
                position: {
                    lat: 6.111,
                    lng: 110.4654
                }
            })
            .then(marker => {
                let interval = setInterval(() => {
                    this.busLocationProvider.getLocationService();
                    this.allBuses = this.busLocationProvider.allBuses
                    marker.setPosition(this.allBuses);
                    console.log('marker', this.allBuses);
                },1000);
                marker.on(GoogleMapsEvent.MARKER_CLICK)
                .subscribe(() => {
                    alert('clicked');
                });
            });


            //add polyline on map method
            var HND_AIR_PORT = {lat: 35.548852, lng: 139.784086};
            var SFO_AIR_PORT = {lat: 37.615223, lng: -122.389979};
            var HNL_AIR_PORT = {lat: 21.324513, lng: -157.925074};
            var AIR_PORTS = [
            HND_AIR_PORT,
            HNL_AIR_PORT,
            SFO_AIR_PORT
            ];
            this.map.addPolyline({
                points: AIR_PORTS,
                'color' : '#AA00FF',
                'width': 10,
                'geodesic': true
            });

        });
    }

    trafficToggle(){
        console.log(this.trafficFlag);
        this.trafficFlag = !this.trafficFlag;
        this.map.setTrafficEnabled(this.trafficFlag);
    }

    //alert for bus filter
    showBusFilter(){
        let alert = this.alertCtrl.create();
        alert.setSubTitle('Choose bus/buses that you wish to see.');

        alert.addInput({
            type:'checkbox',
            label: 'Bus 1',
            value: 'value1',
            checked: this.testCheckboxResult[0]
        });

        alert.addInput({
            type:'checkbox',
            label: 'Bus 2',
            value: 'value2',
            checked: this.testCheckboxResult[1]
        });

        alert.addInput({
            type:'checkbox',
            label: 'Bus 3',
            value: 'value3',
            checked: this.testCheckboxResult[2]
        });

        alert.addInput({
            type:'checkbox',
            label: 'Bus 4',
            value: 'value4',
            checked: this.testCheckboxResult[3]
        });

        alert.addButton('Cancel');
        alert.addButton({
            text: 'Okay',
            handler: data => {
                console.log('data: ', data);
                this.testCheckboxOpen = false;
                this.testCheckboxResult = data;
            }
        });
        alert.present();
    }

    // getBusLocation(){
    //     this.busLocationProvider.getLocationService().subscribe(res => {
    //         this.allBuses = res;
    //     });

    // }
}
