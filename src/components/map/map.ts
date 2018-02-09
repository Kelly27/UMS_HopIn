import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { AlertController } from 'ionic-angular';
import {
    GoogleMaps,
    GoogleMap,
    GoogleMapsEvent,
    GoogleMapOptions,
    CameraPosition,
    MarkerOptions,
    Marker
} from '@ionic-native/google-maps';
import { BusLocationProvider } from '../../providers/bus-location/bus-location';
import { Observable } from 'rxjs/Observable';
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
    private testCheckboxOpen: boolean;
    private testCheckboxResult = [true, false, false, false];
    public buses = new Array();
    private allMarkers = new Array();

    constructor(
        public googleMaps: GoogleMaps,
        public alertCtrl: AlertController,
        public busLocationProvider: BusLocationProvider
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
                for(var i = 0; i < this.buses.length; i++){
                    this.updateMarker(this.buses[i]);
                }
                observer.next(this.buses);
            },2000);
        });

        myObservable.subscribe((data) => {
            // var d = Object.keys(data[0]);
            // console.log('observe', data[0].bus_location);
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

        // Wait the MAP_READY before using any methods.
        this.map.one(GoogleMapsEvent.MAP_READY)
        .then(() => {
            console.log('Map is ready!');
            this.map.setMyLocationEnabled(true);

            this.map.getMyLocation().then((location) => {
                let Loc = location.latLng;
                console.log('loc', Loc);
                let option : CameraPosition <any> = {
                    target : Loc,
                    zoom : 15
                }
                this.map.moveCamera(option);
            });

            //add polyline on map method
            var HND_AIR_PORT = {lat: 35.548852, lng: 139.784086};
            var SFO_AIR_PORT = {lat: 37.615223, lng: -122.389979};
            var HNL_AIR_PORT = {lat: 21.324513, lng: -157.925074};
            var AIR_PORTS = [
            HND_AIR_PORT,
            HNL_AIR_PORT,
            SFO_AIR_PORT
            ];
            this.map.addPolyline({
                points: AIR_PORTS,
                'color' : '#AA00FF',
                'width': 10,
                'geodesic': true
            });

        });
    }

    trafficToggle(){
        console.log(this.trafficFlag);
        this.trafficFlag = !this.trafficFlag;
        this.map.setTrafficEnabled(this.trafficFlag);
    }

    //alert for bus filter
    showBusFilter(){
        let alert = this.alertCtrl.create();
        alert.setSubTitle('Choose bus/buses that you wish to see.');

        alert.addInput({
            type:'checkbox',
            label: 'Bus 1',
            value: 'value1',
            checked: this.testCheckboxResult[0]
        });

        alert.addInput({
            type:'checkbox',
            label: 'Bus 2',
            value: 'value2',
            checked: this.testCheckboxResult[1]
        });

        alert.addInput({
            type:'checkbox',
            label: 'Bus 3',
            value: 'value3',
            checked: this.testCheckboxResult[2]
        });

        alert.addInput({
            type:'checkbox',
            label: 'Bus 4',
            value: 'value4',
            checked: this.testCheckboxResult[3]
        });

        alert.addButton('Cancel');
        alert.addButton({
            text: 'Okay',
            handler: data => {
                console.log('data: ', data);
                this.testCheckboxOpen = false;
                this.testCheckboxResult = data;
            }
        });
        alert.present();
    }

    addMarker(bus){
        let m = this.map.addMarker({
            position: JSON.parse(bus.bus_location),
            icon: {url: './assets/icon/bus.png', size: {width: 35, height: 35}},
            animation: 'DROP'
        });
        this.allMarkers.push(m);
        console.log('add marker', this.allMarkers);
    }

    updateMarker(bus){
        for(var i = 0; i < this.allMarkers.length; i++){
            console.log('marker index:', i + 1, 'bus id: ', bus.id);
            if(i +1 == bus.id){
                this.allMarkers[i].then(marker =>{
                    marker.setPosition(JSON.parse(bus.bus_location));
                });
                console.log('updated loc', bus.bus_location);
                return;
            }
        }
        //add Marker
        this.addMarker(bus);
    }

    getBuses(){
        this.busLocationProvider.getLocationService().subscribe((res) => {
            this.buses = res;
            console.log('bus', this.buses);
        });
    }
}
