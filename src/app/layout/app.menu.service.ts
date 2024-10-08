import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MenuChangeEvent } from './api/menuchangeevent';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menuSource = new Subject<MenuChangeEvent>();
  private resetSource = new Subject();
  menuSource$ = this.menuSource.asObservable();
  resetSource$ = this.resetSource.asObservable();

  private descriptionSubject = new Subject<string>();
  private headerSubject = new Subject<string>();
  description$ = this.descriptionSubject.asObservable();
  header$ = this.headerSubject.asObservable();

  setDescription(description: string) {
    this.descriptionSubject.next(description);
  }

  setHeader(header:string){
    this.headerSubject.next(header);
  }

  onMenuStateChange(event: MenuChangeEvent) {
    this.menuSource.next(event);
  }

  reset() {
    this.resetSource.next(true);
  }
}
