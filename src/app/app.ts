import { Component, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PdfViewerModule, LinkAnnotationService, BookmarkViewService,
         MagnificationService, ThumbnailViewService, ToolbarService,
         NavigationService, TextSearchService, TextSelectionService,
         PrintService, FormDesignerService, FormFieldsService,
         AnnotationService, PageOrganizerService, PdfViewerComponent } from '@syncfusion/ej2-angular-pdfviewer';
import { DialogComponent, DialogModule } from '@syncfusion/ej2-angular-popups';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, PdfViewerModule, DialogModule, TextBoxModule, CheckBoxModule, ButtonModule],
  providers: [ LinkAnnotationService, BookmarkViewService, MagnificationService,
               ThumbnailViewService, ToolbarService, NavigationService,
               TextSearchService, TextSelectionService, PrintService,
               FormDesignerService, FormFieldsService, AnnotationService, PageOrganizerService],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit {
  @ViewChild('customSignDialog') public customSignDialog!: DialogComponent;
  @ViewChild('previewCanvas') public previewCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pdfViewer') public pdfviewer!: PdfViewerComponent;

  public documentPath: string = 'https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf';
  public resourcesUrl: string = 'https://cdn.syncfusion.com/ej2/35.1.43/dist/ej2-pdfviewer-lib';
  public enableCustomSignature: boolean = true;
  public imageUrl: string = '';
  public validationMessage: string = '';
  public isImageLoaded: boolean = false;
  public selectedFormField: any = null;
  public isSaveButtonDisabled: boolean = true;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.applyStyleBasedOnCheckbox();
  }

  onCheckboxChange(args: any): void {
    this.enableCustomSignature = args.checked;
    this.applyStyleBasedOnCheckbox();
  }

  applyStyleBasedOnCheckbox(): void {
    let styleElement = document.getElementById('custom-signature-style');
    if (this.enableCustomSignature) {
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'custom-signature-style';
        styleElement.innerHTML = '.e-pv-signature-dialog-height { display: none !important; }';
        document.head.appendChild(styleElement);
      }
    } else {
      if (styleElement) {
        styleElement.remove();
      }
    }
  }

  formFieldClick(args: any): void {
    if (args.field.type === 'SignatureField') {
      if (this.enableCustomSignature) {
        // Check if the signature field already has a value
        if (args.field.value && args.field.value.trim() !== '') {
          // Field already has a signature, do not open the dialog
          return;
        }
        
        this.selectedFormField = args.field;
        this.resetDialogData();
        this.customSignDialog.show();
      }
    }
  }

  onCreated(): void {
    this.customSignDialog.hide();
  }

  onFetchImage(): void {
    // Validate URL format
    if (!this.imageUrl.trim()) {
      this.validationMessage = 'Please enter a URL.';
      this.isImageLoaded = false;
      this.isSaveButtonDisabled = true;
      this.cdr.detectChanges();
      return;
    }

    // Check if URL ends with valid image extensions
    const validExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'];
    const urlLower = this.imageUrl.toLowerCase();
    const hasValidExtension = validExtensions.some(ext => urlLower.endsWith(ext));

    if (!hasValidExtension) {
      this.validationMessage = 'Please provide a valid image URL.';
      this.isImageLoaded = false;
      this.isSaveButtonDisabled = true;
      this.cdr.detectChanges();
      return;
    }

    // Load image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      this.validationMessage = '';
      this.isImageLoaded = true;
      this.isSaveButtonDisabled = false; // Enable Save button on successful image load
      this.drawImageOnCanvas(img);
      this.cdr.detectChanges(); // Manually trigger change detection
    };

    img.onerror = () => {
      this.validationMessage = 'Failed to load image. Please check the URL.';
      this.isImageLoaded = false;
      this.isSaveButtonDisabled = true; // Disable Save button on image load failure
      this.cdr.detectChanges(); // Manually trigger change detection
    };

    img.src = this.imageUrl;
  }

  drawImageOnCanvas(img: HTMLImageElement): void {
    const canvas = this.previewCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 300;
    canvas.height = 200;

    // Clear canvas
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate dimensions to fit image in canvas while maintaining aspect ratio
    const maxWidth = canvas.width - 10;
    const maxHeight = canvas.height - 10;
    let width = img.width;
    let height = img.height;

    if (width > height) {
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }
    }

    // Center image in canvas
    const x = (canvas.width - width) / 2;
    const y = (canvas.height - height) / 2;

    ctx.drawImage(img, x, y, width, height);
  }

  onSave(): void {
    if (!this.isImageLoaded) {
      this.validationMessage = 'Please load an image first.';
      return;
    }

    // Convert canvas to Base64
    const canvas = this.previewCanvas.nativeElement;
    const base64Image = canvas.toDataURL('image/png');

    // Add signature to PDF form field
    if (this.selectedFormField) {
      const fields = this.pdfviewer.retrieveFormFields();
      const field = fields.find((f: any) => f.id === this.selectedFormField.id);
      if (field) {
        field.value = base64Image;
        this.pdfviewer.updateFormFieldsValue(field);
      }
      //this.selectedFormField.value = base64Image;
    }

    this.customSignDialog.hide();
    this.resetDialogData();
  }

  onCancel(): void {
    this.customSignDialog.hide();
    this.resetDialogData();
  }

  resetDialogData(): void {
    this.imageUrl = '';
    this.validationMessage = '';
    this.isImageLoaded = false;
    this.isSaveButtonDisabled = true; // Disable Save button on reset
    const canvas = this.previewCanvas?.nativeElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    this.cdr.detectChanges();
  }
}