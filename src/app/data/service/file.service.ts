import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {FileItemDTO} from '../model/file-item-dto';
import {plainToInstance} from 'class-transformer';

@Injectable({providedIn: 'root'})
export class FileService {
  private readonly baseUrl = environment.backendUrl;

  private readonly http = inject(HttpClient);

  getDrives(): Observable<string[]>{
    return this.http.get<string[]>(`${this.baseUrl}/drives`);
  }

  getFiles(path: string): Observable<FileItemDTO[]>{
    return this.http.get<FileItemDTO[]>(`${this.baseUrl}/files`, {params: {path}})
      .pipe(
        map(response => plainToInstance(FileItemDTO, response))
      );
  }

  getParent(path: string): Observable<string>{
    return this.http.get(`${this.baseUrl}/parent`, {params: { path }, responseType: 'text'
    });
  }

  copy(sourcePath: string, targetPath: string): Observable<string> {
    return this.http.post(`${this.baseUrl}/copy`, null, {
      params: { sourcePath, targetPath }, responseType: 'text'
    });
  }

  move(sourcePath: string, targetPath: string): Observable<string> {
    return this.http.post(`${this.baseUrl}/move`, null, {
      params: { sourcePath, targetPath }, responseType: 'text'
    });
  }

  delete(sourcePath: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/delete`, null, {
      params: { sourcePath }
    });
  }
}
