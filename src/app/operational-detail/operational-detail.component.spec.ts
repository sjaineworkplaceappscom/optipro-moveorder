import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationalDetailComponent } from './operational-detail.component';

describe('OperationalDetailComponent', () => {
  let component: OperationalDetailComponent;
  let fixture: ComponentFixture<OperationalDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationalDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
