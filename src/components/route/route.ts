//this component deals with the route polyline and bus marker that is respectively to the route, 
import { Component } from '@angular/core';
import { RouteProvider } from '../../providers/route/route';
import { MapProvider } from '../../providers/map/map';
import { Observable } from 'rxjs/Observable';
import {
 AlertController, ToastController  } from 'ionic-angular';
import {
    GoogleMapsEvent,
    Spherical,
} from '@ionic-native/google-maps';
import { BusLocationProvider } from '../../providers/bus-location/bus-location';
import { BusScheduleProvider } from '../../providers/bus-schedule/bus-schedule';
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
    // private testCheckboxResult = [true, false, false, false];
    private testCheckboxOpen: boolean;
    public allPoly = [];
    public polyList = [];
    public busStopMarkerList = [];

    //variables for buses
    public allBusMarkers = new Array();
    public buses = new Array();
    public selectedRoute:any;

    public myObservable:any;
    public myInterval:any;

    public card = [];
    public eta = '';

    constructor(
        public routeProvider: RouteProvider,
        public mapProvider: MapProvider,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController,
        public busLocationProvider: BusLocationProvider,
        public busScheduleProvider: BusScheduleProvider,
        public spherical: Spherical,
        ) {
        console.log('Hello RouteComponent Component');
        this.getRoute();
    }

    ngOnInit(){
        this.mapProvider.map.one(GoogleMapsEvent.MAP_READY).then(()=>{
            this.myObservable = Observable.create(observer => {
                this.myInterval = setInterval(() => {
                    this.getBuses();
                    // bus markers
                    if(this.buses){
                        observer.next(this.buses);
                    }
                },1500);
            });

            this.myObservable.subscribe((data) => {
                data.forEach(d => {
                    this.showBusMarkerOnMap(d); //keep the bus marker update
                })
            });

            setTimeout(() => {
                this.routeProvider.setSelectedRoute([this.routeArr[0].id]); //show first route on map on app start up
                this.showRoutes();
            }, 2000);

        });

    }

    ngOnDestroy(){
        //stop making GET request
        clearInterval(this.myInterval);
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
                    polyline.forEach((line) =>{
                        poly = this.mapProvider.map.addPolyline({
                            points: line,
                            'color': color,
                            'width': 3,
                        }).then( p =>{
                            this.polyList.push(p); // warning polyline data is too complicated
                        });
                    });

                    //setup bus stop markers
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
                };
            };
        };
        // console.log('',this.busLocationProvider.show_ETA_card());
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
        // this.busLocationProvider.setBusMarkers(this.allBusMarkers);
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

    showBusMarkerOnMap(bus){
        let selectedRoute = this.routeProvider.selectedRoute;
        for( var i = 0; i < selectedRoute.length; i++){
            if(selectedRoute[i] == bus.route_id){
                this.updateBusMarker(bus);
            }
        };
    };

    addBusMarker(bus){
        // var SlidingMarker = require('marker-animate-unobtrusive');
        let m = this.mapProvider.map.addMarker({
            position: JSON.parse(bus.bus_location),
            icon: {url: './assets/icon/bus.png', size: {width: 35, height: 45}},
            title: 'Bus Number' + bus.bus_number + '\n ETA: '
        });
        this.allBusMarkers.push(m);
    }

    updateBusMarker(bus){
        var eta = '';
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
                        if(bus.next_stop != null){
                            let next_stop_data = JSON.parse(bus.next_stop);
                            //google matrix api only accept string for origin and destination
                            let current = newPosition.lat + ',' + newPosition.lng;
                            let next_stop = next_stop_data.location.lat + ',' + next_stop_data.location.lng
                            eta = this.getETA(current, next_stop);
                        }
                        // marker.setPosition(newPosition);
                        //this.spherical.interpolate(originalPosition, newPosition, fraction); fraction means how many percent the marker should go.
                        marker.setPosition(this.spherical.interpolate(marker.getPosition(), newPosition, 1.0));
                        // this.getETA(newPosition, next_stop.location);
                        marker.setTitle('Bus Number: ' + bus.bus_number + '\n ETA: ' + eta);
                    });
                }
                return;
            }
        }
        //add Marker
        this.addBusMarker(bus);
        // this.busLocationProvider.setBusMarkers(this.allBusMarkers);
    }

    getETA(origin, destination){
        this.busScheduleProvider.getETA(origin, destination).subscribe(res => {
            this.eta = res.rows[0].elements[0].duration.text;
        });
        console.log('myeta', this.eta);
        return this.eta;
    }
}
