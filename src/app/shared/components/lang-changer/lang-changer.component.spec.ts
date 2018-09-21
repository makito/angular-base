import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LangChangerComponent } from './lang-changer.component';

describe('LangChangerComponent', () => {
  let component: LangChangerComponent;
  let fixture: ComponentFixture<LangChangerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LangChangerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LangChangerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
