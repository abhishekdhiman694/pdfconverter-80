
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import FileSaver from 'file-saver';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

/**
 * Service for handling PDF conversions and operations
 */
export class PDFService {
  /**
   * Convert PDF to Word document
   */
  static async pdfToWord(file: File, onProgress: (progress: number) => void) {
    return new Promise<Blob>(async (resolve, reject) => {
      try {
        // Read the PDF file
        const arrayBuffer = await file.arrayBuffer();
        
        // Load the PDF document
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const totalPages = pdf.numPages;
        
        // Create a new Word document with a default options object
        const doc = new Document({
          sections: []
        });
        const paragraphs: Paragraph[] = [];
        
        // Process each page
        for (let i = 1; i <= totalPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const text = textContent.items.map((item: any) => item.str).join(' ');
          
          paragraphs.push(
            new Paragraph({
              children: [new TextRun(text)],
              spacing: { after: 200 }
            })
          );
          
          // Update progress
          onProgress(i / totalPages * 100);
        }
        
        // Add all paragraphs to the document
        doc.addSection({
          children: paragraphs,
        });
        
        // Generate and return Word document
        const buffer = await Packer.toBuffer(doc);
        const blob = new Blob([buffer], { 
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
        });
        
        resolve(blob);
      } catch (error) {
        console.error('Error converting PDF to Word:', error);
        reject(error);
      }
    });
  }
  
  /**
   * Convert Word document to PDF
   */
  static async wordToPdf(file: File, onProgress: (progress: number) => void) {
    return new Promise<Blob>(async (resolve, reject) => {
      try {
        // For demo purposes, we'll create a simple PDF with the file name
        // In a real implementation, this would parse the Word document
        
        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();
        
        // Add file name as text
        const { width, height } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        
        page.drawText(`Converted from: ${file.name}`, {
          x: 50,
          y: height - 50,
          size: 12,
          font
        });
        
        page.drawText('This is a simulated Word to PDF conversion.', {
          x: 50,
          y: height - 80,
          size: 12,
          font
        });
        
        // Update progress
        for (let i = 0; i <= 10; i++) {
          await new Promise(r => setTimeout(r, 100));
          onProgress(i * 10);
        }
        
        // Save the PDF
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        
        resolve(blob);
      } catch (error) {
        console.error('Error converting Word to PDF:', error);
        reject(error);
      }
    });
  }
  
  /**
   * Convert PowerPoint to PDF
   */
  static async pptToPdf(file: File, onProgress: (progress: number) => void) {
    return new Promise<Blob>(async (resolve, reject) => {
      try {
        // Create a new PDF document (simulated conversion)
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();
        
        // Add file name as text
        const { width, height } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        
        page.drawText(`Converted from PowerPoint: ${file.name}`, {
          x: 50,
          y: height - 50,
          size: 12,
          font
        });
        
        page.drawText('This is a simulated PowerPoint to PDF conversion.', {
          x: 50,
          y: height - 80,
          size: 12,
          font
        });
        
        // Simulate slides
        for (let i = 1; i <= 5; i++) {
          const slidePage = pdfDoc.addPage();
          slidePage.drawText(`Slide ${i}`, {
            x: width / 2 - 30,
            y: height / 2,
            size: 24,
            font
          });
          
          // Update progress
          onProgress(i * 20);
        }
        
        // Save the PDF
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        
        resolve(blob);
      } catch (error) {
        console.error('Error converting PowerPoint to PDF:', error);
        reject(error);
      }
    });
  }

  /**
   * Convert PDF to PowerPoint
   */
  static async pdfToPpt(file: File, onProgress: (progress: number) => void) {
    return new Promise<Blob>(async (resolve, reject) => {
      try {
        // Read the PDF file
        const arrayBuffer = await file.arrayBuffer();
        
        // Load the PDF document
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const totalPages = pdf.numPages;
        
        // Create a simple blob to simulate PowerPoint file
        // In a real app, this would generate a proper PPTX file
        let content = "";
        
        // Process each page as a slide
        for (let i = 1; i <= totalPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const text = textContent.items.map((item: any) => item.str).join(' ');
          
          content += `Slide ${i}: ${text}\n\n`;
          
          // Update progress
          onProgress(i / totalPages * 100);
        }
        
        // Create blob as PowerPoint
        const blob = new Blob([content], { 
          type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' 
        });
        
        resolve(blob);
      } catch (error) {
        console.error('Error converting PDF to PowerPoint:', error);
        reject(error);
      }
    });
  }
  
