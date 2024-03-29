import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { BusSchedulePage } from '../pages/bus-schedule/bus-schedule';
import { AnnouncementPage } from '../pages/announcement/announcement';
import { AnnouncementDetailPage } from '../pages/announcement-detail/announcement-detail';
import { BusReservationPage } from '../pages/bus-reservation/bus-reservation';
import { BusReservationAddPage } from '../pages/bus-reservation-add/bus-reservation-add';
import { BusReservationViewPage } from '../pages/bus-reservation-view/bus-reservation-view';
import { ReportPage } from '../pages/report/report';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { GoogleMaps, Spherical, Geocoder } from '@ionic-native/google-maps';
import { Geolocation} from "@ionic-native/geolocation";
import { DatePicker } from '@ionic-native/date-picker';

import { AnnouncementProvider } from '../providers/announcement/announcement';
import { BusLocationProvider } from '../providers/bus-location/bus-location';
import { RouteProvider } from '../providers/route/route';
import { MapProvider } from '../providers/map/map';
import { BusStopProvider } from '../providers/bus-stop/bus-stop';
import { BusScheduleProvider } from '../providers/bus-schedule/bus-schedule';

import { MapComponent } from '../components/map/map';
import { ReportsProvider } from '../providers/reports/reports';
import { ReservationProvider } from '../providers/reservation/reservation';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    BusSchedulePage,
    AnnouncementPage,
    AnnouncementDetailPage,
    BusReservationPage,
    BusReservationAddPage,
    ReportPage,
    MapComponent,
    BusReservationViewPage
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
    AnnouncementDetailPage,
    BusReservationPage,
    BusReservationAddPage,
    ReportPage,
    BusReservationViewPage
  ],
  providers: [
    GoogleMaps,
    Geolocation,
    StatusBar,
    SplashScreen,
    Spherical,
    Geocoder,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AnnouncementProvider,
    BusLocationProvider,
    RouteProvider,
    MapProvider,
    BusStopProvider,
    BusScheduleProvider,
    ReportsProvider,
    DatePicker,
    ReservationProvider
  ]
})
export class AppModule {}
