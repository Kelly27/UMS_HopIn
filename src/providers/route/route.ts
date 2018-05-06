import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { MapProvider } from '../../providers/map/map';
import { GoogleMapsEvent, Spherical } from '@ionic-native/google-maps';
import { BusScheduleProvider } from '../../providers/bus-schedule/bus-schedule';

/*
  Generated class for the RouteProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
// declare var google;
@Injectable()
export class RouteProvider {

    constructor(
        public http: Http,
        public mapProvider: MapProvider,
        public spherical: Spherical,
        public busScheduleProvider: BusScheduleProvider,
    ) {
        console.log('Hello RouteProvider Provider');
    }

    public selectedRoute = [];

    public routeArr = [];
    public polyList = [];
    public busStopMarkerList = [];
    public allBusMarkers = [];
    public eta = '';

    getRoutes(){
        this.http.get('http://umshopin.com/umshopin_admin/api/route/getRoute')
            .map(response => response.json())
            .subscribe((res) => {
                this.routeArr = res;
            }, (err) => {
                console.log('fail at getRoute()', err);
            });
    }

    setSelectedRoute(routes){
        this.selectedRoute = routes;
    }

    //add markers and polyline of specific route to map
    showRoutes(){
        var poly;
        var marker;
        let selectedID = this.selectedRoute;
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

    //deals with bus marker
    showBusMarkerOnMap(bus){
        let selectedRoute = this.selectedRoute;
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
            title: 'Bus Number: ' + bus.bus_number + '\n Next Stop: '+ '\n ETA: '
        });
        this.allBusMarkers.push(m);
    }

    updateBusMarker(bus){
        var eta = '';
        for(var i = 0; i < this.allBusMarkers.length; i++){
            if(i + 1 == bus.id){
                let location = JSON.parse(bus.bus_location);
                //if location is null and track_status === 'OFF', delete marker,
                //else update marker position
                if(location == null){
                    this.allBusMarkers[i].then(marker => {
                        marker.remove();
                    });
                    this.allBusMarkers.splice(i, 1);
                    console.log(this.allBusMarkers);
                }
                else{
                    this.allBusMarkers[i].then(marker =>{
                        var newPosition = JSON.parse(bus.bus_location);
                        let next_stop_data = JSON.parse(bus.next_stop);
                        //google matrix api only accept string for origin and destination
                        console.log('route.ts', bus.bus_location);
                        let current = newPosition.lat + ',' + newPosition.lng;
                        let next_stop = next_stop_data.location.lat + ',' + next_stop_data.location.lng
                        eta = this.getETA(current, next_stop);
                        // marker.setPosition(newPosition);
                        //this.spherical.interpolate(originalPosition, newPosition, fraction); fraction means how many percent the marker should go.
                        marker.setPosition(this.spherical.interpolate(marker.getPosition(), newPosition, 1.0));
                        // this.getETA(newPosition, next_stop.location);
                        marker.setTitle('Bus Number: ' + bus.bus_number + '\n Next Stop: ' + next_stop_data.name +'\n ETA: ' + eta);
                    });
                }
                return;
            }
        }
        //add Marker
        this.addBusMarker(bus);
    }

    getETA(origin, destination){
        this.busScheduleProvider.getETA(origin, destination).subscribe(res => {
            this.eta = res.rows[0].elements[0].duration.text;
        }, err => {
            console.log('route.ts something is wrong');
        });
        console.log('myeta', this.eta);
        return this.eta;
    }

}