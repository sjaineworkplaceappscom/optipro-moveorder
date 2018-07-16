import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FgrmscanchildinputformComponent } from './fgrmscanchildinputform.component';

describe('FgrmscanchildinputformComponent', () => {
  let component: FgrmscanchildinputformComponent;
  let fixture: ComponentFixture<FgrmscanchildinputformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FgrmscanchildinputformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FgrmscanchildinputformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
