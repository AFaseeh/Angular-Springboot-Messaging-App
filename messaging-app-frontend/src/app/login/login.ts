import { Component, DestroyRef, inject, output, signal } from '@angular/core';
import { ChatRegisterError } from '../model/ChatRegisterResult';
import { ChatUser } from '../model/ChatUser';
import { AuthService } from '../service/auth.service';
import { RestService } from '../service/rest.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormErrorComponent } from '../wrappers/form-error';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  imports: [FormsModule, PasswordModule, FloatLabelModule, InputTextModule, ButtonModule, FormErrorComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private service = inject(RestService);
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  userEmitter = output<ChatUser>();
  registerEmitter = output<undefined>();

  UserName = signal('');
  Password = signal('');
  Error = signal<ChatRegisterError | undefined>(undefined);

  loading = signal(false);

  SwitchToRegister() {
    this.registerEmitter.emit(undefined);
  }

  onSubmit() {
    const username = this.UserName().toLowerCase().trim();
    const pass = this.Password().toLowerCase().trim();
    
    if (username.length != 0 && pass.length != 0) {
      this.loading.set(true);
      this.service
        .getUser({ username: username, password: pass })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((res) => {
          this.Error.set(res.error);
          if (res.user) {
            this.authService.setUserAuthInfo({
              username: username,
              token: res.token,
            });
            this.userEmitter.emit({
              id: res.user.id,
              name: res.user.name,
            });
          }
          else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `Failed to login. Please try again. \n${res.error?.message || ''}`,
            });
          }
          this.loading.set(false);
        });
    }
  }
}
