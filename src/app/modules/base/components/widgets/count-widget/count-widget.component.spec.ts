import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountWidgetComponent } from './count-widget.component';

describe('CountWidgetComponent', () => {
  let component: CountWidgetComponent;
  let fixture: ComponentFixture<CountWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
