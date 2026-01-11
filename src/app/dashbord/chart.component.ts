import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './chart.component.html'
})
export class DashboardChartComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  @ViewChild('chartContainer') chartContainer?: ElementRef;

  averageRating = 0;
  isLoading = true;
  private resizeObserver!: ResizeObserver;
  private initialized = false;

  chartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Rating',
        backgroundColor: [
          'rgba(52, 152, 219, 0.9)',
          'rgba(46, 204, 113, 0.9)',
          'rgba(155, 89, 182, 0.9)',
          'rgba(241, 196, 15, 0.9)',
          'rgba(231, 76, 60, 0.9)',
          'rgba(230, 126, 34, 0.9)',
          'rgba(26, 188, 156, 0.9)',
          'rgba(142, 68, 173, 0.9)',
          'rgba(22, 160, 133, 0.9)',
          'rgba(39, 174, 96, 0.9)'
        ],
        borderColor: [
          'rgb(41, 128, 185)',
          'rgb(39, 174, 96)',
          'rgb(142, 68, 173)',
          'rgb(243, 156, 18)',
          'rgb(192, 57, 43)',
          'rgb(211, 84, 0)',
          'rgb(17, 153, 128)',
          'rgb(113, 54, 138)',
          'rgb(17, 128, 106)',
          'rgb(31, 139, 76)'
        ],
        borderWidth: 2,
        borderRadius: 8,
        barThickness: 45,
        hoverBackgroundColor: 'rgba(255, 255, 255, 0.3)',
        hoverBorderWidth: 3
      }
    ]
  };

  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'x' as const,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        titleFont: {
          size: 14,
          weight: 'bold' as const
        },
        bodyFont: {
          size: 13
        },
        padding: 12,
        cornerRadius: 6,
        displayColors: false,
        callbacks: {
          title: (context) => {
            // Show user name in tooltip title
            const label = context[0].label || 'Unknown User';
            return label;
          },
          label: (context) => {
            const rating = context.parsed.y;
            // Show stars in tooltip instead of label
            return `Rating: ${rating} ${'⭐'.repeat(rating)}${'☆'.repeat(5 - rating)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawTicks: false
        },
        ticks: {
          color: '#2c3e50',
          font: {
            size: 13,
            weight: '500' as any
          },
          padding: 10,
          // Trim long names if needed
          callback: function (value, index) {
            const label = this.getLabelForValue(value as number);
            // Keep only the name (remove any extra info)
            const nameOnly = label.split('\n')[0];
            // Truncate if too long
            return nameOnly.length > 15 ? nameOnly.substring(0, 15) + '...' : nameOnly;
          }
        }
      },
      y: {
        beginAtZero: true,
        max: 5,
        grid: {
          color: 'rgba(236, 240, 241, 0.8)',
          drawTicks: false
        },
        ticks: {
          stepSize: 1,
          color: '#7f8c8d',
          font: {
            size: 13,
            weight: '500' as any
          },
          padding: 8,
          callback: function (value) {
            return value + ' ⭐';
          }
        },
        border: {
          dash: [4, 4]
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart' as const
    }
  };

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.loadChartData();
  }

  ngAfterViewInit(): void {
    // Wait a bit for DOM to be fully rendered
    setTimeout(() => {
      this.forceChartUpdate();
    }, 100);

    // Set up resize observer to detect container size changes
    if (this.chartContainer) {
      this.setupResizeObserver();
    }
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  loadChartData(): void {
    this.isLoading = true;
    this.dashboardService.getDashboardData().subscribe({
      next: (data: any[]) => {
        console.log('📊 Dashboard Data:', data);

        // ✅ ONLY user names in labels (no stars)
        const labels = data.map(item => {
          return item.user?.name || 'Unknown User';
        });

        const values = data.map(item => item.rating);
        const colors = this.generateGradientColors(values.length);

        console.log('📌 Labels (Only Names):', labels);
        console.log('📌 Ratings:', values);

        this.averageRating = values.length
          ? parseFloat((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2))
          : 0;

        // Update chartData
        this.chartData.labels = [...labels];
        this.chartData.datasets[0].data = [...values];
        this.chartData.datasets[0].backgroundColor = colors;

        this.isLoading = false;

        // Force chart update after data is loaded
        setTimeout(() => {
          this.forceChartUpdate();
        }, 50);
      },
      error: (err) => {
        console.error('❌ Failed to load chart data:', err);
        this.isLoading = false;
      }
    });
  }

  private setupResizeObserver(): void {
    if (!this.chartContainer?.nativeElement) return;

    this.resizeObserver = new ResizeObserver(() => {
      // Debounce the resize event
      clearTimeout((this as any).resizeTimer);
      (this as any).resizeTimer = setTimeout(() => {
        this.forceChartUpdate();
      }, 150);
    });

    if (this.chartContainer.nativeElement) {
      this.resizeObserver.observe(this.chartContainer.nativeElement);
    }
  }

  forceChartUpdate(): void {
    if (this.chart && this.chart.chart) {
      console.log('🔄 Forcing chart update...');
      this.chart.update();
      this.initialized = true;
    } else if (!this.initialized) {
      // If chart not initialized yet, try to render it
      setTimeout(() => {
        this.forceChartUpdate();
      }, 100);
    }
  }

  // Manual refresh method that can be called from template
  refreshChart(): void {
    this.isLoading = true;
    this.loadChartData();
  }

  // Fix for chart visibility issue
  onChartClick(): void {
    this.forceChartUpdate();
  }

  // Getter for template to safely check labels length
  get hasChartData(): boolean {
    return !this.isLoading && (this.chartData.labels?.length || 0) > 0;
  }

  // Getter for total users
  get totalUsers(): number {
    return this.chartData.labels?.length || 0;
  }

  private generateGradientColors(count: number): string[] {
    const colors = [];
    const baseColors = [
      'rgba(52, 152, 219, 0.9)',   // Blue
      'rgba(46, 204, 113, 0.9)',   // Green
      'rgba(155, 89, 182, 0.9)',   // Purple
      'rgba(241, 196, 15, 0.9)',   // Yellow
      'rgba(231, 76, 60, 0.9)',    // Red
      'rgba(230, 126, 34, 0.9)',   // Orange
      'rgba(26, 188, 156, 0.9)',   // Teal
      'rgba(142, 68, 173, 0.9)',   // Dark Purple
      'rgba(22, 160, 133, 0.9)',   // Sea Green
      'rgba(39, 174, 96, 0.9)'     // Emerald
    ];

    for (let i = 0; i < count; i++) {
      colors.push(baseColors[i % baseColors.length]);
    }

    return colors;
  }
}