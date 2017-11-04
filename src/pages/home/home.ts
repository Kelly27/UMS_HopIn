//ionic nativr google map tutorial : https://codeburst.io/native-google-maps-and-geolocation-ionic-fe635a00249d
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';

import {
    GoogleMaps,
    GoogleMap,
    GoogleMapsEvent,
    GoogleMapOptions,
    CameraPosition,
    MarkerOptions,
    Marker
} from '@ionic-native/google-maps';

// import { Geolocation } from '@ionic-native/geolocation';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    map: GoogleMap;
    @ViewChild('map') mapElement: ElementRef;
    private trafficFlag:boolean = false;
    // public Lat: float;
    // public Lng: float;

    constructor(public navCtrl: NavController,
        private googleMaps: GoogleMaps,
        // private _geoLoc: Geolocation
    ) {

    }

    ionViewDidLoad() {
        this.loadMap();

        console.log('running');
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
                    zoom : 13
                }
                this.map.moveCamera(option);
            });

            // Now you can use all methods safely.
            this.map.addMarker({
                title: 'Ionic',
                icon: 'blue',
                animation: 'DROP',
                position: {
                    lat: 5.978840,
                    lng: 116.07532
                }
            })
            .then(marker => {
                marker.on(GoogleMapsEvent.MARKER_CLICK)
                .subscribe(() => {
                    alert('clicked');
                });
            });

        });
    }

    traffic_on(){
        console.log(this.trafficFlag);
        if(this.trafficFlag === false){
            this.trafficFlag = true;
            this.map.setTrafficEnabled(this.trafficFlag);
        }
        else{
            this.trafficFlag = false;
            this.map.setTrafficEnabled(this.trafficFlag);
        }
    }
}
