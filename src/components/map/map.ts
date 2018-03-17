//generates the google map
import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import {
    GoogleMaps,
    GoogleMap,
    GoogleMapsEvent,
    GoogleMapOptions,
    CameraPosition,
    MarkerOptions,
    Marker,
    Spherical
} from '@ionic-native/google-maps';
import { Observable } from 'rxjs/Observable';
import { BusScheduleProvider } from '../../providers/bus-schedule/bus-schedule';
import { RouteProvider } from '../../providers/route/route';
import { MapProvider } from '../../providers/map/map';
import { RouteComponent } from '../route/route';
// import { BusStopComponent } from '../bus-stop/bus-stop';

// import * as SlidingMarker from "../../../node_modules/marker-animate-unobtrusive";
/**
 * Generated class for the MapComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
 @Component({
     selector: 'map',
     templateUrl: 'map.html',
 })
 export class MapComponent {

     public map: GoogleMap;
     @ViewChild('map') mapElement: ElementRef;
     private trafficFlag:boolean = false;

     public ETA:any;

     constructor(
         public googleMaps: GoogleMaps,
         public busScheduleProvider: BusScheduleProvider,
         public routeProvider: RouteProvider,
         public mapProvider: MapProvider
         ) {
         console.log('Hello MapComponent Component');
     }

     ngOnInit(){
         this.loadMap();
         this.getETA();
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

        this.mapProvider.setMap(this.map);
        // Wait the MAP_READY before using any methods.
        this.mapProvider.map.one(GoogleMapsEvent.MAP_READY)
        .then(() => {
            console.log('Map is ready!');
            this.mapProvider.map.setMyLocationEnabled(true);

            this.mapProvider.map.getMyLocation().then((location) => {
                let Loc = location.latLng;
                let option : CameraPosition <any> = {
                    target : Loc,
                    zoom : 15
                }
                this.mapProvider.map.moveCamera(option);
            });
        });

    }

    trafficToggle(){
        console.log(this.trafficFlag);
        this.trafficFlag = !this.trafficFlag;
        this.mapProvider.map.setTrafficEnabled(this.trafficFlag);
    }

    getETA(){
        this.busScheduleProvider.getETA().subscribe(res => {
            console.log('ETA', res);
        }, err => {
            console.log('ETA failed', err);
        });
    }

}
