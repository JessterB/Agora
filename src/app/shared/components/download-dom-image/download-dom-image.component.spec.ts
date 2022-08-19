// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { DownloadDomImageComponent } from './';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Download DOM Image', () => {
  let fixture: ComponentFixture<DownloadDomImageComponent>;
  let component: DownloadDomImageComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DownloadDomImageComponent],
      imports: [RouterTestingModule, BrowserAnimationsModule],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(DownloadDomImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have overlay', () => {
    expect(element.querySelector('p-overlaypanel.p-element')).toBeTruthy();
  });

  it('should open overlay on click', () => {
    const button = element.querySelector('button') as HTMLElement;

    expect(button).toBeTruthy();
    button.click();
    fixture.detectChanges();

    expect(document.querySelector('.download-dom-image-panel')).toBeTruthy();
  });

  it('should have a radiobox for each types', () => {
    const button = element.querySelector('button') as HTMLElement;

    expect(button).toBeTruthy();
    button.click();
    fixture.detectChanges();

    const overlayPanel = document.querySelector(
      '.download-dom-image-panel'
    ) as HTMLElement;

    expect(overlayPanel).toBeTruthy();
    expect(
      overlayPanel.querySelectorAll('p-radiobutton.p-element')?.length
    ).toEqual(component.types.length);
  });
});
