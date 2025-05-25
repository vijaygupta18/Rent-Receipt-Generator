const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// Add event listeners for live preview
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('input', updateLivePreview);
        input.addEventListener('change', updateLivePreview);
    });
    
    // Set current year as default
    document.getElementById('startYear').value = new Date().getFullYear();
    updateLivePreview();
});

function updateLivePreview() {
    const tenantName = document.getElementById('tenantName').value || '[Tenant Name]';
    const landlordName = document.getElementById('landlordName').value || '[Landlord Name]';
    const rentAmount = document.getElementById('rentAmount').value || '[Amount]';
    const currency = document.getElementById('currency').value || '₹';
    const propertyAddress = document.getElementById('propertyAddress').value || '[Property Address]';
    const startMonth = parseInt(document.getElementById('startMonth').value) || 1;
    const startYear = parseInt(document.getElementById('startYear').value) || new Date().getFullYear();
    const numMonths = parseInt(document.getElementById('numMonths').value) || 1;
    const landlordPAN = document.getElementById('landlordPAN').value;

    const receipts = [];
    let currentMonth = startMonth;
    let currentYear = startYear;

    for (let i = 0; i < Math.min(numMonths, 3); i++) { // Show max 3 in preview
        const receipt = generateSingleReceipt(
            i + 1,
            tenantName,
            landlordName,
            rentAmount,
            currency,
            propertyAddress,
            currentMonth,
            currentYear,
            landlordPAN
        );
        receipts.push(receipt);

        currentMonth++;
        if (currentMonth > 12) {
            currentMonth = 1;
            currentYear++;
        }
    }

    showPreview(receipts, numMonths > 3);
}

function generateReceipts() {
    // Get form values
    const tenantName = document.getElementById('tenantName').value;
    const landlordName = document.getElementById('landlordName').value;
    const rentAmount = document.getElementById('rentAmount').value;
    const currency = document.getElementById('currency').value;
    const propertyAddress = document.getElementById('propertyAddress').value;
    const startMonth = parseInt(document.getElementById('startMonth').value);
    const startYear = parseInt(document.getElementById('startYear').value);
    const numMonths = parseInt(document.getElementById('numMonths').value);
    const landlordPAN = document.getElementById('landlordPAN').value;

    // Validate required fields
    if (!tenantName || !landlordName || !rentAmount || !propertyAddress || !startMonth || !startYear || !numMonths) {
        alert('Please fill in all required fields.');
        return;
    }

    // Generate receipts
    const receipts = [];
    let currentMonth = startMonth;
    let currentYear = startYear;

    for (let i = 0; i < numMonths; i++) {
        const receipt = generateSingleReceipt(
            i + 1,
            tenantName,
            landlordName,
            rentAmount,
            currency,
            propertyAddress,
            currentMonth,
            currentYear,
            landlordPAN
        );
        receipts.push(receipt);

        // Move to next month
        currentMonth++;
        if (currentMonth > 12) {
            currentMonth = 1;
            currentYear++;
        }
    }

    // Generate PDF
    generatePDF(receipts);
}

function generateSingleReceipt(receiptNo, tenantName, landlordName, rentAmount, currency, propertyAddress, month, year, landlordPAN) {
    const monthName = monthNames[month - 1];
    const receiptDate = new Date(year, month, 1); // First day of next month
    const startDate = new Date(year, month - 1, 1); // First day of current month
    const endDate = new Date(year, month, 0); // Last day of current month

    const formatDate = (date) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    };

    let receipt = `RENT RECEIPT ${monthName} ${year}

Receipt No: ${receiptNo}
Date: ${formatDate(receiptDate)}
Received sum of INR Rs. ${rentAmount} from ${tenantName} towards the rent of 
property located at ${propertyAddress} for the period from ${formatDate(startDate)} to ${formatDate(endDate)}.

${landlordName} (Landlord)`;

    if (landlordPAN) {
        receipt += `\nPan: ${landlordPAN}`;
    } else {
        receipt += `\n\nPan:`;
    }

    return receipt;
}

function showPreview(receipts, hasMore = false) {
    const previewContent = document.getElementById('previewContent');
    
    previewContent.innerHTML = '';
    receipts.forEach((receipt, index) => {
        const receiptDiv = document.createElement('div');
        receiptDiv.className = 'receipt-preview';
        receiptDiv.textContent = receipt;
        previewContent.appendChild(receiptDiv);
    });

    if (hasMore) {
        const moreDiv = document.createElement('div');
        moreDiv.style.cssText = 'text-align: center; color: #666; font-style: italic; padding: 20px;';
        moreDiv.textContent = `... and ${receipts.length > 0 ? 'more' : 'additional'} receipts will be generated`;
        previewContent.appendChild(moreDiv);
    }
}

function generatePDF(receipts) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const lineHeight = 7;
    const multiplePerPage = document.getElementById('multiplePerPage').checked;
    const receiptsPerPage = parseInt(document.getElementById('receiptsPerPage').value);
    
    let yPosition = margin;
    let currentReceiptOnPage = 0;

    receipts.forEach((receipt, index) => {
        const lines = receipt.split('\n');
        const receiptHeight = (lines.length * lineHeight) + 30; // Extra space for receipt
        const separatorHeight = currentReceiptOnPage > 0 ? 25 : 0; // Space for separator
        const totalHeightNeeded = receiptHeight + separatorHeight;

        // Check if we need a new page
        if (multiplePerPage) {
            // Check if receipt fits on current page or if we've reached max receipts per page
            if (currentReceiptOnPage >= receiptsPerPage || 
                (yPosition + totalHeightNeeded > pageHeight - margin)) {
                doc.addPage();
                yPosition = margin;
                currentReceiptOnPage = 0;
            }
        } else {
            // One receipt per page
            if (index > 0) {
                doc.addPage();
                yPosition = margin;
            }
        }

        // Add separator line between receipts on same page
        if (multiplePerPage && currentReceiptOnPage > 0) {
            yPosition += 10;
            doc.setDrawColor(200, 200, 200);
            doc.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 15;
        }

        // Add receipt content
        lines.forEach(line => {
            doc.setFont('courier', 'normal');
            doc.setFontSize(11);
            
            // Handle long lines by wrapping them
            const maxWidth = pageWidth - (2 * margin);
            const splitLines = doc.splitTextToSize(line, maxWidth);
            
            splitLines.forEach(splitLine => {
                // Double check we don't exceed page bounds
                if (yPosition > pageHeight - margin - 10) {
                    doc.addPage();
                    yPosition = margin;
                    currentReceiptOnPage = 0;
                }
                
                doc.text(splitLine, margin, yPosition);
                yPosition += lineHeight;
            });
        });

        currentReceiptOnPage++;
        
        // Add extra space after each receipt
        if (multiplePerPage) {
            yPosition += 20;
        }
    });

    // Save the PDF
    const tenantName = document.getElementById('tenantName').value;
    const startMonth = parseInt(document.getElementById('startMonth').value);
    const startYear = parseInt(document.getElementById('startYear').value);
    const monthName = monthNames[startMonth - 1];
    
    const filename = `Rent_Receipts_${tenantName.replace(/\s+/g, '_')}_${monthName}_${startYear}.pdf`;
    doc.save(filename);
} 