import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Get the lead data from the request
    const {
      leadData,
      scoringResult
    } = data;
    
    // Extract needed values for the PDF with safe fallbacks
    const score = scoringResult?.score || "N/A";
    const status = (scoringResult?.status || "unknown").toUpperCase();
    const probability = scoringResult?.probability ? `${(scoringResult.probability * 100).toFixed(2)}%` : "N/A";
    const dataset = scoringResult?.dataset_type || "bank";
    const leadName = leadData?.name || "Anonymous Lead";
    const currentDate = new Date().toLocaleDateString();
    
    // Handle error case
    const hasError = Boolean(scoringResult?.error);
    const errorMsg = scoringResult?.error || "";
    
    // Determine which model data to show based on dataset type
    const isBankDataset = dataset === "bank";
    
    // Create a simpler but valid PDF with properly encoded content
    const pdfContent = `%PDF-1.4
1 0 obj
<</Type/Catalog/Pages 2 0 R>>
endobj
2 0 obj
<</Type/Pages/Kids[3 0 R]/Count 1>>
endobj
3 0 obj
<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Resources<</Font<</F1<</Type/Font/Subtype/Type1/BaseFont/Helvetica-Bold>>>><</F2<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>>>>>>/Contents 4 0 R>>
endobj
4 0 obj
<</Length 2000>>
stream
BT
/F1 20 Tf
50 750 Td
(LeadGenius AI Lead Scoring Report) Tj

/F2 11 Tf
0 -30 Td
(Lead: ${leadName}) Tj

/F2 12 Tf
0 -25 Td
/F1 14 Tf
(Lead Score: ${score}) Tj

/F2 12 Tf
0 -20 Td
(Status: ${status}) Tj
0 -20 Td
(Probability: ${probability}) Tj
0 -20 Td
(Dataset: ${dataset.toUpperCase()}) Tj

${hasError ? `
/F2 11 Tf
0 -30 Td
(Note: This score was generated with the default model because:) Tj
0 -20 Td
(${errorMsg.replace(/\\/g, "\\\\")}) Tj
` : ''}

/F1 14 Tf
0 -40 Td
(Lead Information:) Tj

/F2 12 Tf
${isBankDataset ? `
0 -20 Td
(Age: ${leadData?.age || "N/A"}) Tj
0 -20 Td
(Job: ${leadData?.job || "N/A"}) Tj
0 -20 Td
(Education: ${leadData?.education || "N/A"}) Tj
0 -20 Td
(Marital: ${leadData?.marital || "N/A"}) Tj
0 -20 Td
(Contact: ${leadData?.contact || "N/A"}) Tj
0 -20 Td
(Campaign: ${leadData?.campaign || "N/A"}) Tj
` : `
0 -20 Td
(Company: ${leadData?.company || "N/A"}) Tj
0 -20 Td
(Email: ${leadData?.email || "N/A"}) Tj
0 -20 Td
(Phone: ${leadData?.phone || "N/A"}) Tj
0 -20 Td
(Source: ${leadData?.source || "N/A"}) Tj
`}

${isBankDataset ? `
/F1 14 Tf
0 -30 Td
(Economic Indicators:) Tj

/F2 12 Tf
0 -20 Td
(Employment Variation Rate: ${leadData?.emp_var_rate || "N/A"}) Tj
0 -20 Td
(Consumer Price Index: ${leadData?.cons_price_idx || "N/A"}) Tj
0 -20 Td
(Consumer Confidence Index: ${leadData?.cons_conf_idx || "N/A"}) Tj
0 -20 Td
(Euribor 3 Month Rate: ${leadData?.euribor3m || "N/A"}) Tj
0 -20 Td
(Number of Employees: ${leadData?.nr_employed || "N/A"}) Tj
` : `
/F1 14 Tf
0 -30 Td
(BANT Assessment:) Tj

/F2 12 Tf
0 -20 Td
(Budget: ${leadData?.budget ? (leadData.budget * 10).toFixed(1) + "/10" : "N/A"}) Tj
0 -20 Td
(Authority: ${leadData?.authority ? (leadData.authority * 10).toFixed(1) + "/10" : "N/A"}) Tj
0 -20 Td
(Need: ${leadData?.need ? (leadData.need * 10).toFixed(1) + "/10" : "N/A"}) Tj
0 -20 Td
(Timeframe: ${leadData?.timeframe ? (leadData.timeframe * 10).toFixed(1) + "/10" : "N/A"}) Tj
0 -20 Td
(Engagement Level: ${leadData?.engagement_level ? (leadData.engagement_level * 10).toFixed(1) + "/10" : "N/A"}) Tj
`}

/F1 14 Tf
0 -40 Td
(Recommendation:) Tj

/F2 12 Tf
0 -25 Td
(${getRecommendation(scoringResult?.status || "", dataset)}) Tj

/F2 10 Tf
0 -50 Td
(Generated on: ${currentDate}) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000053 00000 n 
0000000102 00000 n 
0000000248 00000 n 
trailer
<</Size 5/Root 1 0 R>>
startxref
2300
%%EOF`;
    
    // Convert to buffer
    const buffer = Buffer.from(pdfContent);
    
    // Return the PDF with proper content type
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=LeadGenius_${leadName.replace(/\s+/g, '_')}_${currentDate.replace(/\//g, '-')}.pdf`
      }
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({
      error: 'Failed to generate PDF',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// Helper function to generate recommendation text
function getRecommendation(status: string, dataset: string): string {
  const isBank = dataset === "bank";
  
  switch (status.toLowerCase()) {
    case 'hot':
      return isBank 
        ? "This lead shows high potential for conversion. Prioritize immediate follow-up with a personalized approach offering tailored banking solutions."
        : "This lead shows high potential for conversion. Schedule a demo and send a customized proposal within 24 hours.";
    case 'warm':
      return isBank
        ? "This lead shows moderate potential. Follow up within 2-3 days with additional information about banking services relevant to their profile."
        : "This lead shows moderate potential. Send case studies and nurture with targeted content addressing their specific needs.";
    case 'cold':
      return isBank
        ? "This lead shows lower potential for conversion. Consider nurturing via email campaigns about relevant financial products and reassess after engagement."
        : "This lead shows lower potential for conversion. Add to nurture campaign with educational content and re-evaluate in 30 days.";
    default:
      return "Unable to provide a recommendation. Please review the lead data and score manually.";
  }
} 