import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { LoadingController } from 'ionic-angular';

/*
  Generated class for the BusScheduleProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BusScheduleProvider {

    public selectedRoute:any;
    public relevantBusInfo = [];

    public eta_temp = '';
    public bus_arr = [];

    public myInterval;
    constructor(public http: Http, public loadCtrl: LoadingController) {
        console.log('Hello BusScheduleProvider Provider');
    }

    getETA(origin, destination){
        return this.http.get('http://umshopin.com/umshopin_admin/api/bus/getETA/origin=' + origin + '/destination=' + destination)
            .map(response => response.json());
    }

    getETA2(origin, destination){
        return this.http.get('https://maps.googleapis.com/maps/api/distancematrix/json?origins=' + origin + '&destinations=' + destination + '&key=AIzaSyARzgseB8wPPpiP65N9rzPqFwcdA4WuugY')
            .map(response => response.json());
    }

    getRelevantBus(id){
        this.http.get('http://umshopin.com/umshopin_admin/api/route/' + id + '/getRelevantBuses').map(res => res.json())
        .subscribe(data => {
            if(this.myInterval){
                clearInterval(this.myInterval);
            }
            this.myInterval = setInterval(()=>{
                this.relevantBusInfo = this.normalize_bus_data(data.buses);
            },3500);
        }, err => {
            console.log('Failed getting relevant bus info.', err);
        });
    }

    setSelectedRoute(route){
        this.selectedRoute = route;
    }

    getRouteFrID(all_route, id){
        var route;
        for(var i = 0; i < all_route.length; i++){
            if(all_route[i].id == id){
                route = all_route[i];
            }
        };
        return route;
    }

    //normalize relevant bus info data
    normalize_bus_data(buses){
        //init bus_arr array to empty first
        var bus_arr=[];
        var data, bus_arr_copy;
        for(var i = 0; i < buses.length; i++){
            if(buses[i].next_stop && buses[i].bus_location){

                let parsed_bus = JSON.parse(buses[i].bus_location);
                let parsed_next = JSON.parse(buses[i].next_stop);

                this.normalize_eta(parsed_bus, parsed_next);

                data = {
                    id : buses[i].id,
                    bus_number: buses[i].bus_number,
                    bus_location: parsed_bus,
                    next_stop: parsed_next,
                    eta: this.eta_temp
                };

                bus_arr.push(data);
                // this.presentLoading();
            };
        };
        console.log(bus_arr);
        return bus_arr;
    }

    normalize_eta(parsed_bus, parsed_next){
        let origin = parsed_bus.lat + ',' + parsed_bus.lng;
        let destination = parsed_next.location.lat + ',' + parsed_next.location.lng;
        this.getETA2(origin, destination).subscribe(res=>{
            this.eta_temp = res.rows[0].elements[0].duration.text;
        },err=>{
            clearInterval(this.myInterval);
            alert('ETA prob');
        });

        return this.eta_temp;
    };

    presentLoading(time){
        let loading = this.loadCtrl.create({
            content: 'Please wait...'
        });

        loading.present();

        setTimeout(() => {
            loading.dismiss();
        }, time);
    }
}
