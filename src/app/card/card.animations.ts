import { trigger, transition, animate, style, keyframes, state } from "@angular/animations"
export const cardFadeIn = trigger('card', [
  transition(
    'void => *',
    animate(
      300,
      keyframes([
        style({
          opacity: 0,
          offset: 0,
        }),
        style({
          opacity: 0.5,
          offset: 0.5,
        }),
        style({
          opacity: 1,
          offset: 1,
        }),
      ])
    )
  ),
])

