import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FgrmscanparentComponent } from './fgrmscanparent.component';

describe('FgrmscanparentComponent', () => {
  let component: FgrmscanparentComponent;
  let fixture: ComponentFixture<FgrmscanparentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FgrmscanparentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FgrmscanparentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
