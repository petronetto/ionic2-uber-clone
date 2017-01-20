import { NgModule, ErrorHandler } from '@angular/core'
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular'
import { MyApp } from './app.component'

import { MapDirective } from '../components/map/map'
import { PickupDirective } from '../components/pickup/pickup'
import { PickupCarDirective } from '../components/pickup-car/pickup-car'
import { AvailableCarsDirective } from '../components/available-cars/available-cars'
import { DestinationAddressDirective } from '../components/destination-address/destination-address'
import { PickupPubSub } from '../providers/pickup-pub-sub/pickup-pub-sub'
import { CarService } from '../providers/car/car'

import { HomePage } from '../pages/home/home'

@NgModule({
  declarations: [
    MyApp,
    MapDirective,
    PickupDirective,
    DestinationAddressDirective,
    AvailableCarsDirective,
    PickupCarDirective,
    HomePage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    //   {provide: ErrorHandler, useClass: IonicErrorHandler},
      CarService,
      PickupPubSub
  ]
})
export class AppModule {}
