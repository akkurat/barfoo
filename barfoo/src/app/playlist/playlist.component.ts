import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PlayerBrowserService } from '../player-browser.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./playlist.component.scss'],
  
})
export class PlaylistComponent implements OnInit {
  songs: ISong[] = [];

  constructor(private http: HttpClient, private playService: PlayerBrowserService) { }

  ngOnInit(): void {

    this.http.get<ISongs>('/api/artists').subscribe( resp =>( 
      this.songs= resp.files )  )
  }

  public previewFile(event: any) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      console.log('csv content', e.target.result);
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  handleSelectionChange(event: {originalEvent: MouseEvent, value: ISong[]})
  {
    console.log(event)
    this.playService.play(event.value[0].path)
  }
}

interface ISong {
  name: string;
  path: string;
}

interface ISongs {
  name: string,

  files: ISong[]

}