import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private swUpdate: SwUpdate
  ) {}

  ngOnInit() {
    //  If email is stored, navigate to dashboard (already logged in)
    const storedEmail = sessionStorage.getItem('email');
    if (storedEmail) {
      console.log('🔄 Already logged in as:', storedEmail);
      this.router.navigate(['/dashboard']);
    } else {
      //  Don’t login automatically; show login form on UI
      this.router.navigate(['/login']);
    }

    //  PWA Update Check
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe(event => {
        if (event.type === 'VERSION_READY') {
          if (confirm('🔄 A new version of the app is available. Load it now?')) {
            window.location.reload();
          }
        }
      });
    }
  }
}
