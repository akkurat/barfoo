import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { OrderListModule } from 'primeng/orderlist';
import { DataViewModule } from 'primeng/dataview';
import { ListboxModule } from 'primeng/listbox'

import {FormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { DndDirective } from './dnd.directive';
import { SonglibComponent } from './artists/songlib.component';

@NgModule({
  declarations: [
    AppComponent,
    PlaylistComponent,
    DndDirective,
    SonglibComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    OrderListModule,
    DataViewModule,
    ListboxModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
