import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FgrmscanparentinputformComponent } from './fgrmscanparentinputform.component';

describe('FgrmscanparentinputformComponent', () => {
  let component: FgrmscanparentinputformComponent;
  let fixture: ComponentFixture<FgrmscanparentinputformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FgrmscanparentinputformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FgrmscanparentinputformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
