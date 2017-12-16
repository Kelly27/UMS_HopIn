import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
/**
 * Generated class for the AnnouncementDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-announcement-detail',
  templateUrl: 'announcement-detail.html',
})
export class AnnouncementDetailPage {
  public announceDetail = {};
  public test;
  public trustedUrl;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.announceDetail = this.navParams.get("announceDetail");
    this.test = "<b>asdfdasf</b>";
    console.log(this.announceDetail);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AnnouncementDetailPage');
  }

}
