import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { LayoutService } from './layout/service/app.layout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(
    private primengConfig: PrimeNGConfig,
    private layoutService: LayoutService
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.layoutService.config = {
      ripple: false, //toggles ripple on and off
      inputStyle: 'outlined', //default style for input elements
      menuMode: 'static', //layout mode of the menu, valid values are "static", "overlay", "slim", "horizontal", "reveal" and "drawer"
      colorScheme: 'light', //color scheme of the template, valid values are "light", "dim" and "dark"
      theme: 'indigo', //default component theme for PrimeNG
      menuTheme: 'colorScheme', //theme of the menu, valid values are "colorScheme", "primaryColor" and "transparent"
      scale: 14, //size of the body font size to scale the whole application
    };
  }
}
