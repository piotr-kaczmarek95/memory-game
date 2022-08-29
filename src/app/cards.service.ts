import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { Card } from "./card.model";

@Injectable({providedIn: 'root'})
export class CardsService{

    constructor(private http: HttpClient){}

    cardsIdsShuffled = new Subject<number[]>()
    cardsChanged = new Subject<Card[]>()

    foundPairsCounter = new BehaviorSubject<number>(0)
    clicksCounter = new BehaviorSubject<number>(0)

    private cards: Array<Card> = []

    private shuffleCards(arr: Card[]): Card[] {

        for (let i = arr.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }

        return arr
    }

    private adjustImgUrl(url: string){

      const imgSize = '300'

      const adjustedUrl =  url.split('/')
      adjustedUrl.splice(-2, 2, imgSize)
      return adjustedUrl.join('/')
    }

    private hideAllImages(){

        this.cards.forEach(card => card.imgVisible = false)
    }

    private getAllVisibleCards(){
        return this.cards.filter((card)=>{return card.imgVisible === true && card.found === false})
    }

    private markCardAsFound(card: Card){
        card.found = true
    }

    setupCards(totalPairs: number) {

        this.cards = []
        this.cardsIdsShuffled.next([])

        const randomPage = Math.floor(Math.random() * 10)

        return this.http.get(`https://picsum.photos/v2/list`, {
            params: {
                page: randomPage,
                limit: totalPairs
            }
        }).subscribe((imgData: any) => {

            // console.log(imgData)

            let counter = 0;

            for (let i=0; i<imgData.length; i++){

                const imgUrl = this.adjustImgUrl(imgData[i].download_url)
                this.cards.push({
                    id: counter,
                    imgUrl: imgUrl,
                    imgVisible: false,
                    found: false
                },
                {
                    id: counter+1,
                    imgUrl: imgUrl,
                    imgVisible: false,
                    found: false
                })

                counter = counter+2
            }

            this.cards = this.shuffleCards(this.cards)

            // console.log(this.cards)

            this.cardsChanged.next(this.cards)
            this.cardsIdsShuffled.next([...this.cards.map(card=> card.id)])
        })
    }

    private currentlyUncoveredPairs = 0
    private totalClicks = 0

    clearPairs(){
      this.currentlyUncoveredPairs = 0
      this.foundPairsCounter.next(0)
    }

    clearClicks(){
      this.totalClicks = 0
      this.clicksCounter.next(0)
    }

    clearCards(){
      this.cardsIdsShuffled.next([])
    }

    toggleVisibility(id: number) {

        for (let card of this.cards) {

            if (card.id === id) {

                const visibleCards = this.getAllVisibleCards()
                const visibleCardsCounter = visibleCards.length

                // console.log("Odkrytych "+visibleCardsCounter)

                if(visibleCardsCounter === 0){
                    card.imgVisible = !card.imgVisible
                    this.totalClicks++
                }

                if(visibleCardsCounter === 1){

                    const alreadyVisibleCard = visibleCards[0]

                      if(alreadyVisibleCard.id !== card.id){

                        this.totalClicks++

                          card.imgVisible = !card.imgVisible

                          if(alreadyVisibleCard.imgUrl === card.imgUrl){

                              // console.log("Pair found!")
                              this.markCardAsFound(card)
                              this.markCardAsFound(alreadyVisibleCard)

                              this.currentlyUncoveredPairs++
                              this.foundPairsCounter.next(this.currentlyUncoveredPairs)
                          }
                      }
                }

                if(visibleCardsCounter === 2){

                    // if (!card.imgVisible) return
                    this.totalClicks++
                    this.hideAllImages()

                    if (visibleCards.filter(visibleCard => visibleCard.id === card.id).length === 0){
                       card.imgVisible = true
                    }
                }

                // console.log(this.cards)
                this.clicksCounter.next(this.totalClicks)
                this.cardsChanged.next(this.cards)
                return
            }
        }
    }
}
