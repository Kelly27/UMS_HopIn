import { Component } from '@angular/core';
import { RouteProvider } from '../../providers/route/route';
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

    constructor(
        public routeProvider: RouteProvider,
        public mapProvider: MapProvider,
        public alertCtrl: AlertController
    ) {
        console.log('Hello RouteComponent Component');
        this.getRoute();
    }

    ngOnInit(){
        //playground
         let play = Observable.create(obs => {
             setTimeout(() => {
                this.routeProvider.setSelectedRoute([this.routeArr[0].id]); //show first route on map on app start up
                this.showRoutes();
             }, 2000);
         });

         play.subscribe((data) => {

         });
         //-------------------
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
                // checked: isChecked
            });
        }

        alert.addButton('Cancel');
        alert.addButton({
            text: 'Okay',
            handler: data => {
                this.testCheckboxOpen = false;
                this.removePolylines();
                this.polyList = []; //initialize polyline list
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

    showRoutes(){
        var poly;
        let selectedID = this.routeProvider.selectedRoute;
        console.log('selected', selectedID);
        for(var i = 0; i < selectedID.length; i++){
            for(var j = 0; j < this.routeArr.length; j++){
                if(selectedID[i] == this.routeArr[j].id){ //if match, then show polyline on map
                    let polyline = JSON.parse(this.routeArr[j].polyline);
                    console.log('polyline', polyline);
                    polyline.forEach((line) =>{
                        poly = this.mapProvider.map.addPolyline({
                            points: line,
                            'color': '#F90520',
                            'width': 5,
                            // 'visible': false,
                            'clickable': true
                        }).then( p =>{
                            this.polyList.push(p); // warning polyline data is too complicated
                        });
                    });
                };
            };
        };
    }

    removePolylines(){
        this.polyList.forEach(p => {
            // polyline.then( p => {
                p.remove();
            // });
        });
        console.log('polylist', this.polyList);
    }

}
