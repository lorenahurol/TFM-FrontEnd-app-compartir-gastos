import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationsToastComponent } from './invitations-toast.component';

describe('InvitationsToastComponent', () => {
  let component: InvitationsToastComponent;
  let fixture: ComponentFixture<InvitationsToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvitationsToastComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvitationsToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
