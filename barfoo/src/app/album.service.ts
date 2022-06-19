import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  albumSubject: Subject<String[]>;

  constructor(private http: HttpClient) {
    this.albumSubject = new Subject()
    this.http.get<{ albums: string[] }>('/api/albums')
    .subscribe(resp => this.albumSubject.next(resp.albums))
  }



  getObservable() {
    return this.albumSubject.asObservable()
  }

  setArtist(artist: string) {
    this.http.get<{albums: string[]}>('/api/albums?artist='+JSON.stringify(artist))
    .subscribe(resp => this.albumSubject.next(resp.albums))
  }

}
