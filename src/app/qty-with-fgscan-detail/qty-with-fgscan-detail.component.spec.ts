import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QtyWithFGScanDetailComponent } from './qty-with-fgscan-detail.component';

describe('QtyWithFGScanDetailComponent', () => {
  let component: QtyWithFGScanDetailComponent;
  let fixture: ComponentFixture<QtyWithFGScanDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QtyWithFGScanDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QtyWithFGScanDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
