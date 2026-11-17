import { Directive, ElementRef, HostListener } from '@angular/core';

// DIRETIVA PERSONALIZADA 2: se a imagem falhar, mostra uma imagem cinza
@Directive({ selector: 'img[appFallback]', standalone: true })
export class FallbackImgDirective {
  constructor(private el: ElementRef<HTMLImageElement>) {}
  @HostListener('error') erro() {
    this.el.nativeElement.src =
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200'><rect width='100%25' height='100%25' fill='%23ddd'/></svg>";
  }
}
