import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderLookupComponent } from './work-order-lookup.component';

describe('WorkOrderLookupComponent', () => {
  let component: WorkOrderLookupComponent;
  let fixture: ComponentFixture<WorkOrderLookupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkOrderLookupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkOrderLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
