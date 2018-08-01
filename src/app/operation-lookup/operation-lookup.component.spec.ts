import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationLookupComponent } from './operation-lookup.component';

describe('OperationLookupComponent', () => {
  let component: OperationLookupComponent;
  let fixture: ComponentFixture<OperationLookupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationLookupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
