import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card-content">
      @if(hasHeader){
      <div class="card-body-header">
        <ng-content select=".card-header"></ng-content>
      </div>
      }

      <div class="card-body-content">
        <ng-content select=".card-title">
          <h4 class="title" [ngClass]="getClass()">
            {{ title }}
          </h4>
        </ng-content>

        <ng-content select=".card-body"></ng-content>
      </div>
    </div>
  `,
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() title: string = '';

  @Input() align: 'start' | 'center' | 'end' = 'center';

  @Input() hasHeader: boolean = false;

  getClass() {
    return {
      'text-center': this.align == 'center',
      'text-start': this.align == 'start',
      'text-end': this.align == 'end',
    };
  }
}
