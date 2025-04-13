
import { PDFDocument, StandardFonts } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { Document, Packer, Paragraph, TextRun, SectionType } from 'docx';
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
        
        // Add all paragraphs to the document sections using the proper API
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