  /**
   * Convert HTML to PDF
   */
  static async htmlToPdf(htmlContent: string, onProgress: (progress: number) => void) {
    return new Promise<Blob>(async (resolve, reject) => {
      try {
        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();
        
        // Add HTML content as text
        const { width, height } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        
        // Simple HTML parser (for demo purposes)
        const strippedContent = htmlContent.replace(/<[^>]*>/g, ' ').trim();
        
        // Write text to PDF (wrapping text manually for demo)
        const lines = [];
        let currentLine = '';
        const words = strippedContent.split(' ');
        const maxLineWidth = 80;
        
        for (const word of words) {
          if ((currentLine + word).length < maxLineWidth) {
            currentLine += word + ' ';
          } else {
            lines.push(currentLine);
            currentLine = word + ' ';
          }
        }
        
        if (currentLine) {
          lines.push(currentLine);
        }
        
        // Draw text lines
        lines.forEach((line, index) => {
          page.drawText(line, {
            x: 50,
            y: height - 50 - (index * 20),
            size: 12,
            font
          });
          onProgress((index / lines.length) * 100);
        });
        
        // Save the PDF
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        
        resolve(blob);
      } catch (error) {
        console.error('Error converting HTML to PDF:', error);
        reject(error);
      }
    });
  }
  
  /**
   * Convert Excel to PDF
   */
  static async excelToPdf(file: File, onProgress: (progress: number) => void) {
    return new Promise<Blob>(async (resolve, reject) => {
      try {
        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();
        
        // Add file name as text
        const { width, height } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        
        page.drawText(`Converted from Excel: ${file.name}`, {
          x: 50,
          y: height - 50,
          size: 12,
          font
        });
        
        page.drawText('This is a simulated Excel to PDF conversion.', {
          x: 50,
          y: height - 80,
          size: 12,
          font
        });
        
        // Draw a simple table
        const cellWidth = 100;
        const cellHeight = 30;
        const startX = 50;
        const startY = height - 150;
        
        // Draw table headers
        ['A', 'B', 'C', 'D'].forEach((header, i) => {
          // Draw header cell
          page.drawRectangle({
            x: startX + (i * cellWidth),
            y: startY,
            width: cellWidth,
            height: cellHeight,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
          });
          
          // Draw header text
          page.drawText(header, {
            x: startX + (i * cellWidth) + 45,
            y: startY + 10,
            size: 12,
            font
          });
        });
        
        // Draw data rows
        for (let row = 0; row < 5; row++) {
          for (let col = 0; col < 4; col++) {
            // Draw cell
            page.drawRectangle({
              x: startX + (col * cellWidth),
              y: startY - ((row + 1) * cellHeight),
              width: cellWidth,
              height: cellHeight,
              borderColor: rgb(0, 0, 0),
              borderWidth: 1,
            });
            
            // Draw cell content
            page.drawText(`${row+1},${col+1}`, {
              x: startX + (col * cellWidth) + 40,
              y: startY - ((row + 1) * cellHeight) + 10,
              size: 12,
              font
            });
          }
          
          // Update progress
          onProgress((row / 5) * 100);
        }
        
        // Save the PDF
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        
        resolve(blob);
      } catch (error) {
        console.error('Error converting Excel to PDF:', error);
        reject(error);
      }
    });
  }

  /**
   * Edit PDF by adding text
   */
  static async editPdf(file: File, edits: {text: string, x: number, y: number, page: number}[], onProgress: (progress: number) => void) {
    return new Promise<Blob>(async (resolve, reject) => {
      try {
        // Read the PDF file
        const arrayBuffer = await file.arrayBuffer();
        
        // Load the PDF document
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const pages = pdfDoc.getPages();
        
        // Apply edits
        edits.forEach((edit, index) => {
          if (edit.page >= 0 && edit.page < pages.length) {
            const page = pages[edit.page];
            page.drawText(edit.text, {
              x: edit.x,
              y: edit.y,
              size: 12,
              font
            });
          }
          
          // Update progress
          onProgress(((index + 1) / edits.length) * 100);
        });
        
        // Save the PDF
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        
        resolve(blob);
      } catch (error) {
        console.error('Error editing PDF:', error);
        reject(error);
      }
    });
  }

