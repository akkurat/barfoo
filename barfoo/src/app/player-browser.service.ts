import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlayerBrowserService {
  audio: HTMLAudioElement;

  constructor() { 
    this.audio = new Audio()
  }

  play( src: string)
  {
    this.audio.src = src
    this.audio.load()
    this.audio.play()
  }

  
}
