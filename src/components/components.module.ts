import { NgModule } from '@angular/core';
import { MapComponent } from './map/map';
import { RouteComponent } from './route/route';
import { ArrivalTimeComponent } from './arrival-time/arrival-time';
@NgModule({
	declarations: [MapComponent,
    RouteComponent,
    ArrivalTimeComponent],
	imports: [],
	exports: [MapComponent,
    RouteComponent,
    ArrivalTimeComponent]
})
export class ComponentsModule {}
