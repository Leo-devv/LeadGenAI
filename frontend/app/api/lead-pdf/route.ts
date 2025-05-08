import { NextResponse } from 'next/server';

// Helper function to get recommendation text based on lead score
function getRecommendedActions(status: string, dataset_type: string): string[] {
  if (status === 'hot') {
    if (dataset_type === 'bank') {
      return [
        "Schedule a personal call within 24 hours",
        "Prepare customized banking product proposal",
        "Offer an in-person meeting with financial advisor",
        "Send personalized email with premium offers"
      ];
    } else {
      return [
        "Schedule a product demo within 48 hours",
        "Prepare customized pricing proposal",
        "Connect lead with sales executive",
        "Send detailed case studies relevant to their industry"
      ];
    }
  } else if (status === 'warm') {
    if (dataset_type === 'bank') {
      return [
        "Contact within 3-5 days via phone",
        "Email relevant banking product information",
        "Add to medium-priority follow-up queue",
        "Send educational content about financial services"
      ];
    } else {
      return [
        "Contact within one week via email",
        "Send targeted content addressing their needs",
        "Add to nurture campaign for mid-stage leads",
        "Schedule follow-up call in 7-10 days"
      ];
    }
  } else {
    if (dataset_type === 'bank') {
      return [
        "Add to automated email nurture campaign",
        "Schedule follow-up in 3-4 weeks",
        "Send general information about services",
        "Monitor engagement with marketing materials"
      ];
    } else {
      return [
        "Add to educational content nurture sequence",
        "Monitor engagement with marketing assets",
        "Re-evaluate in 30 days based on activity",
        "Send industry-relevant thought leadership content"
      ];
    }
  }
}

// Helper to generate engagement strategy text
function getEngagementStrategy(status: string, dataset_type: string): string {
  if (status === 'hot') {
    return dataset_type === 'bank'
      ? "Direct personal engagement from senior account manager with authority to offer preferred rates and terms. Focus on immediate conversion with premium service guarantees."
      : "High-touch sales approach with executive sponsorship. Emphasize how your solution addresses their specific pain points with custom implementation timeline.";
  } else if (status === 'warm') {
    return dataset_type === 'bank'
      ? "Balanced approach with both educational content and product information. Provide case studies relevant to their financial situation and follow up with relationship manager."
      : "Nurture with valuable content while gradually introducing product benefits. Use case studies and social proof to build confidence in your solution.";
  } else {
    return dataset_type === 'bank'
      ? "Long-term nurture strategy with focus on financial education and brand awareness. Monitor for life events that may change their needs and adjust approach accordingly."
      : "Educational approach focused on thought leadership and industry trends. Position your brand as a trusted advisor while monitoring for changes in engagement that indicate increased interest.";
  }
}

