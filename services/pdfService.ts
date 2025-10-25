import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportElementAsPDF = async (element: HTMLElement, fileName: string, title: string) => {
  if (!element) {
    console.error('Element to export not found.');
    return;
  }

  // To improve image quality, we can increase the scale.
  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: '#1f2937', // A dark background similar to the app's
    useCORS: true, 
    onclone: (document) => {
        // Ensure dark mode styles are applied for rendering
        document.querySelectorAll('.recharts-surface').forEach(svg => {
            (svg as HTMLElement).style.backgroundColor = 'transparent';
        });
        document.querySelectorAll('.recharts-text, .recharts-cartesian-axis-tick-value, text').forEach(textElement => {
            (textElement as HTMLElement).style.fill = '#cbd5e1'; // Use a light gray for text
        });
        document.querySelectorAll('[stroke="#9ca3af"]').forEach(el => {
            (el as HTMLElement).setAttribute('stroke', '#cbd5e1');
        });
    }
  });

  const imgData = canvas.toDataURL('image/png');
  
  const pdf = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4'
  });
  
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const ratio = canvasWidth / canvasHeight;

  let imgWidth = pdfWidth - 20; // with margin
  let imgHeight = imgWidth / ratio;

  if (imgHeight > pdfHeight - 40) { // check if it fits, with margins
      imgHeight = pdfHeight - 40;
      imgWidth = imgHeight * ratio;
  }
  
  const x = (pdfWidth - imgWidth) / 2;
  const y = 20;

  pdf.setFontSize(16);
  pdf.setTextColor('#111827');
  pdf.text(title, pdfWidth / 2, 15, { align: 'center' });

  pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
  pdf.save(`${fileName}.pdf`);
};
