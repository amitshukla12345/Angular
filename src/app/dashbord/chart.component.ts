import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { DashboardService } from './dashboard.service';


@Component({
  selector: 'app-dashboard-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './chart.component.html'
})
export class DashboardChartComponent implements OnInit {
  averageRating = 0;

  chartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'User Ratings',
        backgroundColor: '#3498db',
        borderRadius: 5,
        barThickness: 40
      }
    ]
  };

  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'x', // ✅ Column chart (vertical bars)
    scales: {
      x: {
        title: {
          display: true,
          text: 'Users',
          font: { size: 16 }
        },
        ticks: {
          color: 'green',//for name change
          font: { size: 14 }
        }
      },
      y: {
        beginAtZero: true,
        max: 5,
        title: {
          display: true,
          text: 'Rating',
          font: { size: 16 }
        },
        ticks: {
          stepSize: 1,
          color: 'red',
          font: { size: 14 }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };


  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadChartData();

    // 🔁 Optional live refresh every 5 sec
    
   // setInterval(() => this.loadChartData(), 5000);
  }

  loadChartData(): void {
    this.dashboardService.getDashboardData().subscribe((data: any[]) => {
      console.log('📊 Dashboard Data:', data);

      // Check if user object exists and contains name
      const labels = data.map(item => `${item.user.name} (${item.rating})`);
    const values = data.map(item => item.rating);


      console.log('📌 Labels:', labels);
    console.log('📌 Ratings:', values);

      this.averageRating = values.length
        ? values.reduce((a, b) => a + b, 0) / values.length
        : 0;

      // ✅ update chartData object directly
      this.chartData.labels = [...labels]; // force re-render
      this.chartData.datasets[0].data = [...values];
    });
  }
}
