import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { SharedService } from '../shared.service';
import { Router, RouterModule } from '@angular/router';
import { DashboardService } from './dashboard.service';
import { NgChartsModule } from 'ng2-charts'; 
import { ChartConfiguration } from 'chart.js'; 

@Component({
  selector: 'app-dashbord',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, RouterModule, NgChartsModule],
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css']
})
export class DashbordComponent implements OnInit {
  name: string = '';
  encodedName: string = '';
  isAdmin: boolean = false;
  showQR: boolean = false;

  barChartLabels: string[] = [];
  barChartData: number[] = [];
  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
  };

  constructor(
    private sharedService: SharedService,
    private dashboardService: DashboardService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.name = this.sharedService.getUsername() || sessionStorage.getItem('username') || 'Guest';
    this.encodedName = encodeURIComponent(this.name);
    this.isAdmin = this.name.toLowerCase() === 'admin';

    this.loadChartData(); 
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }

  showQRPopup(): void {
    this.showQR = true;
  }

  closeQRPopup(): void {
    this.showQR = false;
  }

  loadChartData(): void {
    this.dashboardService.getDashboardData().subscribe((data: any[]) => {
      this.barChartLabels = data.map(item => item.user.name);
      this.barChartData = data.map(item => item.rating);
    });
  }
}
