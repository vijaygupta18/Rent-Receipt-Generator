const MONTHS_LONG  = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/* ---------------------------------------------------------
   Support dialog — ported from system-design-simulator
--------------------------------------------------------- */
const BMC_UPI_ID   = 'vijaygupta1818@ptyes';
const BMC_UPI_NAME = 'Vijay Gupta';
const BMC_TN       = 'vijay.tools support';

function buildUpiIntent(amount) {
    const params = new URLSearchParams({
        pa: BMC_UPI_ID,
        pn: BMC_UPI_NAME,
        cu: 'INR',
        tn: BMC_TN,
    });
    if (amount) params.set('am', String(amount));
    return `upi://pay?${params.toString()}`;
}

function wireSupportDialog() {
    const dialog  = document.getElementById('supportDialog');
    const copyBtn = document.getElementById('supportCopyBtn');
    const amt49   = document.getElementById('amount49');
    const amt99   = document.getElementById('amount99');
    if (!dialog) return;

    if (amt49) amt49.href = buildUpiIntent(49);
    if (amt99) amt99.href = buildUpiIntent(99);

    const open = () => {
        dialog.classList.add('open');
        dialog.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };
    const close = () => {
        dialog.classList.remove('open');
        dialog.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    // Any element with [data-open="support"] opens the dialog.
    document.querySelectorAll('[data-open="support"], #supportFab').forEach(el => {
        el.addEventListener('click', open);
    });

    dialog.addEventListener('click', (e) => {
        if (e.target && e.target.closest && e.target.closest('[data-close]')) close();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && dialog.classList.contains('open')) close();
    });

    if (copyBtn) {
        const icon = document.getElementById('supportCopyIcon');
        const originalIcon = icon ? icon.innerHTML : '';
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(BMC_UPI_ID);
                copyBtn.classList.add('copied');
                if (icon) icon.innerHTML = '<polyline points="20 6 9 17 4 12"/>';
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    if (icon) icon.innerHTML = originalIcon;
                }, 2000);
            } catch {
                toast('Copy failed — long-press to copy manually', 'danger');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    wireSupportDialog();

    // Default year
    document.getElementById('startYear').value = new Date().getFullYear();

    // Live-update listeners
    const inputs = document.querySelectorAll('#receiptForm input, #receiptForm textarea, #receiptForm select');
    inputs.forEach(el => {
        el.addEventListener('input', updateLivePreview);
        el.addEventListener('change', updateLivePreview);
    });

    // Layout mode segmented control → legacy compatibility
    document.querySelectorAll('input[name="layoutMode"]').forEach(radio => {
        radio.addEventListener('change', e => {
            const mode = e.target.value; // 'single' | 'two' | 'three'
            const multi = document.getElementById('multiplePerPage');
            const per   = document.getElementById('receiptsPerPage');
            if (mode === 'single') multi.checked = false;
            else {
                multi.checked = true;
                per.value = mode === 'two' ? '2' : '3';
            }
        });
    });

    // PAN uppercase
    document.getElementById('landlordPAN').addEventListener('input', e => {
        e.target.value = e.target.value.toUpperCase();
    });

    // Download button
    document.getElementById('downloadBtn').addEventListener('click', generateReceipts);

    // Reset handler
    document.getElementById('receiptForm').addEventListener('reset', () => {
        setTimeout(() => {
            document.getElementById('startYear').value = new Date().getFullYear();
            updateLivePreview();
        }, 0);
    });

    updateLivePreview();
});

function formValues() {
    return {
        tenantName:      document.getElementById('tenantName').value.trim(),
        landlordName:    document.getElementById('landlordName').value.trim(),
        rentAmount:      document.getElementById('rentAmount').value,
        currency:        document.getElementById('currency').value.trim() || '₹',
        propertyAddress: document.getElementById('propertyAddress').value.trim(),
        startMonth:      parseInt(document.getElementById('startMonth').value, 10),
        startYear:       parseInt(document.getElementById('startYear').value, 10),
        numMonths:       parseInt(document.getElementById('numMonths').value, 10),
        landlordPAN:     document.getElementById('landlordPAN').value.trim()
    };
}

