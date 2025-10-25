import * as XLSX from 'xlsx';

// --- CSV/Text Utilities ---

const convertToCSV = (data: any[], headers?: string[]): string => {
    if (!data || data.length === 0) {
        return '';
    }
    const headerKeys = headers || Object.keys(data[0]);
    const headerRow = headerKeys.join(',');
    const rows = data.map(row =>
        headerKeys.map(key => {
            let cell = row[key] === null || row[key] === undefined ? '' : row[key];
            cell = String(cell).replace(/"/g, '""'); // Escape double quotes
            if (String(cell).includes(',')) {
                cell = `"${cell}"`;
            }
            return cell;
        }).join(',')
    );
    return [headerRow, ...rows].join('\n');
};

const downloadFile = (content: string, fileName: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const exportToText = (text: string, fileName: string) => {
    downloadFile(text, fileName, 'text/plain;charset=utf-8;');
};

export const exportToCSV = (sections: {title: string, data: any[]}[], fileName: string) => {
    const content = sections.map(section => {
        const sectionTitle = section.title;
        const csv = convertToCSV(section.data);
        if (!csv) return `${sectionTitle}\n(No data available)`;
        return `${sectionTitle}\n${csv}`;
    }).join('\n\n');
    downloadFile(content, fileName, 'text/csv;charset=utf-8;');
};


// --- Excel Utility ---

export const exportToExcel = (sections: { title: string; data: any[] }[], fileName: string) => {
    const wb = XLSX.utils.book_new();

    sections.forEach(section => {
        if (section.data && section.data.length > 0) {
            // Sanitize sheet name: must be <= 31 chars, no invalid chars like / \ ? * [ ]
            const sheetName = section.title.replace(/[\\/*?[\]]/g, '').substring(0, 31);
            const ws = XLSX.utils.json_to_sheet(section.data);
            XLSX.utils.book_append_sheet(wb, ws, sheetName);
        }
    });

    XLSX.writeFile(wb, `${fileName}.xlsx`);
};
