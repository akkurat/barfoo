import { Directive, Host, HostListener } from '@angular/core';

@Directive({
  selector: '[appDnd]'
})
export class DndDirective {


  constructor() { }

  @HostListener('dragover', ['$event'])
  public onDragOver(evt:DragEvent)
  {
    evt.preventDefault()
    evt.stopPropagation()
    console.log(evt)
  }

  @HostListener('drop', ['$event']) 
  public onDrop(evt: DragEvent) {
    evt.preventDefault()
    evt.stopPropagation();
    console.log(evt.dataTransfer?.files)
  }

}
