import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { AlertController } from 'ionic-angular';
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
import { BusLocationProvider } from '../../providers/bus-location/bus-location';
import { Observable } from 'rxjs/Observable';
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
     public buses = new Array();
     private allMarkers = new Array();
     public allRoutes = [];

     constructor(
         public googleMaps: GoogleMaps,
         public alertCtrl: AlertController,
         public busLocationProvider: BusLocationProvider,
         public spherical: Spherical,
         public routeProvider: RouteProvider,
         public mapProvider: MapProvider
         ) {
         console.log('Hello MapComponent Component');
         this.getBuses();
     }

     ngOnInit(){
         console.log('const', this.buses);
         let myObservable = Observable.create(observer => {
             setInterval(() => {
                 this.getBuses();
                // bus markers
                if(this.buses){
                    observer.next(this.buses);
                }
            },2000);
         });

         myObservable.subscribe((data) => {
             if(this.buses){
                 for(var i = 0; i < this.buses.length; i++){
                     this.updateMarker(this.buses[i]);
                 }
             };
         });
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

    addBusMarker(bus){
        // var SlidingMarker = require('marker-animate-unobtrusive');
        let m = this.mapProvider.map.addMarker({
            position: JSON.parse(bus.bus_location),
            icon: {url: './assets/icon/bus.png', size: {width: 35, height: 45}},
        });
        this.allMarkers.push(m);
    }

    updateMarker(bus){
        for(var i = 0; i < this.allMarkers.length; i++){
            if(i +1 == bus.id){
                let location = JSON.parse(bus.bus_location);
                let track_status = bus.track_status
                //if location is null and track_status === 'OFF', delete marker,
                //else update marker position
                if(location == null && track_status){
                    this.allMarkers[i].then(marker => {
                        marker.remove();
                    });
                    this.allMarkers.splice(i, 1);
                    console.log(this.allMarkers);
                }
                else{
                    this.allMarkers[i].then(marker =>{
                        var newPosition = JSON.parse(bus.bus_location);
                        // marker.setPosition(newPosition);
                        //this.spherical.interpolate(originalPosition, newPosition, fraction); fraction means how many percent the marker should go.
                        marker.setPosition(this.spherical.interpolate(marker.getPosition(), newPosition, 1.0));
                    });
                }
                return;
            }
        }
        //add Marker
        this.addBusMarker(bus);
    }

    getBuses(){
        this.busLocationProvider.getLocationService().subscribe((res) => {
            this.buses = res;
        }, (err) => {
            alert('something is wrong! ' + err);
        });
    }
}
