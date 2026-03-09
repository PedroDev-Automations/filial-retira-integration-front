import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SegurancaConfig } from './seguranca-config';

describe('SegurancaConfig', () => {
  let component: SegurancaConfig;
  let fixture: ComponentFixture<SegurancaConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SegurancaConfig],
    }).compileComponents();

    fixture = TestBed.createComponent(SegurancaConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
