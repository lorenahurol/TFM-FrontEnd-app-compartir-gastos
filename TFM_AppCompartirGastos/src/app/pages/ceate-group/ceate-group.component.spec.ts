import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CeateGroupComponent } from './ceate-group.component';

describe('CeateGroupComponent', () => {
  let component: CeateGroupComponent;
  let fixture: ComponentFixture<CeateGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CeateGroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CeateGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
