import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

export interface ILightSong {
  title: string;
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class SongsService {
  private songSubject: Subject<ILightSong[]>;

  constructor(private http: HttpClient) {
    this.songSubject = new Subject()
    this.http.get<{ songs: ILightSong[] }>('/api/songs')
    .subscribe(resp => this.songSubject.next(resp.songs))
  }



  getObservable() {
    return this.songSubject.asObservable()
  }


  setArtistAlbum(artist?: string, album?: string) {
    let params = new HttpParams().set("filter", JSON.stringify({artist, album}))
    
    this.http.get<{songs: ILightSong[]}>('/api/songs', {params} )
    .subscribe(resp => this.songSubject.next(resp.songs))
  }

}
