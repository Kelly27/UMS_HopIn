import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { BusSchedulePage } from '../pages/bus-schedule/bus-schedule';
import { AnnouncementPage } from '../pages/announcement/announcement';
import { BusReservationPage } from '../pages/bus-reservation/bus-reservation';
import { ReportPage } from '../pages/report/report';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  // rootPage: any = BusReservationPage;

  pages: Array<{icon: string, title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { icon: 'map', title: 'Map', component: HomePage },
      { icon: 'time', title: 'Bus Schedule', component: BusSchedulePage },
      { icon: 'alert', title: 'Announcement', component: AnnouncementPage },
      { icon: 'bus', title: 'Bus Reservation', component: BusReservationPage },
      { icon: 'create', title: 'Report', component: ReportPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
