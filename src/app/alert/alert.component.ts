import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as AlertAnimations from './alert.animations'

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
  animations: [AlertAnimations.alertFadeIn, AlertAnimations.backdropFadeIn]
})
export class AlertComponent implements OnInit {

  constructor() { }

  @Input('clockDisplayedValue') clockDisplayedValue : string
  @Input('totalClicks') totalClicks : number

  @Output() restartGameClicked = new EventEmitter<void>()
  @Output() closeClicked = new EventEmitter<void>()

  buttonsLocked = true

  ngOnInit(){
  }

  restartGame(){
    this.restartGameClicked.emit()
  }

  closeAlert(){
    this.closeClicked.emit()
  }

  unlockButtons(){
    this.buttonsLocked = false
  }
}
