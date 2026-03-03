import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrizConfig } from './matriz-config';

describe('MatrizConfig', () => {
  let component: MatrizConfig;
  let fixture: ComponentFixture<MatrizConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatrizConfig],
    }).compileComponents();

    fixture = TestBed.createComponent(MatrizConfig);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
