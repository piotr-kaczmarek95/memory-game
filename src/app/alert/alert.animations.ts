import { trigger, transition, animate, keyframes, style } from "@angular/animations"

export const alertFadeIn = trigger('alert',
  [transition('void => *', animate(2000, keyframes([
    style({
      opacity: 0,
      offset: 0
    }),
    style({
      opacity: 0,
      offset: 0.5
    }),
    style({
      opacity: 1,
      offset: 1
    })
  ])))])

export const backdropFadeIn = trigger('backdrop',
  [transition('void => *', animate(2000, keyframes([
    style({
      opacity: 0,
      offset: 0
    }),
    style({
      opacity: 0,
      offset: 0.5
    }),
    style({
      opacity: 0.3,
      offset: 1
    })
  ])))])