function updateLivePreview() {
    const v = formValues();
    const container = document.getElementById('previewContent');
    const counterEl = document.getElementById('previewCounter');
    const titleEl   = document.getElementById('previewTitle');

    const hasBasics = v.tenantName || v.landlordName || v.rentAmount || v.propertyAddress;
    if (!hasBasics) {
        container.innerHTML = emptyStateHTML();
        counterEl.textContent = '';
        titleEl.textContent = 'Empty receipt';
        return;
    }

    const total = Number.isFinite(v.numMonths) && v.numMonths > 0 ? v.numMonths : 1;
    const toRender = Math.min(total, 3);

    let month = Number.isFinite(v.startMonth) && v.startMonth >= 1 ? v.startMonth : 1;
    let year  = Number.isFinite(v.startYear) ? v.startYear : new Date().getFullYear();

    container.innerHTML = '';
    for (let i = 0; i < toRender; i++) {
        container.insertAdjacentHTML('beforeend', receiptCardHTML(i + 1, v, month, year));
        month++;
        if (month > 12) { month = 1; year++; }
    }
    if (total > toRender) {
        container.insertAdjacentHTML('beforeend',
            `<p class="preview-more">+ ${total - toRender} more receipt${total - toRender === 1 ? '' : 's'} in the downloaded PDF</p>`);
    }

    counterEl.textContent = `${total} receipt${total === 1 ? '' : 's'}`;
    titleEl.textContent = `${MONTHS_LONG[(v.startMonth || 1) - 1]} ${v.startYear || year} — ${v.tenantName || 'Tenant'}`;
}

function emptyStateHTML() {
    return `
        <div class="preview-empty">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="9" y1="13" x2="15" y2="13"/>
                <line x1="9" y1="17" x2="13" y2="17"/>
            </svg>
            <p>Fill in the form to see your receipt build up here.</p>
        </div>`;
}

