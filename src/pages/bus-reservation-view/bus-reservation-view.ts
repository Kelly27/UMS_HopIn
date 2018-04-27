import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ReservationProvider } from '../../providers/reservation/reservation';
import { Geocoder } from '@ionic-native/google-maps';

declare var google;

@IonicPage()
@Component({
  selector: 'page-bus-reservation-view',
  templateUrl: 'bus-reservation-view.html',
})
export class BusReservationViewPage {
  public map: any;
  @ViewChild('map') mapElement: ElementRef;
  public map2: any;
  @ViewChild('map2') map2Element: ElementRef;

  public reserve = {};
  public applicant_info = {};
  public pick_up_address;
  public drop_off_address;
  public address;
  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public reservationProv: ReservationProvider,
      public gcode: Geocoder
      ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BusReservationViewPage');
    this.reserve = this.navParams.get('reservation');
    this.applicant_info = this.navParams.get('reservation').applicant_info;
    this.loadMap();
  }

  loadMap(){
    console.log(JSON.parse(this.navParams.get('reservation').pick_up_location));
    let pick_up = JSON.parse(this.navParams.get('reservation').pick_up_location);
    let drop_off = JSON.parse(this.navParams.get('reservation').drop_off_location);
    let mapOptions = {
      center: pick_up,
      zoom: 15,
      mapTypeControl: false,
      zoomControl: false,
      scaleControl: false,
    }
    let map2Options = {
      center: drop_off,
      zoom: 15,
      mapTypeControl: false,
      zoomControl: false,
      scaleControl: false,
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.map2 = new google.maps.Map(this.map2Element.nativeElement, map2Options);

    this.addMarker(this.map);
    this.addMarker(this.map2);

    this.gcode.geocode({
      "position": pick_up
    }).then(results => {
      if(results[0]){
        this.pick_up_address = results[0].extra.lines[0];
      }
      else{
        this.address = JSON.stringify(results[0].position);
      }
    });

    this.gcode.geocode({
      "position": drop_off
    }).then(results => {
      if(results[0]){
        this.drop_off_address = results[0].extra.lines[0];
      }
      else{
        this.address = JSON.stringify(results[0].position);
      }
    });
  }

  addMarker(map){
    var marker = new google.maps.Marker({
      map: map,
      position: map.getCenter()
    });
  }
}
