import {ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal} from '@angular/core';
import {FileService} from '../../data/service/file.service';
import {FileItemDTO} from '../../data/model/file-item-dto';
import {DatePipe} from '@angular/common';
import {SIGNAL} from '@angular/core/primitives/signals';

@Component({
  selector: 'app-panel',
  imports: [
    DatePipe
  ],
  templateUrl: './panel.html',
  styleUrl: './panel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Panel implements OnInit{
  public fileService = inject(FileService);

  panelSide = input<'left' | 'right'>('left');
  activePanel = input<'left' | 'right'>('left');
  selectedFile = input<FileItemDTO | null>(null);
  fileSelected = output<FileItemDTO>();
  activate = output<'left' | 'right'>();

  drives = signal<string[]>([]);
  files= signal<FileItemDTO[]>([]);
  currentPath = signal<string>('');
  loading = false;

  ngOnInit() {
    this.loadDrives();
  }

  loadDrives(){
    this.fileService.getDrives()
      .subscribe({
        next: result => {
          this.drives.set(result);
        },
        error: err => {
          console.log('Не удалось получить диски ',err);
        }
      });
  }

  loadFiles(path: string){
    this.fileService.getFiles(path).subscribe({
      next: files =>{
        if(files) {
          this.files.set(files);
          this.currentPath.set(path);
          this.loading = false;
        }
      },
      error: err => {
        console.log('Не удалось получить файлы ', err);
      }
    });
  }

  onChangeDrive(event: Event) {
    const select = event.target as HTMLSelectElement;
    if (!select.value) return;
    this.loadFiles(select.value);
  }

  goToParent(){
    if(!this.currentPath()) return;
    this.fileService.getParent(this.currentPath())
      .subscribe({
        next: result =>{
          if(result){
            this.loadFiles(result);
          }
        },
        error: err => {
          console.log('Не удалось перейти в родительскую директорию', err);
        }
      })
  }

  openDirectory(file: FileItemDTO){
    if(file.isDirectory){
      this.loadFiles(file.path!);
    }
  }

  onSelectFile(file: FileItemDTO) {
    this.fileSelected.emit(file);
    this.activate.emit(this.panelSide());
  }

  reloadCurrentPath() {
    if (this.currentPath()) {
      this.loadFiles(this.currentPath());
    }
  }
}
