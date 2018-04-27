import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController  } from 'ionic-angular';
import {
    GoogleMaps,
    GoogleMap,
    GoogleMapsEvent,
    GoogleMapOptions,
    GoogleMapsAnimation,
    Geocoder,
} from '@ionic-native/google-maps';

/**
 * Generated class for the MapModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-map-modal',
  templateUrl: 'map-modal.html',
})
export class MapModalPage {

  public map: GoogleMap;
  @ViewChild('map') mapElement: ElementRef;

  public location;
  public marker;
  public search_place;
  public place_list;
  public search_result = {};
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public googleMaps: GoogleMaps,
    public geocoder: Geocoder
  ) {
    this.location = navParams.get('location');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapModalPage');
    this.loadMap();
  }

  closeModal(){
    this.viewCtrl.dismiss();
  }

  submitLoc(){
    if(this.location){
      this.viewCtrl.dismiss(this.location);
    }
  }

  loadMap(){
    let mapOptions: GoogleMapOptions = {
        camera:{
            zoom: 15,
            target: {
                lat: 6.033316600000001,
                lng: 116.12286110000002},
        }
    }

    let element = this.mapElement.nativeElement;
    this.map = this.googleMaps.create(element, mapOptions);

    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
        if(this.location){
          this.map.addMarker({
            position: this.location,
            draggable: true,
            animation: GoogleMapsAnimation.DROP
          }).then(m=>{
            this.marker = m;
          })
        }
        this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe(data=>{
          if(this.marker){
            this.marker.remove();
          }
          this.map.addMarker({
            position: data[0],
            draggable: true,
            animation: GoogleMapsAnimation.DROP,
          }).then(m => {
            this.location = data[0];
            this.marker = m;
          });
        });
    });
  }

  search_input(){
    var new_list = [];
    this.geocoder.geocode({
      "address": this.search_place
    }).then(results => {
      this.search_result = results;
      if(this.search_result.length > 0){
        for(var i = 0; i < this.search_result.length; i++){
          if(this.search_result[i].adminArea == "Sabah"){
            new_list.push(this.search_result[i]);
          }
        }
        this.place_list = new_list;
        console.log(this.place_list);
      }
    });
  }

  moveCamera(place){
    this.map.moveCamera({
      target: place.position,
      duration: 1500
    });
    if(this.marker){
      this.marker.setPosition(place.position);
    }
    else{
      this.map.addMarker({
        position: place.position,
        draggable: true,
        animation: GoogleMapsAnimation.DROP
      })
    }
  }
}
