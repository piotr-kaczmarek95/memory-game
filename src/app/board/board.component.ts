import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CardsService } from '../cards.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {

  constructor(private cardsService: CardsService) { }

  cardsSub: Subscription
  foundPairsCounterSub: Subscription
  totalClicksCounterSub: Subscription

  clockInterval: ReturnType<typeof setInterval>
  secondsElapsed = 0
  clockDisplayedValue = '0:00'

  cardRows = null
  cardCols = null

  totalPairs = 0
  foundPairs : number

  totalClicks : number

  cardsIndexes : number[]

  menuVisible = false
  alertVisible = false

  containerWidth : string
  containerHeight : string

  ngOnInit(){
    this.cardsSub = this.cardsService.cardsIdsShuffled.subscribe((cardsIndexes: number[])=>{
      this.cardsIndexes = cardsIndexes
    })

    this.foundPairsCounterSub = this.cardsService.foundPairsCounter.subscribe((foundPairs: number)=>{
      this.foundPairs = foundPairs
      if(this.foundPairs > 0 && this.foundPairs === this.totalPairs){
        clearInterval(this.clockInterval)
        this.alertVisible = true
      }
    })

    this.totalClicksCounterSub = this.cardsService.clicksCounter.subscribe((clicks:number)=>{
      this.totalClicks = clicks
    })
  }

  ngOnDestroy(){
    this.cardsSub.unsubscribe()
    this.foundPairsCounterSub.unsubscribe()
    this.totalClicksCounterSub.unsubscribe()
  }

  openSettings(){
    this.menuVisible = true
    this.resetGameStats()
  }

  onSettingsConfirmed(boardSize: number[]){
    this.cardRows = boardSize[0]
    this.cardCols = boardSize[1]
    this.totalPairs = this.cardRows * this.cardCols / 2
    this.menuVisible = false

    this.containerWidth = `${100/this.cardCols}%`
    this.containerHeight = `${100/this.cardRows}%`

    this.cardsService.setupCards(this.totalPairs)
    this.startClock()
  }

  restartGame(){
    this.resetGameStats()
    this.cardsService.setupCards(this.totalPairs)
    this.startClock()
  }

  drawClock(){
    const min = Math.floor(this.secondsElapsed/60)
    const sec = this.secondsElapsed - min*60
    this.clockDisplayedValue = `${min}:${sec < 10 ? '0'+sec : sec}`
  }

  startClock(){
    this.clockInterval = setInterval(()=>{
      this.secondsElapsed++
      this.drawClock()
    }, 1000)
  }

  resetGameStats(){
    this.clockDisplayedValue = "0:00"
    this.secondsElapsed = 0
    this.cardsService.clearClicks()
    this.cardsService.clearPairs()
    this.cardsService.clearCards()

    if(this.clockInterval){
      clearInterval(this.clockInterval)
    }
  }

  onCloseAlertClicked(){
    this.resetGameStats()
    this.alertVisible = false
    this.totalPairs = 0
  }

  onRestartGameClicked(){
   this.restartGame()
   this.alertVisible = false
  }
}
