//generates the google map
import { Component, ViewChild, ElementRef } from '@angular/core';
import {
    GoogleMaps,
    GoogleMap,
    GoogleMapsEvent,
    GoogleMapOptions,
    CameraPosition,
} from '@ionic-native/google-maps';
import { Observable } from 'rxjs/Observable';
import { BusScheduleProvider } from '../../providers/bus-schedule/bus-schedule';
import { BusLocationProvider } from '../../providers/bus-location/bus-location';
import { RouteProvider } from '../../providers/route/route';
import { MapProvider } from '../../providers/map/map';
import { AlertController } from 'ionic-angular';
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
    public myObservable:any;
    public myInterval:any;

    constructor(
        public googleMaps: GoogleMaps,
        public busScheduleProvider: BusScheduleProvider,
        public busLocationProvider: BusLocationProvider,
        public routeProvider: RouteProvider,
        public mapProvider: MapProvider,
        public alertCtrl: AlertController
        ) {
        console.log('Hello MapComponent Component');
        this.routeProvider.getRoutes();
    }

    ngOnInit(){
        this.loadMap();
        this.loadRouteData();
    }

    ngOnDestroy(){
        //stop making GET request
        clearInterval(this.myInterval);
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

    loadRouteData(){
        this.mapProvider.map.one(GoogleMapsEvent.MAP_READY).then(()=>{
            this.myObservable = Observable.create(observer => {
                this.myInterval = setInterval(() => {
                    this.busLocationProvider.getLocationService();
                    // bus markers
                    if(this.busLocationProvider.all_buses){
                        observer.next(this.busLocationProvider.all_buses);
                    }
                },1500);
            });

            this.myObservable.subscribe((data) => {
                console.log('map',data);
                data.forEach(d => {
                    if(d.bus_location){
                        this.routeProvider.showBusMarkerOnMap(d); //keep the bus marker update
                    }
                })
            });

            setTimeout(() => {
                try{
                    let first_route = [this.routeProvider.routeArr[0].id];
                    this.routeProvider.setSelectedRoute(first_route); //show first route on map on app start up
                    this.routeProvider.showRoutes();
                }
                catch(e){
                    alert('Ooops! Something has gone wrong at map.ts!');
                    window.location.reload();
                }
            }, 2000);

        });
    }

    showBusFilter(){
        let isChecked: boolean;
        let alert = this.alertCtrl.create();
        alert.setSubTitle('Choose bus/buses that you wish to see.');

        for(var i = 0; i < this.routeProvider.routeArr.length; i++){
            if(i == 0){
                isChecked = true;
            }
            else{
                isChecked = false;
            }
            alert.addInput({
                type:'checkbox',
                label: this.routeProvider.routeArr[i].title,
                value: this.routeProvider.routeArr[i].id,
                checked: isChecked
            });
        }

        alert.addButton('Cancel');
        alert.addButton({
            text: 'Okay',
            handler: data => {
                this.routeProvider.resetRoutes();
                this.routeProvider.setSelectedRoute(data);
                this.routeProvider.showRoutes();
            }
        });
        alert.present();
    }
}
