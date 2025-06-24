import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Import this
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { SharedService } from '../shared.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashbord',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, RouterModule], // ✅ Add CommonModule here
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css']
})
export class DashbordComponent implements OnInit {
  name: string = '';
  encodedName: string = '';
  isAdmin: boolean = false;
  showQR: boolean = false;

  constructor(
    private sharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.name = this.sharedService.getUsername() || sessionStorage.getItem('username') || 'Guest';
    this.encodedName = encodeURIComponent(this.name);
    this.isAdmin = this.name.toLowerCase() === 'admin';
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
}
