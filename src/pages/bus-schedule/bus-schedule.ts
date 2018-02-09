import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
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

    public busTest: string;
    public task: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public http: Http
             ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BusSchedulePage');
    console.log(this.foo());
  }

  foo(){
    return 'foo';
  }
}
