import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePwdModalComponent } from './change-pwd-modal.component';

describe('ChangePwdModalComponent', () => {
  let component: ChangePwdModalComponent;
  let fixture: ComponentFixture<ChangePwdModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePwdModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChangePwdModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
