import { Component, input } from '@angular/core';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-form-error',
  imports: [MessageModule],
  template: `
    <p-message severity="error" size="small" variant="simple">
      {{ message() }}
    </p-message>
  `
})
export class FormErrorComponent {
  message = input.required<string>(); 
}