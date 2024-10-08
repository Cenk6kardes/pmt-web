import { AfterViewInit, Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({ selector: '[scoreHighlight]' })
export class ScoreHighlightDirective implements AfterViewInit {
    constructor(private el: ElementRef, private renderer: Renderer2) { }

    ngAfterViewInit() {
        setTimeout(() => { // Don't remove because "p-highlight" class is reflected a bit later
            const selectedItem = this.el.nativeElement.querySelectorAll('li.p-highlight')[0];
            const backgroundColorElement = selectedItem.querySelector('span[data-background-color]');
            const color = backgroundColorElement.dataset.backgroundColor;
                    
            if (selectedItem && color) {
                this.renderer.setStyle(selectedItem, 'background-color', color);
                this.renderer.setStyle(selectedItem, 'color', '#ffffff');
            }
        }, 0);
      } 
}
