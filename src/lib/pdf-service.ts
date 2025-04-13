
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

// Type for progress callback
type ProgressCallback = (progress: number) => void;

/**
 * Service for handling PDF conversions and operations
 */
export class PDFService {
  /**
   * Convert PDF to Word document
   */
  static async pdfToWord(
    file: File,
    onProgress: ProgressCallback
  ): Promise<Blob> {
    return new Promise(async (resolve, reject) => {
      try {
        // Read the PDF file
        const arrayBuffer = await file.arrayBuffer();
        
        // Load the PDF document
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const totalPages = pdf.numPages;
        
        // Create a new Word document
        const doc = new Document();
        const paragraphs: Paragraph[] = [];
        
        // Process each page
        for (let i = 1; i <= totalPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const text = textContent.items
            .map((item: any) => item.str)
            .join(' ');
          
          paragraphs.push(
            new Paragraph({
              children: [new TextRun(text)],
              spacing: { after: 200 },
            })
          );
          
          // Update progress
          onProgress((i / totalPages) * 100);
        }
        
        // Add all paragraphs to the document
        doc.addSection({ children: paragraphs });
        
        // Generate and return Word document
        const buffer = await Packer.toBuffer(doc);
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
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
  static async wordToPdf(
    file: File,
    onProgress: ProgressCallback
  ): Promise<Blob> {
    return new Promise(async (resolve, reject) => {
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
          font,
        });
        
        page.drawText('This is a simulated Word to PDF conversion.', {
          x: 50,
          y: height - 80,
          size: 12,
          font,
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
  static async mergePdfs(
    files: File[],
    onProgress: ProgressCallback
  ): Promise<Blob> {
    return new Promise(async (resolve, reject) => {
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
          onProgress(((i + 1) / totalFiles) * 100);
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
   * Download a blob as a file
   */
  static downloadBlob(blob: Blob, fileName: string): void {
    saveAs(blob, fileName);
  }
}

/**
 * Simulate file progress for demo purposes
 */
export const simulateFileProcessing = async (
  onProgress: ProgressCallback,
  onComplete: (result: Blob) => void,
  processingTime = 3000,
  fileType = 'application/pdf'
): Promise<void> => {
  return new Promise((resolve) => {
    const totalSteps = 20;
    const stepTime = processingTime / totalSteps;
    
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      onProgress((currentStep / totalSteps) * 100);
      
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
