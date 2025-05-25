# 🏠 Rent Receipt Generator

A simple, legally formatted rent receipt generator that works entirely in the browser. Perfect for HRA claims, tax documentation, and official government submissions.

## ✨ Features

- **🌐 Browser-Based**: Works completely client-side, no server required
- **📱 Responsive Design**: Works on desktop, tablet, and mobile devices
- **👀 Live Preview**: See your receipts update in real-time as you type
- **📄 Multiple Layouts**: Choose between single or multiple receipts per page
- **💾 PDF Export**: Generate professional PDF documents using jsPDF
- **🏛️ Government Compliant**: Simple, official format accepted for HRA and tax purposes
- **🔒 Privacy First**: All data stays in your browser, nothing sent to servers

## 🚀 Quick Start

### Option 1: GitHub Pages (Recommended)
1. Fork this repository
2. Go to Settings → Pages
3. Select "Deploy from a branch" → "main"
4. Your generator will be live at `https://yourusername.github.io/rent-receipt-generator`

### Option 2: Local Usage
1. Download the `index.html` file
2. Open it in any modern web browser
3. Start generating receipts immediately!

## 📋 How to Use

### Step 1: Fill in the Details
- **Tenant Name**: Name of the person paying rent
- **Landlord Name**: Name of the property owner
- **Rent Amount**: Monthly rent amount (numbers only)
- **Currency Symbol**: Default is ₹ (Indian Rupee)
- **Property Address**: Full address of the rental property
- **Start Month & Year**: When the rent period begins
- **Number of Months**: How many consecutive months (1-12)
- **Landlord PAN**: Optional PAN number for tax purposes

### Step 2: Choose PDF Layout
- **Single Receipt Per Page**: Traditional format (default)
- **Multiple Receipts Per Page**: Space-efficient option
  - 2 receipts per page
  - 3 receipts per page

### Step 3: Generate PDF
- Click "Generate Rent Receipts PDF"
- PDF will automatically download with a descriptive filename
- Example: `Rent_Receipts_John_Doe_January_2024.pdf`

## 📄 Receipt Format

Each receipt follows this legally compliant format:

```
RENT RECEIPT January 2024

Receipt No: 1
Date: Feb 1, 2024
Received sum of INR Rs. 25000 from John Doe towards the rent of property located at
123 Main Street, Apartment 4B, New Delhi, 110001
for the period from Jan 1, 2024 to Jan 31, 2024.
Jane Smith (Landlord)
Pan: ABCDE1234F
```

## 🛠️ Technical Details

### Built With
- **HTML5**: Structure and form handling
- **CSS3**: Responsive design and styling
- **Vanilla JavaScript**: Logic and interactivity
- **jsPDF**: Client-side PDF generation

### Browser Compatibility
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

### File Structure
```
rent-receipt-generator/
├── index.html          # Main application file
├── README.md           # This documentation
└── LICENSE            # MIT License (optional)
```

## 🎯 Key Features Explained

### Live Preview
- Updates automatically as you type
- Shows up to 3 receipts in preview
- Indicates when more receipts will be generated
- Helps you verify information before generating PDF

### Smart PDF Layout
- **Automatic Page Breaks**: Prevents receipts from being split across pages
- **Height Calculation**: Measures each receipt to ensure proper fit
- **Separator Lines**: Clean dividers between multiple receipts
- **Text Wrapping**: Long addresses wrap properly within margins

### Multiple Receipts Per Page
- **Space Efficient**: Reduce paper usage
- **Professional Separators**: Clear visual division between receipts
- **Flexible Options**: Choose 2 or 3 receipts per page
- **Smart Pagination**: Automatically creates new pages when needed

## 📱 Mobile Responsiveness

The generator automatically adapts to different screen sizes:
- **Desktop**: Side-by-side form and preview
- **Tablet**: Stacked layout with full-width components
- **Mobile**: Single-column layout optimized for touch

## 🔐 Privacy & Security

- **No Data Collection**: All information stays in your browser
- **No Server Communication**: Completely client-side application
- **No Storage**: Data is not saved unless you explicitly download the PDF
- **Open Source**: Full transparency of code and functionality

## 🎨 Customization

### Modifying the Receipt Format
To change the receipt format, edit the `generateSingleReceipt` function in `index.html`:

```javascript
function generateSingleReceipt(receiptNo, tenantName, landlordName, ...) {
    // Modify the receipt template here
    let receipt = `RENT RECEIPT ${monthName} ${year}
    
Receipt No: ${receiptNo}
// ... rest of the format
`;
    return receipt;
}
```

### Styling Changes
Modify the CSS section in the `<style>` tag to customize:
- Colors and fonts
- Layout and spacing
- Form styling
- Preview appearance

## 🐛 Troubleshooting

### PDF Not Downloading
- Ensure pop-ups are not blocked
- Try a different browser
- Check if JavaScript is enabled

### Preview Not Updating
- Refresh the page
- Clear browser cache
- Ensure all required fields are filled

### Layout Issues on Mobile
- Try rotating device to landscape
- Zoom out if content appears cut off
- Use desktop version for complex layouts

## 📞 Support

If you encounter any issues:
1. Check the browser console for error messages
2. Ensure you're using a supported browser
3. Try refreshing the page
4. Clear browser cache and cookies

## 🤝 Contributing

Contributions are welcome! To contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **jsPDF**: For excellent client-side PDF generation
- **Community**: For feedback and feature suggestions
- **Contributors**: For improvements and bug fixes

---

**Made with ❤️ for hassle-free rent receipt generation**

*Perfect for landlords, tenants, and anyone needing official rent documentation for HRA claims and tax purposes.* 