import { Injectable } from '@angular/core';
import { BehaviorSubject, merge, Observer } from 'rxjs';

interface IProgress {
  /**
   * relative progress as fraction 
   * values are guaranteed to be between 0 and 1, both inclusive
   * NaN if no song is playing
   */
  relative: number
  // todo absolute measures
}

interface IMediumSong {
  title: string
  album?: string
  artist?: string
  songIdx?: number
  maxSongIdx?: number
}

enum EState {
  NONE,
  PLAYING,
  PAUSED,
  LOADING
}

@Injectable({
  providedIn: 'root'
})
export class PlayerBrowserService {
  audio: HTMLAudioElement;

  private progressSubject = new BehaviorSubject<IProgress | null>(null)
  private songSubject = new BehaviorSubject<IMediumSong | null>(null)
  private stateSubject = new BehaviorSubject<EState>(EState.NONE)


  constructor() {
    console.log("Instn")
    this.audio = new Audio()
    this.audio.addEventListener('pause', (e: Event) => { console.log(e); this.stateSubject.next(EState.PAUSED) })
    this.audio.addEventListener('play', (e: Event) => { console.log(e); this.stateSubject.next(EState.PLAYING) })
    this.audio.addEventListener('timeupdate', (e: Event) => { 
      this.progressSubject.next({ relative: this.audio.currentTime / this.audio.duration }) 
    })

    navigator.mediaSession.setActionHandler('play', () => this.play())
    navigator.mediaSession.setActionHandler('pause', () => this.pause())
    // navigator.mediaSession.setPositionState({position})
  }

  play(src?: string) {
    if (src) {
      this.audio.src = src
      this.audio.load()
      navigator.mediaSession.metadata = new MediaMetadata({
        title: src
      })
      this.songSubject.next({ title: src })
    }
    this.audio.play()
  }
  pause() {
    this.audio.pause()
  }

  stop() {
    this.audio.load()
  }

  songObs() {
    return this.songSubject.asObservable()
  }

  prgObs() {
    return this.progressSubject.asObservable()
  }


}
