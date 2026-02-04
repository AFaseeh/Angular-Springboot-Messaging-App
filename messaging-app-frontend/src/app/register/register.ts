import { Component, DestroyRef, inject, output, signal } from '@angular/core';
import { ChatUser } from '../model/ChatUser';
import { ChatService } from '../service/chat.service';
import { AuthService } from '../service/auth.service';
import { ChatRegisterError } from '../model/ChatRegisterResult';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private service = inject(ChatService);
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);

  userEmitter = output<ChatUser>();
  
  UserName = signal('1');
  Name = signal('1');
  Password = signal('1');
  CheckPassword = signal('1');

  samePass = signal(true);

  Error = signal<ChatRegisterError | undefined>(undefined);

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
        });
    }
  }
  onChangeCheckPassword() {
    const pass = this.Password().toLowerCase().trim();
    const checkPass = this.CheckPassword().toLowerCase().trim();

    this.samePass.set(pass === checkPass);
  }
}
