//this component deals with the route polyline and bus respectively to the route
import { Component } from '@angular/core';
import { RouteProvider } from '../../providers/route/route';
import { MapProvider } from '../../providers/map/map';
import { Observable } from 'rxjs/Observable';
import { AlertController, ToastController  } from 'ionic-angular';
import {
    GoogleMapsEvent,
    Spherical
} from '@ionic-native/google-maps';
import { BusLocationProvider } from '../../providers/bus-location/bus-location';
/**
 * Generated class for the RouteComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
 @Component({
     selector: 'route',
     templateUrl: 'route.html'
 })
export class RouteComponent {

    //variables for bus stops marker and polylines
    public routeArr = [];
    private testCheckboxResult = [true, false, false, false];
    private testCheckboxOpen: boolean;
    public allPoly = [];
    public polyList = [];
    public busStopMarkerList = [];

    //variables for buses
    public allBusMarkers = new Array();
    public buses = new Array();
    public selectedRoute:any;

    public myObservable:any;

    constructor(
        public routeProvider: RouteProvider,
        public mapProvider: MapProvider,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController,
        public busLocationProvider: BusLocationProvider,
        public spherical: Spherical,
    ) {
        console.log('Hello RouteComponent Component');
        this.getRoute();
    }

    ngOnInit(){
        setTimeout(() => {
            this.routeProvider.setSelectedRoute([this.routeArr[0].id]); //show first route on map on app start up
            this.showRoutes();
        }, 2000);

        this.myObservable = Observable.create(observer => {
            setInterval(() => {
                this.getBuses();
                // bus markers
                if(this.buses){
                    observer.next(this.buses);
                }
            },2000);
        });
        this.myObservable.subscribe((data) => {

        });

    }

        //alert for bus filter
    showBusFilter(){
        let isChecked: boolean;
        let alert = this.alertCtrl.create();
        alert.setSubTitle('Choose bus/buses that you wish to see.');

        for(var i = 0; i < this.routeArr.length; i++){
            if(i == 0){
                isChecked = true;
            }
            else{
                isChecked = false;
            }
            alert.addInput({
                type:'checkbox',
                label: this.routeArr[i].title,
                value: this.routeArr[i].id,
                checked: isChecked
            });
        }

        alert.addButton('Cancel');
        alert.addButton({
            text: 'Okay',
            handler: data => {
                this.testCheckboxOpen = false;
                this.resetRoutes();
                this.routeProvider.setSelectedRoute(data);
                this.showRoutes();
            }
        });
        alert.present();
    }

    getRoute(){
        this.routeProvider.getRoutes()
           .subscribe((res) => {
               this.routeArr = res;
           }, (err) => {
               console.log('fail at getRoute()', err);
           });
    }

    //add markers and polyline of specific route to map
    showRoutes(){
        var poly;
        var marker;
        let selectedID = this.routeProvider.selectedRoute;
        console.log('selected', selectedID);
        for(var i = 0; i < selectedID.length; i++){
            for(var j = 0; j < this.routeArr.length; j++){
                if(selectedID[i] == this.routeArr[j].id){ //if match, then show polyline on map
                    //add route polyline
                    let polyline = JSON.parse(this.routeArr[j].polyline);
                    let color = this.routeArr[j].color;
                    console.log('color', color);
                    polyline.forEach((line) =>{
                        poly = this.mapProvider.map.addPolyline({
                            points: line,
                            'color': color,
                            'width': 3,
                        }).then( p =>{
                            this.polyList.push(p); // warning polyline data is too complicated
                        });
                    });

                    let bus_stops = JSON.parse(this.routeArr[j].route_arr);
                    bus_stops.forEach(stop => {
                        marker = this.mapProvider.map.addMarker({
                            position: stop.location,
                            title: stop.name,
                            icon: {url: './assets/icon/bus-stop.png', size: {width: 15, height: 15}},
                        }).then(m => {
                            this.busStopMarkerList.push(m);
                        });
                    });
                    //add bus marker
                    this.generateBusMarkerOnMap(selectedID[i]);
                };
            };
        };
    }

    resetRoutes(){
        this.polyList.forEach(p => {
            p.remove();
        });
        this.polyList = []; //initialize polyline list

        this.busStopMarkerList.forEach(m => {
            m.remove();
        });
        this.busStopMarkerList = []; //initialize marker list

        this.allBusMarkers.forEach((bus) => { //remove all created bus marker
            bus.then(marker => {
                marker.remove();
            });
        });
        this.allBusMarkers = [];
    }

    //========================================================================================
    //deals with the bus marker
    getBuses(){
        this.busLocationProvider.getLocationService().subscribe((res) => {
            this.buses = res;
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

    generateBusMarkerOnMap(selectedRoute){
            this.buses.forEach(bus => {
                console.log('selectedR', selectedRoute);
                console.log('bus', bus.route_id);
                if(selectedRoute == bus.route_id){
                    this.updateBusMarker(bus);
                }
            });

    };

    addBusMarker(bus){
        // var SlidingMarker = require('marker-animate-unobtrusive');
        let m = this.mapProvider.map.addMarker({
            position: JSON.parse(bus.bus_location),
            icon: {url: './assets/icon/bus.png', size: {width: 35, height: 45}},
            subtitle: bus.bus_number
        });
        this.allBusMarkers.push(m);
    }

    updateBusMarker(bus){
        console.log('update bus', bus);
        for(var i = 0; i < this.allBusMarkers.length; i++){
            if(i +1 == bus.id){
                let location = JSON.parse(bus.bus_location);
                let track_status = bus.track_status
                //if location is null and track_status === 'OFF', delete marker,
                //else update marker position
                if(location == null && track_status){
                    this.allBusMarkers[i].then(marker => {
                        marker.remove();
                    });
                    this.allBusMarkers.splice(i, 1);
                    console.log(this.allBusMarkers);
                }
                else{
                    this.allBusMarkers[i].then(marker =>{
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
}
