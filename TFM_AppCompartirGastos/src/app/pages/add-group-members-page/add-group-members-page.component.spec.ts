import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGroupMembersPageComponent } from './add-group-members-page.component';

describe('AddGroupMembersPageComponent', () => {
  let component: AddGroupMembersPageComponent;
  let fixture: ComponentFixture<AddGroupMembersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddGroupMembersPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddGroupMembersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