function receiptCardHTML(num, v, month, year) {
    const monthLong = MONTHS_LONG[month - 1] || '—';
    const receiptDate = new Date(year, month, 1);
    const startDate   = new Date(year, month - 1, 1);
    const endDate     = new Date(year, month, 0);
    const fmt = d => isNaN(d) ? '—' : `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

    const amount = v.rentAmount ? Number(v.rentAmount).toLocaleString('en-IN') : '—';
    const tenant = escapeHTML(v.tenantName || 'Tenant name');
    const landlord = escapeHTML(v.landlordName || 'Landlord name');
    const address = escapeHTML(v.propertyAddress || 'Property address');
    const pan = v.landlordPAN ? escapeHTML(v.landlordPAN) : '';

    return `
        <article class="receipt-card">
            <header class="receipt-top">
                <div>
                    <h4 class="receipt-heading">Rent Receipt — ${monthLong} ${year || '—'}</h4>
                    <p class="receipt-meta" style="text-align:left;margin-top:4px;">
                        For the period ${fmt(startDate)} &rarr; ${fmt(endDate)}
                    </p>
                </div>
                <div class="receipt-meta">
                    <div><strong>No.</strong> ${String(num).padStart(3, '0')}</div>
                    <div><strong>Issued</strong> ${fmt(receiptDate)}</div>
                </div>
            </header>

            <div class="receipt-body">
                <p class="received">Received</p>
                <p style="margin:6px 0 0;">
                    the sum of <span class="receipt-amount">${escapeHTML(v.currency)}&thinsp;${amount}</span>
                    from <span class="names">${tenant}</span>
                    towards the rent of the property located at
                    <span class="property">${address}</span>
                    for the period <strong>${fmt(startDate)}</strong> to <strong>${fmt(endDate)}</strong>.
                </p>
            </div>

            <footer class="receipt-signature">
                <div class="sig-block">
                    <p class="sig-line">Received by (Landlord)</p>
                    <p class="sig-name">${landlord}</p>
                    ${pan ? `<p class="sig-pan">PAN: ${pan}</p>` : `<p class="sig-pan">PAN: __________________</p>`}
                </div>
            </footer>
        </article>
    `;
}

function escapeHTML(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/* ---------------------------------------------------------
   Toast
--------------------------------------------------------- */
function toast(msg, kind = 'default') {
    const el = document.getElementById('toast');
    el.className = 'toast ' + (kind === 'danger' ? 'danger' : kind === 'success' ? 'success' : '');
    el.innerHTML = iconForKind(kind) + `<span>${escapeHTML(msg)}</span>`;
    void el.offsetWidth;
    el.classList.add('visible');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove('visible'), 2800);
}
function iconForKind(kind) {
    if (kind === 'danger') {
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    }
    if (kind === 'success') {
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
    }
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
}

/* ---------------------------------------------------------
   PDF generation (unchanged logic, better messaging)
--------------------------------------------------------- */
function generateReceipts() {
    const v = formValues();
    const missing = [];
    if (!v.tenantName)      missing.push('tenant name');
    if (!v.landlordName)    missing.push('landlord name');
    if (!v.rentAmount)      missing.push('rent amount');
    if (!v.propertyAddress) missing.push('property address');
    if (!v.startMonth)      missing.push('start month');
    if (!v.startYear)       missing.push('start year');
    if (!v.numMonths)       missing.push('number of months');

    if (missing.length) {
        toast(`Missing: ${missing.join(', ')}`, 'danger');
        return;
    }

    const receipts = [];
    let month = v.startMonth;
    let year  = v.startYear;

    for (let i = 0; i < v.numMonths; i++) {
        receipts.push(generateSingleReceipt(i + 1, v, month, year));
        month++;
        if (month > 12) { month = 1; year++; }
    }

    generatePDF(receipts, v);
    toast('PDF saved to Downloads', 'success');
}

function generateSingleReceipt(num, v, month, year) {
    return { num, month, year, ...v };
}

/* ---------------------------------------------------------
   Number → Indian English words
   25000 → "Twenty Five Thousand Only"
   250000 → "Two Lakh Fifty Thousand Only"
--------------------------------------------------------- */
function numberToIndianWords(num) {
    if (!Number.isFinite(num) || num < 0) return '';
    if (num === 0) return 'Zero Only';

    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
                  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
                  'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const twoDigits = n => {
        if (n < 20) return ones[n];
        const t = Math.floor(n / 10);
        const o = n % 10;
        return o ? tens[t] + ' ' + ones[o] : tens[t];
    };
    const threeDigits = n => {
        const h = Math.floor(n / 100);
        const rest = n % 100;
        let out = '';
        if (h) out += ones[h] + ' Hundred';
        if (rest) out += (h ? ' ' : '') + twoDigits(rest);
        return out;
    };

    let n = Math.floor(num);
    const parts = [];
    const crore = Math.floor(n / 10000000); n %= 10000000;
    const lakh  = Math.floor(n / 100000);   n %= 100000;
    const thou  = Math.floor(n / 1000);     n %= 1000;
    const hun   = n;

    if (crore) parts.push(twoDigits(crore) + ' Crore');
    if (lakh)  parts.push(twoDigits(lakh) + ' Lakh');
    if (thou)  parts.push(twoDigits(thou) + ' Thousand');
    if (hun)   parts.push(threeDigits(hun));

    return parts.join(' ').trim() + ' Only';
}

/* ---------------------------------------------------------
   PDF layout: one properly-designed receipt per slot
--------------------------------------------------------- */
function generatePDF(receipts, v) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });

    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const pageMargin = 16;

    const multiPerPage = document.getElementById('multiplePerPage').checked;
    const per = multiPerPage ? parseInt(document.getElementById('receiptsPerPage').value, 10) : 1;

    // Receipt dimensions are FIXED — same across 1, 2, and 3-per-page modes.
    // Size is calibrated so 3 receipts + gaps fit exactly on one A4 page.
    const RECEIPT_W = pageW - pageMargin * 2;  // 178mm
    const RECEIPT_H = 85;                       // 85mm — standard rent receipt height
    const GAP = 6;

    const usableH = pageH - pageMargin * 2;
    const totalH = RECEIPT_H * per + GAP * (per - 1);
    const topOffset = pageMargin + (usableH - totalH) / 2; // vertically centered on page

    receipts.forEach((r, idx) => {
        const onPage = idx % per;
        if (idx > 0 && onPage === 0) doc.addPage();
        const slotY = topOffset + onPage * (RECEIPT_H + GAP);
        drawReceipt(doc, r, pageMargin, slotY, RECEIPT_W, RECEIPT_H);
    });

    const monthName = MONTHS_LONG[v.startMonth - 1] || 'Receipts';
    const safeName = (v.tenantName || 'tenant').replace(/[^a-z0-9]+/gi, '_');
    doc.save(`Rent_Receipts_${safeName}_${monthName}_${v.startYear || ''}.pdf`);
}

// Legal Indian rent receipt — plain black-and-white, standard format as
// accepted for HRA claims under the Income Tax Act and by courts under the
// Indian Stamp Act. No colors, no decorative elements.
function drawReceipt(doc, r, x, y, W, H) {
    const monthLong = MONTHS_LONG[r.month - 1] || '';
    const issueDate = new Date(r.year, r.month, 1);
    const startDate = new Date(r.year, r.month - 1, 1);
    const endDate   = new Date(r.year, r.month, 0);
    const fmt = d => isNaN(d) ? '__________' : `${String(d.getDate()).padStart(2, '0')}/${MONTHS_SHORT[d.getMonth()]}/${d.getFullYear()}`;

    const amount = Number(r.rentAmount) || 0;
    const amountFmt = amount.toLocaleString('en-IN');
    const amountWords = numberToIndianWords(amount);

    // Reset to black & white
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(0, 0, 0);

    // Outer border (rectangle, no rounding)
    doc.setLineWidth(0.4);
    doc.rect(x, y, W, H);

    const pad = 6;

    // ────────── Title ──────────
    let cy = y + 7;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('RENT RECEIPT', x + W / 2, cy, { align: 'center' });

    cy += 2;
    doc.setLineWidth(0.3);
    doc.line(x + pad, cy, x + W - pad, cy);

    // ────────── Meta row: Receipt No | Date ──────────
    cy += 5.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);

    doc.setFont('helvetica', 'bold');
    doc.text('Receipt No.:', x + pad, cy);
    doc.setFont('helvetica', 'normal');
    doc.text(String(r.num).padStart(3, '0'), x + pad + 22, cy);

    doc.setFont('helvetica', 'bold');
    doc.text('Date:', x + W - pad - 36, cy);
    doc.setFont('helvetica', 'normal');
    doc.text(fmt(issueDate), x + W - pad - 26, cy);

    // ────────── Body: standard legal paragraph ──────────
    cy += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    const tenant   = r.tenantName    || '__________';
    const landlord = r.landlordName  || '__________';
    const address  = r.propertyAddress || '__________';

    const para =
        `Received a sum of Rs. ${amountFmt}/- (Rupees ${amountWords}) from Mr./Ms. ${tenant}, ` +
        `as rent for the month of ${monthLong} ${r.year}, in respect of the property situated at ` +
        `${address}.`;

    const innerW = W - pad * 2;
    const paraLines = doc.splitTextToSize(para, innerW);
    paraLines.forEach(line => {
        doc.text(line, x + pad, cy);
        cy += 4.6;
    });

    // ────────── Period line (explicit) ──────────
    cy += 2;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.text(`Period: ${fmt(startDate)} to ${fmt(endDate)}`, x + pad, cy);

    // ────────── Signature block ──────────
    const footerY = y + H - 26;

    // Signature block (right)
    const sigW = 68;
    const sigX = x + W - pad - sigW;
    let sy = footerY;

    doc.setLineWidth(0.3);
    doc.line(sigX, sy + 6, sigX + sigW, sy + 6);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('(Landlord’s Signature)', sigX + sigW / 2, sy + 10, { align: 'center' });

    sy += 13;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(landlord, sigX + sigW / 2, sy + 4, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    const panText = r.landlordPAN ? `PAN: ${r.landlordPAN}` : 'PAN: __________________';
    doc.text(panText, sigX + sigW / 2, sy + 8.5, { align: 'center' });
}
