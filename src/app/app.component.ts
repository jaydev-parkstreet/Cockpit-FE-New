import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from './core/services/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'COCKPIT-FE';

  constructor(private spinner: NgxSpinnerService,
    public commonService: CommonService
  ) {

  }
  ngOnInit() {
    // this.spinner.show();
    // setTimeout(() => {
    //   this.spinner.hide();

    // }, 8000);


  }
}
