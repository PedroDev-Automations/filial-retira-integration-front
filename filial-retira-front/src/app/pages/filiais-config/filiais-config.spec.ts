import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiliaisConfig } from './filiais-config';

describe('FiliaisConfig', () => {
  let component: FiliaisConfig;
  let fixture: ComponentFixture<FiliaisConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiliaisConfig],
    }).compileComponents();

    fixture = TestBed.createComponent(FiliaisConfig);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