  /**
   * Organize PDF pages
   */
  static async organizePdf(file: File, pageOrder: number[], onProgress: (progress: number) => void) {
    return new Promise<Blob>(async (resolve, reject) => {
      try {
        // Read the PDF file
        const arrayBuffer = await file.arrayBuffer();
        
        // Load the PDF document
        const srcPdf = await PDFDocument.load(arrayBuffer);
        const newPdf = await PDFDocument.create();
        
        // Copy pages in the specified order
        for (let i = 0; i < pageOrder.length; i++) {
          const pageIndex = pageOrder[i];
          if (pageIndex >= 0 && pageIndex < srcPdf.getPageCount()) {
            const [page] = await newPdf.copyPages(srcPdf, [pageIndex]);
            newPdf.addPage(page);
          }
          
          // Update progress
          onProgress(((i + 1) / pageOrder.length) * 100);
        }
        
        // Save the PDF
        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        
        resolve(blob);
      } catch (error) {
        console.error('Error organizing PDF:', error);
        reject(error);
      }
    });
  }
  
  /**
   * Merge multiple PDFs into one
   */
  static async mergePdfs(files: File[], onProgress: (progress: number) => void) {
    return new Promise<Blob>(async (resolve, reject) => {
      try {
        // Create a new PDF document
        const mergedPdf = await PDFDocument.create();
        const totalFiles = files.length;
        
        // Process each PDF file
        for (let i = 0; i < totalFiles; i++) {
          const file = files[i];
          const fileBuffer = await file.arrayBuffer();
          
          // Load the PDF document
          const pdf = await PDFDocument.load(fileBuffer);
          const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          
          // Add each page to the new document
          for (const page of pages) {
            mergedPdf.addPage(page);
          }
          
          // Update progress
          onProgress((i + 1) / totalFiles * 100);
        }
        
        // Save the merged PDF
        const mergedPdfBytes = await mergedPdf.save();
        const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
        
        resolve(blob);
      } catch (error) {
        console.error('Error merging PDFs:', error);
        reject(error);
      }
    });
  }
  
  /**
   * Convert PDF to JPG images
   */
  static async pdfToJpg(file: File, onProgress: (progress: number) => void) {
    return new Promise<Blob[]>(async (resolve, reject) => {
      try {
        // Read the PDF file
        const arrayBuffer = await file.arrayBuffer();
        
        // Load the PDF document
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const totalPages = pdf.numPages;
        const jpgBlobs: Blob[] = [];
        const scale = 1.5; // Adjust scale for better quality
        
        // Process each page
        for (let i = 1; i <= totalPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale });
          
          // Create a canvas to render the page
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          
          if (!context) {
            throw new Error("Could not get canvas context");
          }
          
          // Render the page content
          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise;
          
          // Convert canvas to JPG blob
          const jpgBlob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((blob) => {
              resolve(blob || new Blob());
            }, 'image/jpeg', 0.8);
          });
          
          jpgBlobs.push(jpgBlob);
          
          // Update progress
          onProgress(i / totalPages * 100);
        }
        