export async function POST(request: Request) {
  try {
    const { leadData, scoringResult } = await request.json();
    
    // Get recommendations based on score
    const recommendedActions = getRecommendedActions(scoringResult.status, scoringResult.dataset_type || 'bank');
    const engagementStrategy = getEngagementStrategy(scoringResult.status, scoringResult.dataset_type || 'bank');
    
    // Generate current date and formatted lead name for report 
    const currentDate = new Date().toLocaleDateString();
    const leadName = leadData.name || "Anonymous Lead";
    
    // Set status color classes
    const statusColorClass = 
      scoringResult.status === 'hot' ? 'hot' :
      scoringResult.status === 'warm' ? 'warm' : 'cold';
    
    // Create a more comprehensive HTML report
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>LeadGenius AI Score Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f9fafb;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: #fff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .header {
            background-color: #4f46e5;
            color: white;
            padding: 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          .header p {
            margin: 5px 0 0;
            opacity: 0.9;
          }
          .content {
            padding: 20px;
          }
          .section {
            margin-bottom: 25px;
          }
          .section-title {
            color: #1e293b;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 8px;
            margin-top: 0;
            margin-bottom: 15px;
            font-size: 18px;
            font-weight: 600;
          }
          .score-card {
            background-color: #f3f4f6;
            border-radius: 5px;
            padding: 20px;
            margin: 15px 0;
            text-align: center;
          }
          .score-value {
            font-size: 40px;
            font-weight: bold;
            color: #4f46e5;
            margin: 10px 0;
          }
          .score-label {
            text-transform: uppercase;
            font-size: 12px;
            letter-spacing: 1px;
            color: #6b7280;
          }
          .probability-bar {
            height: 10px;
            width: 100%;
            background-color: #e5e7eb;
            border-radius: 5px;
            margin: 10px 0;
            overflow: hidden;
          }
          .probability-fill {
            height: 100%;
            background-color: #4f46e5;
          }
          .status {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 12px;
            margin-top: 10px;
          }
          .hot {
            background-color: #fee2e2;
            color: #ef4444;
          }
          .warm {
            background-color: #ffedd5;
            color: #f97316;
          }
          .cold {
            background-color: #dbeafe;
            color: #3b82f6;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
          }
          th {
            background-color: #f3f4f6;
            font-weight: 600;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            padding: 15px;
            border-top: 1px solid #e5e7eb;
          }
          .action-items {
            padding: 0;
          }
          .action-items li {
            margin-bottom: 10px;
            padding-left: 25px;
            position: relative;
          }
          .action-items li:before {
            content: "";
            position: absolute;
            left: 0;
            top: 6px;
            width: 12px;
            height: 12px;
            background-color: #4f46e5;
            border-radius: 50%;
          }
          .engagement-strategy {
            background-color: #f3f4f6;
            padding: 15px;
            border-left: 4px solid #4f46e5;
            margin: 20px 0;
          }
          .metric-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 20px;
          }
          .metric-box {
            background-color: #f3f4f6;
            padding: 12px;
            border-radius: 5px;
          }
          .metric-label {
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .metric-value {
            font-size: 18px;
            font-weight: 600;
            color: #1e293b;
            margin-top: 5px;
          }
          @media print {
            body {
              background-color: white;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .container {
              box-shadow: none;
              max-width: 100%;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>LeadGenius AI Lead Score Report</h1>
            <p>Generated on ${currentDate} for ${leadName}</p>
          </div>
          
          <div class="content">
            <div class="section">
              <div class="score-card">
                <div class="score-label">Lead Score</div>
                <div class="score-value">${scoringResult.score}/100</div>
                <div class="probability-bar">
                  <div class="probability-fill" style="width: ${scoringResult.probability * 100}%"></div>
                </div>
                <div>Conversion Probability: ${(scoringResult.probability * 100).toFixed(1)}%</div>
                <div class="status ${statusColorClass}">
                  ${scoringResult.status.toUpperCase()}
                </div>
                <div style="margin-top: 10px; font-size: 13px;">
                  Model: ${scoringResult.dataset_type || 'Bank Marketing'} Dataset
                </div>
              </div>
            </div>
            
            <div class="section">
              <h2 class="section-title">Lead Profile</h2>
              <table>
                <tr>
                  <th>Field</th>
                  <th>Value</th>
                </tr>
                ${Object.entries(leadData)
                  .filter(([key]) => {
                    // Filter out technical fields and focus on main lead attributes
                    const excludeKeys = ['dataset_type', 'model_type'];
                    const economicIndicators = ['emp_var_rate', 'cons_price_idx', 'cons_conf_idx', 'euribor3m', 'nr_employed'];
                    const dotIndicators = ['emp.var.rate', 'cons.price.idx', 'cons.conf.idx', 'nr.employed'];
                    
                    return !excludeKeys.includes(key) && 
                           !economicIndicators.includes(key) && 
                           !dotIndicators.includes(key);
                  })
                  .map(([key, value]) => `
                    <tr>
                      <td>${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</td>
                      <td>${value}</td>
                    </tr>
                  `).join('')}
              </table>
              
              ${(leadData.dataset_type === 'bank' || scoringResult.dataset_type === 'bank') ? `
              <h3 style="margin-top: 20px; font-size: 16px;">Economic Indicators</h3>
              <table>
                <tr>
                  <th>Indicator</th>
                  <th>Value</th>
                </tr>
                <tr>
                  <td>Employment Variation Rate</td>
                  <td>${leadData.emp_var_rate || leadData['emp.var.rate'] || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Consumer Price Index</td>
                  <td>${leadData.cons_price_idx || leadData['cons.price.idx'] || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Consumer Confidence Index</td>
                  <td>${leadData.cons_conf_idx || leadData['cons.conf.idx'] || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Euribor 3 Month Rate</td>
                  <td>${leadData.euribor3m || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Number of Employees</td>
                  <td>${leadData.nr_employed || leadData['nr.employed'] || 'N/A'}</td>
                </tr>
              </table>
              ` : `
              <h3 style="margin-top: 20px; font-size: 16px;">BANT Assessment</h3>
              <div class="metric-grid">
                <div class="metric-box">
                  <div class="metric-label">Budget</div>
                  <div class="metric-value">${leadData.budget ? (leadData.budget * 10).toFixed(1) + '/10' : 'N/A'}</div>
                </div>
                <div class="metric-box">
                  <div class="metric-label">Authority</div>
                  <div class="metric-value">${leadData.authority ? (leadData.authority * 10).toFixed(1) + '/10' : 'N/A'}</div>
                </div>
                <div class="metric-box">
                  <div class="metric-label">Need</div>
                  <div class="metric-value">${leadData.need ? (leadData.need * 10).toFixed(1) + '/10' : 'N/A'}</div>
                </div>
                <div class="metric-box">
                  <div class="metric-label">Timeframe</div>
                  <div class="metric-value">${leadData.timeframe ? (leadData.timeframe * 10).toFixed(1) + '/10' : 'N/A'}</div>
                </div>
              </div>
              <h3 style="margin-top: 20px; font-size: 16px;">Engagement Metrics</h3>
              <div class="metric-grid">
                <div class="metric-box">
                  <div class="metric-label">Engagement Level</div>
                  <div class="metric-value">${leadData.engagement_level ? (leadData.engagement_level * 10).toFixed(1) + '/10' : 'N/A'}</div>
                </div>
                <div class="metric-box">
                  <div class="metric-label">Website Visits</div>
                  <div class="metric-value">${leadData.website_visits || 'N/A'}</div>
                </div>
                <div class="metric-box">
                  <div class="metric-label">Time on Site (min)</div>
                  <div class="metric-value">${leadData.time_spent || 'N/A'}</div>
                </div>
                <div class="metric-box">
                  <div class="metric-label">Content Downloads</div>
                  <div class="metric-value">${leadData.content_downloaded || 'N/A'}</div>
                </div>
              </div>
              `}
            </div>
            
            <div class="section">
              <h2 class="section-title">Recommended Action Plan</h2>
              <ul class="action-items">
                ${recommendedActions.map(action => `<li>${action}</li>`).join('')}
              </ul>
              
              <h3 style="margin-top: 20px; font-size: 16px;">Engagement Strategy</h3>
              <div class="engagement-strategy">
                ${engagementStrategy}
              </div>
            </div>
          </div>
          
          <div class="footer">
            <p>Generated by LeadGenius AI on ${currentDate}</p>
            <p>This report is based on AI predictions and should be used as guidance, not as the sole decision-making factor.</p>
          </div>
          
          <div class="no-print" style="padding: 20px; text-align: center;">
            <button onclick="window.print()" style="padding: 10px 20px; background-color: #4f46e5; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: 600; margin-right: 10px;">
              Print Report
            </button>
            <button onclick="window.close()" style="padding: 10px 20px; background-color: #6b7280; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: 600;">
              Close
            </button>
          </div>
          
          <script>
            // Auto-trigger print dialog when the page loads
            window.onload = function() {
              // Add a small delay to ensure the page is fully rendered
              setTimeout(function() {
                window.print();
              }, 800);
            };
          </script>
        </div>
      </body>
      </html>
    `;
    
    // Return the HTML with the correct content type
    return new Response(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
      }
    });
    
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' }, 
      { status: 500 }
    );
  }
} 