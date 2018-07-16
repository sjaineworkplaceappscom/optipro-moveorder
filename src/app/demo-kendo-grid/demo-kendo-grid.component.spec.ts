import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoKendoGridComponent } from './demo-kendo-grid.component';

describe('DemoKendoGridComponent', () => {
  let component: DemoKendoGridComponent;
  let fixture: ComponentFixture<DemoKendoGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoKendoGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoKendoGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
