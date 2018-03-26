import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController  } from 'ionic-angular';
import {
    GoogleMaps,
    GoogleMap,
    GoogleMapsEvent,
    GoogleMapOptions,
    CameraPosition,
    MarkerOptions,
    Marker,
    Spherical
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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public googleMaps: GoogleMaps,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapModalPage');
    this.loadMap();
  }

  closeModal(){
    this.viewCtrl.dismiss();
  }

  loadMap(){
    let mapOptions: GoogleMapOptions = {
        camera:{
            zoom: 13,
            target: {
                lat: 6.033316600000001,
                lng: 116.12286110000002},
        }
    }

    let element = this.mapElement.nativeElement;
    this.map = this.googleMaps.create(element, mapOptions);
    console.log('loaded function');
    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
        console.log('map ready');

        this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe(data=>{
            this.map.addMarker({
              position: data
            });
        });
    });
  }
}
