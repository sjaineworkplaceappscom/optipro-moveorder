import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QtyWithFGAndRMScanComponent } from './qty-with-fgand-rmscan.component';

describe('QtyWithFGAndRMScanComponent', () => {
  let component: QtyWithFGAndRMScanComponent;
  let fixture: ComponentFixture<QtyWithFGAndRMScanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QtyWithFGAndRMScanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QtyWithFGAndRMScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
