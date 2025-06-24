import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterLinkRendererComponent } from './router-link-renderer.component';

describe('RouterLinkRendererComponent', () => {
  let component: RouterLinkRendererComponent;
  let fixture: ComponentFixture<RouterLinkRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterLinkRendererComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RouterLinkRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
