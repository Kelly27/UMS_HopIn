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

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    map: GoogleMap;
    @ViewChild('map') mapElement: ElementRef;

    constructor(public navCtrl: NavController,
        private googleMaps: GoogleMaps) {

    }

    ionViewDidLoad() {
        this.loadMap();
        console.log('running');
    }

    loadMap(){
        let mapOptions: GoogleMapOptions = {
            camera: {
                target: {
                    lat: 5.978840,
                    lng: 116.07532
                },
                zoom: 13
            }
        };

        let element = this.mapElement.nativeElement;
        this.map = this.googleMaps.create(element, mapOptions);

        // Wait the MAP_READY before using any methods.
        this.map.one(GoogleMapsEvent.MAP_READY)
        .then(() => {
            console.log('Map is ready!');
            this.map.setTrafficEnabled(true);
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

}
