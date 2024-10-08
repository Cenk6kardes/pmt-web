import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { MessageService } from 'primeng/api';
import { AppConfig } from 'src/app/core/config/config';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
    title = 'Performance Management Tool';
    isAuthenticated = false;
    activeUser: string | undefined = 'unknown user';

    private unsubscribe = new Subject<void>();
    rememberMe: boolean = false;

    constructor(
        private layoutService: LayoutService,
        private auth: AuthenticationService,
        private messageService: MessageService,
        public config: AppConfig
    ) {}

    ngOnDestroy(): void {
        this.unsubscribe.next(undefined);
        this.unsubscribe.complete();
    }

    login(): void {
        this.messageService.add({
            severity: 'info',
            summary: 'Bilgi!',
            detail: 'Microsoft hesabınızla giriş yapmanız için yönlendiriliyorsunuz!',
            life: this.config.MESSAGE_LIFE_MS,
        });
        this.auth.login();
    }

    get dark(): boolean {
        return this.layoutService.config.colorScheme !== 'light';
    }
}
