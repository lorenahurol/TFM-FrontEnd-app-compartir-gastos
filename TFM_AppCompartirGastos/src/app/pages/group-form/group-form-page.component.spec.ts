import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupFormPageComponent } from './group-form-page.component';


describe('GroupFormPageComponent', () => {
  let component: GroupFormPageComponent;
  let fixture: ComponentFixture<GroupFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupFormPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
