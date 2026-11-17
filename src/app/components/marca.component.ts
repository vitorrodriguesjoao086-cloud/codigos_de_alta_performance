import { Component } from '@angular/core';

// Logo FitZone (mesmo desenho do projeto web)
@Component({
  selector: 'app-marca',
  standalone: true,
  template: `
    <span class="marca" style="display:inline-flex;align-items:center;gap:10px;font-weight:800;font-size:22px;color:#fff">
      <span style="display:grid;place-items:center;width:32px;height:32px;border-radius:10px;background:#ff5841">
        <svg viewBox="0 0 32 32" width="22" fill="#182016"><path d="M5 13h4v6H5zm18 0h4v6h-4zM10 11h3v10h-3zm9 0h3v10h-3zM13 14h6v4h-6z"/></svg>
      </span>
      <span>fit<span style="color:#a8df5e">zone</span></span>
    </span>`,
})
export class MarcaComponent {}
