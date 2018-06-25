import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QtyWithoutFGScanComponent } from './qty-without-fgscan.component';

describe('QtyWithoutFGScanComponent', () => {
  let component: QtyWithoutFGScanComponent;
  let fixture: ComponentFixture<QtyWithoutFGScanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QtyWithoutFGScanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QtyWithoutFGScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
