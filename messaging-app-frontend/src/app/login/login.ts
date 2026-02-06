import { Component, DestroyRef, inject, output, signal } from '@angular/core';
import { ChatRegisterError } from '../model/ChatRegisterResult';
import { ChatUser } from '../model/ChatUser';
import { AuthService } from '../service/auth.service';
import { RestService } from '../service/rest.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private service = inject(RestService);
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);

  userEmitter = output<ChatUser>();
  registerEmitter = output<undefined>();

  UserName = signal('');
  Password = signal('');
  Error = signal<ChatRegisterError | undefined>(undefined);

  SwitchToRegister() {
    this.registerEmitter.emit(undefined);
  }

  onSubmit() {
    const username = this.UserName().toLowerCase().trim();
    const pass = this.Password().toLowerCase().trim();

    if (username.length != 0 && pass.length != 0) {
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
        });
    }
  }
}
