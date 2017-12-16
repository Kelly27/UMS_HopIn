import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AnnouncementProvider } from '../../providers/announcement/announcement';
import { AnnouncementDetailPage } from '../announcement-detail/announcement-detail';
/**
 * Generated class for the AnnouncementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-announcement',
  templateUrl: 'announcement.html',
})
export class AnnouncementPage {
  public test = 1;
  public allAnnouncement = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private announcementProvider: AnnouncementProvider
             ) {
  }

  ionViewDidLoad() {
    this.announcementProvider.getAnnounce()
      .subscribe((response) => {
        this.allAnnouncement = response;
      });
  }

  goToAnnounceDetailPage(announce){
    this.navCtrl.push(AnnouncementDetailPage,{
      announceDetail: announce
    })
  }

}
