import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { BusLocationProvider } from '../../providers/bus-location/bus-location';
import { RouteProvider } from '../../providers/route/route';
import { BusScheduleProvider } from '../../providers/bus-schedule/bus-schedule';
/**
 * Generated class for the BusSchedulePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-bus-schedule',
    templateUrl: 'bus-schedule.html',
})
export class BusSchedulePage {

    public selected_route_name:string = '';
    public selected_route = [];
    public stops = [];

    public allBuses = [];
    public allRoutes = [];
    public relevant_bus = [];
    public myObs;
    constructor(
        public navCtrl: NavController,
        public alrtCtrl: AlertController,
        public navParams: NavParams,
        public http: Http,
        public busLocationProvider: BusLocationProvider,
        public routeProvider: RouteProvider,
        public scheduleProvider: BusScheduleProvider,
        public loadCtrl: LoadingController
    ) {
        this.busLocationProvider.getLocationService();
        this.routeProvider.getRoutes();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad BusSchedulePage');
        this.scheduleProvider.presentLoading(2000);
        //wait for get request to finish...
        setTimeout(() => {
            this.allBuses = this.busLocationProvider.all_buses;
            this.allRoutes = this.routeProvider.routeArr;
            this.initSchedule(this.allRoutes[0]);
            console.log(this.allBuses);
            console.log(this.allRoutes);
        }, 1000);
    }

    initSchedule(route){
        this.selected_route = route;
        // this.selected_route_name = route.title;
        this.getRelevantBusInfo(route.id);
    }

    chooseRoute(){
        let alrt = this.alrtCtrl.create({
            title: 'Choose Route',
            message: 'Choose route to show related bus schedule information.',
            buttons:[
            {
                text: 'Cancel',
                role: 'cancel'
            },
            {
                text: 'Okay',
                handler: data => {
                    var route = this.scheduleProvider.getRouteFrID(this.allRoutes, data);
                    this.initSchedule(route);
                    // this.getRelevantBusInfo(data);
                }
            }
            ]
        });

        for(var i = 0; i < this.allRoutes.length; i++){
            alrt.addInput({
                type: 'radio',
                label: this.allRoutes[i].title,
                value: this.allRoutes[i].id
            })
        }
        alrt.present();
    }

    getRelevantBusInfo(data){
        this.scheduleProvider.getRelevantBus(data);
        setTimeout(()=>{
            this.relevant_bus = this.scheduleProvider.relevantBusInfo;
            setInterval(()=>{
                this.stops = this.list_stops(this.selected_route);
            }, 2000);
            console.log(this.stops);
        },1000);
    }

    list_stops(route){
        var buses = [];
        var data = [];
        var temp;
        var stops = JSON.parse(route.route_arr);

        for(var i = 0; i < stops.length; i++){
            for(var j = 0; j < this.relevant_bus.length; j++){
                let stop = stops[i];
                let bus = this.relevant_bus[j];

                if(bus.next_stop.name == stop.name){
                    buses.push(bus);
                }
            };
            temp = {
                name: stops[i].name,
                location: stops[i].location,
                buses: buses
            };
            data.push(temp);
            //init buses array
            buses = [];
        };
        // console.log('data', data);
        return data;
    }

    // presentLoading(){
    //     let loading = this.loadCtrl.create({
    //         content: 'Please wait...'
    //     });

    //     loading.present();

    //     setTimeout(() => {
    //         loading.dismiss();
    //     }, 2000);
    // }
}
