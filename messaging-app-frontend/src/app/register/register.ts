import { Component, DestroyRef, inject, output, signal } from '@angular/core';
import { ChatUser } from '../model/ChatUser';
import { AuthService } from '../service/auth.service';
import { ChatRegisterError } from '../model/ChatRegisterResult';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RestService } from '../service/rest.service';

import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormErrorComponent } from '../wrappers/form-error';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  imports: [FormsModule, PasswordModule, FloatLabelModule, InputTextModule, ButtonModule, FormErrorComponent],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private service = inject(RestService);
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  userEmitter = output<ChatUser>();
  loginEmitter = output<undefined>();

  UserName = signal('');
  Name = signal('');
  Password = signal('');
  CheckPassword = signal('');

  samePass = signal(true);

  Error = signal<ChatRegisterError | undefined>(undefined);

  loading = signal(false);

  SwitchToLogin() {
    this.loginEmitter.emit(undefined);
  }

  onCreateUser() {
    const name = this.Name().toLowerCase().trim();
    const username = this.UserName().toLowerCase().trim();
    const pass = this.Password().toLowerCase().trim();
    const checkPass = this.CheckPassword().toLowerCase().trim();
    
    if (
      name.length != 0 &&
      username.length != 0 &&
      pass.length != 0 &&
      checkPass.length != 0 &&
      this.samePass()
    ) {
      this.loading.set(true);
      this.service
      .createUser(name, {
        username: username,
          password: pass,
        })
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
          else
          {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `Failed to create user. Please try again. \n${res.error?.message || ''}`,
            });
          }
          this.loading.set(false);
        });
    }
  }
  onChangeCheckPassword() {
    const pass = this.Password().toLowerCase().trim();
    const checkPass = this.CheckPassword().toLowerCase().trim();

    this.samePass.set(pass === checkPass);
  }
}
