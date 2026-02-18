import {Component, inject, input, signal, ViewChild} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Panel} from './view/panel/panel';
import {FileItemDTO} from './data/model/file-item-dto';
import {FileService} from './data/service/file.service';

@Component({
  selector: 'app-root',
  imports: [ Panel],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('file manager');

  activePanel = signal<'left' | 'right'>('left');
  selectedFile = signal<FileItemDTO | null>(null);

  @ViewChild('leftPanel') leftPanel!: Panel;
  @ViewChild('rightPanel') rightPanel!: Panel;

  setActivePanel(panel: 'left' | 'right'){
    this.activePanel.set(panel);
  }

  setSelectedFile(file: FileItemDTO | null){
    this.selectedFile.set(file);
  }

  getCurrentPanelPath(): string{
    return this.activePanel() === 'left' ? this.rightPanel.currentPath() : this.leftPanel.currentPath();
  }

  refreshPanel(){
    this.leftPanel.reloadCurrentPath();
    this.rightPanel.reloadCurrentPath();
  }

  copy() {
    const file = this.selectedFile();
    if (!file) return;

    const sourcePath = file.path!;
    const targetPath = this.getCurrentPanelPath();

    this.leftPanel.fileService.copy(sourcePath, targetPath).subscribe({
      next: () => this.refreshPanel(),
      error: err =>{
        console.error('Не удалось копировать файл', err);
      }
    });
  }

  move() {
    const file = this.selectedFile();
    if (!file) return;

    const sourcePath = file.path!;
    const targetPath = this.getCurrentPanelPath();

    this.leftPanel.fileService.move(sourcePath, targetPath).subscribe({
      next: () => this.refreshPanel(),
      error: err => {
        console.error('Не удалось переместить файл', err);
      }
    });
  }

  delete() {
    const file = this.selectedFile();
    if (!file) return;

    if (!confirm(`Удалить "${file.name}"?`)) return;

    this.leftPanel.fileService.delete(file.path!).subscribe({
      next: () => {
        this.selectedFile.set(null);
        this.refreshPanel();
      },
      error: err => {
        console.error('Не удалось удалить файл', err);
      }
    });
  }


}
