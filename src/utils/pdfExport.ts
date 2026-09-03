import jsPDF from 'jspdf';
import { EvaluatedSchemeResult, UserProfile } from '../types';

export function generateEligibilityPdfReport(
  results: EvaluatedSchemeResult[],
  userProfile?: UserProfile,
  overallAdvice?: string
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  let y = margin;

  // Helper to check page break
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
      addHeaderFooter();
    }
  };

  // Header and Footer watermarks
  const addHeaderFooter = () => {
    const pageCount = (doc as any).internal.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('SchemeSense India — Citizen Welfare Eligibility Report', margin, pageHeight - 8);
    doc.text(`Page ${pageCount}`, pageWidth - margin - 10, pageHeight - 8);
  };

  // --- Title & Header Banner ---
  doc.setFillColor(0, 0, 60); // #00003c Deep Navy
  doc.rect(margin, y, contentWidth, 26, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('GOVERNMENT WELFARE ELIGIBILITY REPORT & CHECKLIST', margin + 6, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(253, 224, 71); // Amber yellow accent
  doc.text('Generated via SchemeSense AI • Official Central & State Scheme Finder', margin + 6, y + 18);

  y += 32;

  // --- Report Metadata Box ---
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 22, 3, 3, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text(`Report Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`, margin + 5, y + 8);
  doc.text(`Matched Schemes: ${results.length}`, margin + 85, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  if (userProfile && userProfile.fullName) {
    doc.text(`Applicant Name: ${userProfile.fullName} (${userProfile.state || 'India'})`, margin + 5, y + 15);
  } else {
    doc.text(`Residency State: ${userProfile?.state || 'All India'} | Category: ${userProfile?.socialCategory || 'General'}`, margin + 5, y + 15);
  }
  doc.text(`Family Income: ₹${userProfile?.annualFamilyIncome ? userProfile.annualFamilyIncome.toLocaleString('en-IN') : 'N/A'}/yr`, margin + 85, y + 15);

  y += 28;

  // --- AI Advice Summary ---
  if (overallAdvice) {
    checkPageBreak(25);
    doc.setFillColor(254, 243, 199); // Amber-50
    doc.setDrawColor(245, 158, 11);
    doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'FD');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(120, 53, 15);
    doc.text('AI SUMMARY ADVICE:', margin + 4, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(69, 26, 3);
    const splitAdvice = doc.splitTextToSize(overallAdvice, contentWidth - 8);
    doc.text(splitAdvice.slice(0, 3), margin + 4, y + 12);

    y += 26;
  }

  // --- Master Required Documents Checklist ---
  checkPageBreak(40);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 60);
  doc.text('1. MASTER DOCUMENT CHECKLIST FOR APPLICATIONS', margin, y);
  y += 4;

  // Aggregate unique required documents
  const allRequiredDocs = Array.from(
    new Set(results.flatMap((r) => r.scheme.requiredDocs || []))
  );

  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, Math.max(16, Math.ceil(allRequiredDocs.length / 2) * 6 + 6), 'F');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);

  let docY = y + 6;
  allRequiredDocs.forEach((docItem, index) => {
    const col = index % 2;
    const xPos = margin + 5 + col * (contentWidth / 2);
    if (index > 0 && index % 2 === 0) {
      docY += 6;
    }
    // Draw checkbox
    doc.setDrawColor(100, 116, 139);
    doc.rect(xPos, docY - 3, 3, 3);
    doc.text(docItem, xPos + 5, docY);
  });

  y = docY + 12;

  // --- Schemes Breakdown Table ---
  checkPageBreak(20);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 60);
  doc.text('2. HIGHLY ELIGIBLE CENTRAL & STATE SCHEMES', margin, y);
  y += 6;

  results.forEach((item, index) => {
    const scheme = item.scheme;
    const boxHeight = 44;

    checkPageBreak(boxHeight + 5);

    // Scheme Container Box
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, y, contentWidth, boxHeight, 3, 3, 'FD');

    // Title line
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 60);
    doc.text(`${index + 1}. ${scheme.title}`, margin + 4, y + 7);

    // Match Badge
    doc.setFillColor(16, 185, 129); // Emerald
    doc.rect(margin + contentWidth - 32, y + 3, 28, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5);
    doc.text(`${item.matchScore}% Match`, margin + contentWidth - 29, y + 7);

    // Ministry & Origin
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`${scheme.ministry} • ${scheme.origin === 'central' ? 'Central Union' : scheme.stateName || 'State'}`, margin + 4, y + 13);

    // Financial Benefit Box
    doc.setFillColor(236, 253, 245);
    doc.rect(margin + 4, y + 16, contentWidth - 8, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(6, 78, 59);
    doc.text(`Financial Benefit: ${scheme.benefitValue}`, margin + 7, y + 21.5);

    // Why You Qualify
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('Why You Qualify: ', margin + 4, y + 29);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const whyText = doc.splitTextToSize(item.whyYouQualify || scheme.eligibilityDescription, contentWidth - 35);
    doc.text(whyText[0] || '', margin + 32, y + 29);

    // Portal link & Application steps note
    doc.setFontSize(7.5);
    doc.setTextColor(2, 132, 199);
    doc.text(`Official Portal: ${scheme.officialWebsiteUrl}`, margin + 4, y + 36);

    doc.setTextColor(100, 116, 139);
    doc.text(`Required Docs: ${scheme.requiredDocs.slice(0, 4).join(', ')}`, margin + 4, y + 40);

    y += boxHeight + 6;
  });

  addHeaderFooter();

  // Save the generated PDF file
  const fileName = `SchemeSense_Eligibility_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
}
