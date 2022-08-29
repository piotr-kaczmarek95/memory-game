import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { Card } from '../card.model'
import { CardsService } from '../cards.service'
import * as CardAnimations from './card.animations'

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  animations: [CardAnimations.cardFadeIn]
})
export class CardComponent implements OnInit, OnDestroy {
  constructor(private cardsService: CardsService) {}

  @Input('id') id: number
  card: Card

  cardsSubscription: Subscription

  ngOnInit(): void {
    this.cardsSubscription = this.cardsService.cardsChanged.subscribe(
      (cards) => {
        this.card = cards.find((card) => card.id === this.id)
      }
    );
  }

  ngOnDestroy(){
    this.cardsSubscription.unsubscribe()
  }

  onCardSelected(){
    this.cardsService.toggleVisibility(this.id)
  }
}
