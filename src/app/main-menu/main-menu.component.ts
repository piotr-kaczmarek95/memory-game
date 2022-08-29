import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  constructor() { }

  boardSizes = environment.boardSizes
  selectedSize = null

  @Output() settingsConfirmed = new EventEmitter<number[]>()

  ngOnInit(): void {
  }

  setBoardSize(){
    this.settingsConfirmed.emit(this.selectedSize)
  }

}
