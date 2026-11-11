# PDF Viewer with Custom Signature Workflow

A modern Angular application built with **Syncfusion components** that provides PDF viewing capabilities with an enhanced custom signature workflow. Users can load signature from URLs, preview them, and apply them to PDF signature fields.

## Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Angular CLI**: v22.1.3 or higher

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ej2-pdf-viewer-angular-demo
```

### 2. Install Dependencies
```bash
npm install
```

This will install all required packages including:
- Angular 22.1.0
- Syncfusion PDF Viewer 35.1.43
- Syncfusion Dialog 35.1.42
- Syncfusion TextBox 35.1.43
- Syncfusion Buttons 35.1.41
- Tailwind CSS 3 Theme

## Running the Application

### Development Server

To start a local development server with live reload:

```bash
npm start
# or
ng serve
```

The application will:
1. Compile the Angular application
2. Start a development server on `http://localhost:4200/`
3. Automatically reload when you modify source files

**Note**: The application is not accessible from outside the development environment. Navigate to `http://localhost:4200/` in your local browser only.

### Production Build

To build the project for production:

```bash
npm run build
# or
ng build
```

Build artifacts are stored in the `dist/pdfviewer-app/` directory with optimizations for performance and speed.
