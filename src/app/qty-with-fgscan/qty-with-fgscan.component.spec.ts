import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QtyWithFGScanComponent } from './qty-with-fgscan.component';

describe('QtyWithFGScanComponent', () => {
  let component: QtyWithFGScanComponent;
  let fixture: ComponentFixture<QtyWithFGScanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QtyWithFGScanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QtyWithFGScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
