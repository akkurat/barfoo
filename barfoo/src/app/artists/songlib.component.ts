import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlbumService } from '../album.service';
import { PlayerBrowserService } from '../player-browser.service';
import { SongsService, ILightSong } from '../songs.service';

@Component({
  selector: 'app-songlib',
  templateUrl: './songlib.component.html',
  styleUrls: ['./songlib.component.scss']
})
export class SonglibComponent implements OnInit {
  artists: string[] =[];
  albums: String[] = [];
  songs: ILightSong[] = [];
  

  constructor(
    private http: HttpClient,
    private albumService: AlbumService,
    private songService: SongsService,
    private playService: PlayerBrowserService
  ) { }

  ngOnInit(): void {
    this.http.get<{ artists: string[] }>('/api/artists')
      .subscribe(resp => this.artists = resp.artists)

    this.albumService.getObservable().subscribe(a => this.albums = a)
    this.songService.getObservable().subscribe(s => this.songs = s)
  }

  selectArtist(ev: any) {
    this.albumService.setArtist(ev.value)
    this.songService.setArtistAlbum(ev.value)
    // this.albumService.setArtist(artist);
  }

  selectAlbum(ev: any) {
    this.songService.setArtistAlbum(undefined, ev.value)
  }

  selectSong(ev: any) {
    console.log(ev) 
  }

  addToQueue(ev: any) {
    const song = ev.value[0]
    this.playService.play('/stream/songs/'+song._id)
  }

}
