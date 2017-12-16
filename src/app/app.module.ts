import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { BusSchedulePage } from '../pages/bus-schedule/bus-schedule';
import { AnnouncementPage } from '../pages/announcement/announcement';
import { BusReservationPage } from '../pages/bus-reservation/bus-reservation';
import { ReportPage } from '../pages/report/report';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation} from "@ionic-native/geolocation";

import { AnnouncementProvider } from '../providers/announcement/announcement';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    BusSchedulePage,
    AnnouncementPage,
    BusReservationPage,
    ReportPage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    BusSchedulePage,
    AnnouncementPage,
    BusReservationPage,
    ReportPage
  ],
  providers: [
    GoogleMaps,
    Geolocation,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AnnouncementProvider
  ]
})
export class AppModule {}
