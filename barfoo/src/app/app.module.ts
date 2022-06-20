import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { OrderListModule } from 'primeng/orderlist';
import { DataViewModule } from 'primeng/dataview';
import { ListboxModule } from 'primeng/listbox'
import { SliderModule } from 'primeng/slider'

import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { DndDirective } from './dnd.directive';
import { SonglibComponent } from './artists/songlib.component';
import { ProgressComponent } from './progress/progress.component';

@NgModule({
  declarations: [
    AppComponent,
    PlaylistComponent,
    DndDirective,
    SonglibComponent,
    ProgressComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    OrderListModule,
    DataViewModule,
    ListboxModule,
    FormsModule,
    SliderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
