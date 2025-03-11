import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header-tool',
  templateUrl: './header-tool.component.html',
  styleUrls: ['./header-tool.component.scss']
})
export class HeaderToolComponent implements OnInit {
  oldCockpitPMSTool : string = environment.oldCockpit +"/router.php/app#!/cockpit/product-management";;
  @Input() titleText: string;
  @Input() titleIcon: string;

  constructor() { }

  ngOnInit(): void { }
}
