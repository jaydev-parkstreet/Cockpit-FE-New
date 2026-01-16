import { Component, OnInit } from '@angular/core';
import { ToolHeader } from '../../shared/components/tool-header/tool-header';
import { FilterList } from './house-cash-credits.model';
import { SummaryTopBar } from '../../shared/components/summary-top-bar/summary-top-bar';
import { HouseCashCreditsService } from './house-cash-credits-service';

@Component({
  selector: 'app-house-cash-credits',
  imports: [ToolHeader, SummaryTopBar],
  templateUrl: './house-cash-credits.html',
  styleUrl: './house-cash-credits.scss',
})
export class HouseCashCredits implements OnInit {
  public topPanelConfig: any;
  public filterList: FilterList = {};

  constructor(private readonly houseCashCreditsService: HouseCashCreditsService) {}

  ngOnInit(): void {
    this.initGridOptions();
  }

  initGridOptions(): void {
    this.topPanelConfig = this.houseCashCreditsService.getTopPanelConfig();
  }
}
