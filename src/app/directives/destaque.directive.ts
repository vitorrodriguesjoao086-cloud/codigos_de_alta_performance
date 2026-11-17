import { Directive, HostBinding, HostListener } from '@angular/core';

// DIRETIVA PERSONALIZADA 1: aumenta o elemento ao passar o mouse
@Directive({ selector: '[appDestaque]', standalone: true })
export class DestaqueDirective {
  @HostBinding('style.transform') transform = 'scale(1)';
  @HostBinding('style.transition') transicao = 'transform .2s';
  @HostListener('mouseenter') entrar() { this.transform = 'scale(1.03)'; }
  @HostListener('mouseleave') sair() { this.transform = 'scale(1)'; }
}
