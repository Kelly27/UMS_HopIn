import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ReservationProvider } from '../../providers/reservation/reservation';
import { GoogleMaps, GoogleMap, GoogleMapOptions, GoogleMapsEvent } from '@ionic-native/google-maps';

@IonicPage()
@Component({
  selector: 'page-bus-reservation-view',
  templateUrl: 'bus-reservation-view.html',
})
export class BusReservationViewPage {
  public map: GoogleMap;
  @ViewChild('map') mapElement: ElementRef;

  public reserve = {};
  public applicant_info = {};
  constructor(
      public navCtrl: NavController, 
      public navParams: NavParams,
      public reservationProv: ReservationProvider,
      public googleMaps: GoogleMaps,
      ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BusReservationViewPage');
    this.reserve = this.navParams.get('reservation');
    // this.applicant_info = this.navParams.get('reservation').applicant_info;
    // console.log(this.applicant_info);
    console.log(this.reserve);
    this.loadMap();
  }

  loadMap(){
    console.log(JSON.parse(this.navParams.get('reservation').pick_up_location));
    let mapOptions: GoogleMapOptions = {
      camera: {
        zoom: 15,
        target: JSON.parse(this.navParams.get('reservation').pick_up_location)
      }
    }

    let element = this.mapElement.nativeElement;
    this.map = this.googleMaps.create(element, mapOptions);

    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      console.log('map is ready!');
      this.map.addMarker({
        position: JSON.parse(this.navParams.get('reservation').pick_up_location),
      })
    });

  }
}
