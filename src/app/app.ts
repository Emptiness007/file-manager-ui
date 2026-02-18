import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Panel} from './view/panel/panel';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Panel],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('file-manager-ui');
}
