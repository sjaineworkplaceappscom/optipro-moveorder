import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveOrderComponent } from './move-order.component';

describe('MoveOrderComponent', () => {
  let component: MoveOrderComponent;
  let fixture: ComponentFixture<MoveOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoveOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