        resolve(jpgBlobs);
      } catch (error) {
        console.error('Error converting PDF to JPG:', error);
        reject(error);
      }
    });
  }
  
  /**
   * Convert JPG images to PDF
   */
  static async jpgToPdf(files: File[], onProgress: (progress: number) => void) {
    return new Promise<Blob>(async (resolve, reject) => {
      try {
        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();
        const totalFiles = files.length;
        
        // Process each image file
        for (let i = 0; i < totalFiles; i++) {
          const file = files[i];
          const fileBuffer = await file.arrayBuffer();
          
          // Create an image from the file data
          try {
            // Try to embed the image (supports JPG, PNG)
            let image;
            if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
              image = await pdfDoc.embedJpg(fileBuffer);
            } else if (file.type === 'image/png') {
              image = await pdfDoc.embedPng(fileBuffer);
            } else {
              throw new Error(`Unsupported image format: ${file.type}`);
            }
            
            // Add a page with the image dimensions
            const page = pdfDoc.addPage([image.width, image.height]);
            
            // Draw the image on the page
            page.drawImage(image, {
              x: 0,
              y: 0,
              width: image.width,
              height: image.height
            });
          } catch (err) {
            console.error(`Error processing image ${file.name}:`, err);
          }
          
          // Update progress
          onProgress((i + 1) / totalFiles * 100);
        }
        
        // Save the PDF
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        
        resolve(blob);
      } catch (error) {
        console.error('Error converting JPG to PDF:', error);
        reject(error);
      }
    });
  }
  
  /**
   * Split PDF into separate files per page
   */
  static async splitPdf(file: File, onProgress: (progress: number) => void) {
    return new Promise<Blob[]>(async (resolve, reject) => {
      try {
        // Read the PDF file
        const arrayBuffer = await file.arrayBuffer();
        
        // Load the PDF document
        const srcPdf = await PDFDocument.load(arrayBuffer);
        const totalPages = srcPdf.getPageCount();
        const pdfBlobs: Blob[] = [];
        
        // Process each page
        for (let i = 0; i < totalPages; i++) {
          // Create a new PDF document for each page
          const newPdf = await PDFDocument.create();
          
          // Copy the page from the source PDF
          const [page] = await newPdf.copyPages(srcPdf, [i]);
          newPdf.addPage(page);
          
          // Save the single-page PDF
          const pdfBytes = await newPdf.save();
          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          
          pdfBlobs.push(blob);
          
          // Update progress
          onProgress((i + 1) / totalPages * 100);
        }
        
        resolve(pdfBlobs);
      } catch (error) {
        console.error('Error splitting PDF:', error);
        reject(error);
      }
    });
  }
  
  /**
   * Compress PDF file
   */
  static async compressPdf(file: File, onProgress: (progress: number) => void) {
    return new Promise<Blob>(async (resolve, reject) => {
      try {
        // Read the PDF file
        const arrayBuffer = await file.arrayBuffer();
        
        // Load the PDF document
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        
        // Update progress during loading
        onProgress(50);
        
        // Save with compression (PDF-lib applies some compression by default)
        const pdfBytes = await pdfDoc.save();
        
        // Update progress when saving
        onProgress(100);
        
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        resolve(blob);
      } catch (error) {
        console.error('Error compressing PDF:', error);
        reject(error);
      }
    });
  }
  
  /**
   * Convert PDF tables to Excel
   * Note: This is a simplified implementation that extracts text and formats it as CSV
   */
  static async pdfToExcel(file: File, onProgress: (progress: number) => void) {
    return new Promise<Blob>(async (resolve, reject) => {
      try {
        // Read the PDF file
        const arrayBuffer = await file.arrayBuffer();
        
        // Load the PDF document
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const totalPages = pdf.numPages;
        
        // CSV content to be built
        let csvContent = '';
        
        // Process each page
        for (let i = 1; i <= totalPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          
          // Group text items by their y-position to form rows
          const rows: { [key: number]: string[] } = {};
          textContent.items.forEach((item: any) => {
            // Round the y-position to group nearby text on the same line
            const yPos = Math.round(item.transform[5]);
            if (!rows[yPos]) {
              rows[yPos] = [];
            }
            rows[yPos].push(item.str);
          });
          
          // Sort by y-position (from top to bottom)
          const sortedYPositions = Object.keys(rows).map(Number).sort((a, b) => b - a);
          
          // Create CSV rows
          sortedYPositions.forEach((yPos) => {
            // Join cell values and add to CSV
            csvContent += rows[yPos].join(',') + '\n';
          });
          
          // Add page separator
          csvContent += '\n';
          
          // Update progress
          onProgress(i / totalPages * 100);
        }
        
        // Create blob with CSV data
        const blob = new Blob([csvContent], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
        
        resolve(blob);
      } catch (error) {
        console.error('Error converting PDF to Excel:', error);
        reject(error);
      }
    });
  }
  
  /**
   * Add password protection to PDF
   */
  static async protectPdf(file: File, password: string, onProgress: (progress: number) => void) {
    return new Promise<Blob>(async (resolve, reject) => {
      try {
        // Read the PDF file
        const arrayBuffer = await file.arrayBuffer();
        
        // Update progress
        onProgress(30);
        
        // Load the PDF document
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        
        // Update progress
        onProgress(60);
        
        // Encrypt with password - fixed the parameter format
        pdfDoc.encrypt({
          password,
          permissions: {
            printing: 'highResolution',
            modifying: false,
            copying: false,
            annotating: false,
            fillingForms: true,
            contentAccessibility: true,
            documentAssembly: false
          }
        });
        
        // Save the protected PDF
        const pdfBytes = await pdfDoc.save();
        
        // Update progress
        onProgress(100);
        
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        resolve(blob);
      } catch (error) {
        console.error('Error protecting PDF:', error);
        reject(error);
      }
    });
  }

  /**
   * Unlock a password-protected PDF
   */
  static async unlockPdf(file: File, password: string, onProgress: (progress: number) => void) {
    return new Promise<Blob>(async (resolve, reject) => {
      try {
        // Read the PDF file
        const arrayBuffer = await file.arrayBuffer();
        
        // Update progress
        onProgress(30);
        
        // Load the PDF document with password
        const pdfDoc = await PDFDocument.load(arrayBuffer, { password });
        
        // Update progress
        onProgress(60);
        
        // Create a new document without encryption
        const pdfBytes = await pdfDoc.save({ updateMetadata: false });
        
        // Update progress
        onProgress(100);
        
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        resolve(blob);
      } catch (error) {
        console.error('Error unlocking PDF:', error);
        reject(error);
      }
    });
  }

  /**
   * Add watermark to PDF
   */
  static async watermarkPdf(file: File, watermarkText: string, onProgress: (progress: number) => void) {
    return new Promise<Blob>(async (resolve, reject) => {
      try {
        // Read the PDF file
        const arrayBuffer = await file.arrayBuffer();
        
        // Load the PDF document
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const pages = pdfDoc.getPages();
        
        // Process each page to add watermark
        pages.forEach((page, index) => {
          const { width, height } = page.getSize();
          
          // Draw watermark diagonally across page
          page.drawText(watermarkText, {
            x: width / 2 - 150,
            y: height / 2,
            size: 60,
            font,
            opacity: 0.3,
            rotate: Math.PI / 6,
            color: rgb(0.5, 0.5, 0.5)
          });
          
          // Update progress
          onProgress((index + 1) / pages.length * 100);
        });
        
        // Save the watermarked PDF
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        
        resolve(blob);
      } catch (error) {
        console.error('Error watermarking PDF:', error);
        reject(error);
      }
    });
  }

  /**
   * Rotate PDF pages
   */
  static async rotatePdf(file: File, rotation: number, pages: number[], onProgress: (progress: number) => void) {
    return new Promise<Blob>(async (resolve, reject) => {
      try {
        // Read the PDF file
        const arrayBuffer = await file.arrayBuffer();
        
        // Load the PDF document
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pdfPages = pdfDoc.getPages();
        
        // Apply rotation to specified pages (or all if not specified)
        const pagesToRotate = pages.length > 0 ? pages : pdfPages.map((_, i) => i);
        
        pagesToRotate.forEach((pageIndex, index) => {
          if (pageIndex >= 0 && pageIndex < pdfPages.length) {
            const page = pdfPages[pageIndex];
            const currentRotation = page.getRotation().angle;
            page.setRotation({ angle: (currentRotation + rotation) % 360 });
          }
          
          // Update progress
          onProgress((index + 1) / pagesToRotate.length * 100);
        });
        
        // Save the rotated PDF
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        
        resolve(blob);
      } catch (error) {
        console.error('Error rotating PDF:', error);
        reject(error);
      }
    });
  }

  /**
   * OCR PDF (simulate - in a real app would use Tesseract.js or similar)
   */
  static async ocrPdf(file: File, onProgress: (progress: number) => void) {
    return new Promise<Blob>(async (resolve, reject) => {
      try {
        // Read the PDF file
        const arrayBuffer = await file.arrayBuffer();
        
        // Load the PDF document
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const pages = pdfDoc.getPages();
        
        // Simulate OCR by adding a note to each page (in real app, would extract text via OCR)
        pages.forEach((page, index) => {
          const { width, height } = page.getSize();
          
          // Add OCR processed note
          page.drawText("[OCR PROCESSED]", {
            x: 5,
            y: 5,
            size: 8,
            font,
            color: rgb(0, 0.5, 0)
          });
          
          // Update progress
          onProgress((index + 1) / pages.length * 100);
        });
        
        // Save the OCR-processed PDF
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        
        resolve(blob);
      } catch (error) {
        console.error('Error performing OCR on PDF:', error);
        reject(error);
      }
    });
  }
  
  /**
   * Download a blob as a file
   */
  static downloadBlob(blob: Blob, fileName: string) {
    FileSaver.saveAs(blob, fileName);
  }
  
  /**
   * Download multiple blobs as files
   */
  static downloadBlobs(blobs: Blob[], fileNamePrefix: string) {
    blobs.forEach((blob, index) => {
      const fileName = `${fileNamePrefix}_${index + 1}.${blob.type.split('/')[1]}`;
      FileSaver.saveAs(blob, fileName);
    });
  }
}

/**
 * Simulate file progress for demo purposes
 */
export const simulateFileProcessing = async (
  onProgress: (progress: number) => void,
  onComplete: (blob: Blob) => void,
  processingTime = 3000,
  fileType = 'application/pdf'
) => {
  return new Promise<void>((resolve) => {
    const totalSteps = 20;
    const stepTime = processingTime / totalSteps;
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      onProgress(currentStep / totalSteps * 100);
      
      if (currentStep >= totalSteps) {
        clearInterval(interval);
        
        // Create a simple blob as output
        const content = 'Simulated file processing complete.';
        const blob = new Blob([content], { type: fileType });
        
        onComplete(blob);
        resolve();
      }
    }, stepTime);
  });
};
