import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appLettersOnly]'
})
export class LettersOnlyDirective {

  constructor(private el: ElementRef) { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    
    // Permitir teclas especiales (backspace, delete, tab, escape, enter, etc.)
    if ([46, 8, 9, 27, 13, 32].indexOf(event.keyCode) !== -1 ||
        // Permitir Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (event.keyCode === 65 && event.ctrlKey === true) ||
        (event.keyCode === 67 && event.ctrlKey === true) ||
        (event.keyCode === 86 && event.ctrlKey === true) ||
        (event.keyCode === 88 && event.ctrlKey === true) ||
        // Permitir home, end, left, right
        (event.keyCode >= 35 && event.keyCode <= 39)) {
      return;
    }
    
    // Asegurar que sea una letra (a-z, A-Z, acentos)
    if (!((event.keyCode >= 65 && event.keyCode <= 90) || 
          (event.keyCode >= 97 && event.keyCode <= 122))) {
      event.preventDefault();
    }
  }

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    const pattern = /[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/;
    const inputChar = String.fromCharCode(event.charCode);
    
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
