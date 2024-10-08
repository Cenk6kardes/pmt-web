import { Injectable } from "@angular/core";
import { MessageService } from "primeng/api";

@Injectable({
  providedIn: 'root',
})

export class AlertService{
    constructor(private messageService: MessageService, ){}

    callMessage(messageType:string,messageHeader:string,messageBody:string){
      this.messageService.add({
      severity: messageType,
      summary: messageHeader,
      detail: messageBody,
      life: 5000,
    });
    }
}
