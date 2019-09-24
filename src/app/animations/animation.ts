import { trigger, transition, style, query, group, animate } from '@angular/animations';

export const slideInAnimation = trigger('routeAnimation', [
    transition('* <=> *', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
            style({
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100%'
            })
        ], {optional: true}),
        query(':enter', [
            style({right: '100%'})
        ], {optional: true}),
        group([
            query(':enter', [
                animate('100ms ease-out', style({right: '0%'}))
            ], {optional: true}),
            query(':leave', [
                animate('100ms ease-out', style({right: '-100%'}))
            ], {optional: true}),
        ])
    ])
]);
