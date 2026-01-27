import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Frontpage } from "./frontpage/frontpage";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Frontpage],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('messaging-app-frontend');
}
