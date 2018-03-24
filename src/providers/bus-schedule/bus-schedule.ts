import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the BusScheduleProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BusScheduleProvider {

    public selectedRoute:any;
    public relevantBusInfo = [];

    constructor(public http: Http) {
        console.log('Hello BusScheduleProvider Provider');
    }

    getETA(origin, destination){
        return this.http.get('http://umshopin.com/umshopin_admin/api/bus/getETA/origin=' + origin + '/destination=' + destination)
            .map(response => response.json());
    }

    getRelevantBus(id){
        this.http.get('http://umshopin.com/umshopin_admin/api/route/' + id + '/getRelevantBuses').map(res => res.json())
        .subscribe(data => {
            this.relevantBusInfo = this.normalize_bus_data(data.buses);
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

    normalize_bus_data(buses){
        var bus_arr = [];
        var data;
        for(var i = 0; i < buses.length; i++){
            if(buses[i].next_stop && buses[i].bus_location){
                data = {
                    id : buses[i].id,
                    bus_number: buses[i].bus_number,
                    bus_location: JSON.parse(buses[i].bus_location),
                    next_stop: JSON.parse(buses[i].next_stop)
                }

                bus_arr.push(data);
            }
        }
        console.log('bus_Arr', bus_arr);
        return bus_arr;
    }
}
