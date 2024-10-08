import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AppConfig {
    public MESSAGE_LIFE_MS = 5000;
    public EMPTY_ERROR_MESSAGE = 'Bu alan boş geçilemez!';
}
