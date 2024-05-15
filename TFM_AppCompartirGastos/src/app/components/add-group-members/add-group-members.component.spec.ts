import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGroupMembersComponent } from './add-group-members.component';

describe('AddGroupMembersComponent', () => {
  let component: AddGroupMembersComponent;
  let fixture: ComponentFixture<AddGroupMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddGroupMembersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddGroupMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
