import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FGScanDetailComponent } from './fgscan-detail.component';

describe('FGScanDetailComponent', () => {
  let component: FGScanDetailComponent;
  let fixture: ComponentFixture<FGScanDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FGScanDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FGScanDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
