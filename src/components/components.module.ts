import { NgModule } from '@angular/core';
import { MapComponent } from './map/map';
import { RouteComponent } from './route/route';
@NgModule({
	declarations: [MapComponent,
    RouteComponent],
	imports: [],
	exports: [MapComponent,
    RouteComponent]
})
export class ComponentsModule {}
