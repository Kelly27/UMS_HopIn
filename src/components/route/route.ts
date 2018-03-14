import { Component } from '@angular/core';
import { RouteProvider } from '../../providers/route/route';
// import { BusStopProvider } from '../../providers/bus-stop/bus-stop';
import { MapProvider } from '../../providers/map/map';
import { Observable } from 'rxjs/Observable';
import { AlertController } from 'ionic-angular';
import {
    GoogleMapsEvent,
} from '@ionic-native/google-maps';
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

    public routeArr = [];
    private testCheckboxResult = [true, false, false, false];
    private testCheckboxOpen: boolean;
    public allPoly = [];
    public polyList = [];
    public markerList = [];

    constructor(
        // public busStopProvider: BusStopProvider,
        public routeProvider: RouteProvider,
        public mapProvider: MapProvider,
        public alertCtrl: AlertController
    ) {
        console.log('Hello RouteComponent Component');
        this.getRoute();
    }

    ngOnInit(){
        setTimeout(() => {
            this.routeProvider.setSelectedRoute([this.routeArr[0].id]); //show first route on map on app start up
            this.showRoutes();
         }, 2000);
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
                this.removePolylines();
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
                            this.markerList.push(m);
                        });
                    })
                };
            };
        };
    }

    removePolylines(){
        this.polyList.forEach(p => {
            p.remove();
        });
        this.polyList = []; //initialize polyline list

        this.markerList.forEach(m => {
            m.remove();
        });
        this.markerList = []; //initialize marker list
    }

}
