import {Expose, Type} from 'class-transformer';

@Expose()
export class FileItemDTO{
  name?: string;
  path?: string;
  isDirectory?: boolean;
  size?: number;
  @Type(() => Date)
  lastUpdate?: Date;

  get formattedSize(): string{
    if(this.isDirectory) return '';
    if(this.size === 0) return '0 б';

    const sizes = ['б', 'Кб', 'Мб', 'Гб', 'Тб'];
    let value = this.size!;
    let sizeIndex = 0;

    while(value >= 1024 && sizeIndex < sizes.length - 1){
      value /= 1024;
      sizeIndex++;
    }
    return `${value.toFixed(2)} ${sizes[sizeIndex]}`;
  }

}
