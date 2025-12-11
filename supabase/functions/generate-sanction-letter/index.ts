import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { PDFDocument, rgb, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SanctionLetterData {
  customerName: string;
  loanAmount: number;
  interestRate: number;
  tenureMonths: number;
  emiAmount: number;
  purpose: string;
  creditScore: number;
  applicationId: string;
}

async function generatePDF(data: SanctionLetterData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const { width, height } = page.getSize();
  
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  const primaryColor = rgb(0.0, 0.25, 0.53); // Tata Capital blue
  const goldColor = rgb(0.85, 0.65, 0.13);
  
  // Header with company branding
  page.drawRectangle({
    x: 0,
    y: height - 100,
    width: width,
    height: 100,
    color: primaryColor,
  });
  
  page.drawText("TATA CAPITAL", {
    x: 50,
    y: height - 50,
    size: 28,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });
  
  page.drawText("Personal Loan Division", {
    x: 50,
    y: height - 75,
    size: 12,
    font: helvetica,
    color: rgb(0.9, 0.9, 0.9),
  });
  
  // Gold accent line
  page.drawRectangle({
    x: 0,
    y: height - 105,
    width: width,
    height: 5,
    color: goldColor,
  });
  
  // Document Title
  page.drawText("LOAN SANCTION LETTER", {
    x: 170,
    y: height - 150,
    size: 20,
    font: helveticaBold,
    color: primaryColor,
  });
  
  // Reference & Date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-IN', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  });
  const refNo = `TC/PL/${today.getFullYear()}/${data.applicationId.slice(0, 8).toUpperCase()}`;
  
  page.drawText(`Reference No: ${refNo}`, {
    x: 50,
    y: height - 190,
    size: 10,
    font: helvetica,
    color: rgb(0.3, 0.3, 0.3),
  });
  
  page.drawText(`Date: ${formattedDate}`, {
    x: 430,
    y: height - 190,
    size: 10,
    font: helvetica,
    color: rgb(0.3, 0.3, 0.3),
  });
  
  // Recipient
  page.drawText(`Dear ${data.customerName},`, {
    x: 50,
    y: height - 230,
    size: 12,
    font: helveticaBold,
    color: rgb(0, 0, 0),
  });
  
  // Greeting
  const greeting = "Congratulations! We are pleased to inform you that your Personal Loan application has been approved. Please find below the details of your sanctioned loan:";
  
  // Word wrap for greeting
  const words = greeting.split(' ');
  let line = '';
  let y = height - 260;
  for (const word of words) {
    const testLine = line + word + ' ';
    if (testLine.length > 85) {
      page.drawText(line, { x: 50, y, size: 11, font: helvetica, color: rgb(0.2, 0.2, 0.2) });
      line = word + ' ';
      y -= 18;
    } else {
      line = testLine;
    }
  }
  page.drawText(line, { x: 50, y, size: 11, font: helvetica, color: rgb(0.2, 0.2, 0.2) });
  
  // Loan Details Box
  const boxY = height - 380;
  page.drawRectangle({
    x: 40,
    y: boxY,
    width: width - 80,
    height: 180,
    borderColor: primaryColor,
    borderWidth: 2,
    color: rgb(0.97, 0.97, 1),
  });
  
  page.drawText("LOAN DETAILS", {
    x: 230,
    y: boxY + 155,
    size: 14,
    font: helveticaBold,
    color: primaryColor,
  });
  
  // Loan details content - Using "Rs." instead of rupee symbol for PDF compatibility
  const details = [
    ["Loan Amount", `Rs. ${data.loanAmount.toLocaleString('en-IN')}`],
    ["Interest Rate", `${data.interestRate}% per annum`],
    ["Loan Tenure", `${data.tenureMonths} months`],
    ["Monthly EMI", `Rs. ${data.emiAmount.toLocaleString('en-IN')}`],
    ["Loan Purpose", data.purpose || "Personal Use"],
    ["Credit Score", `${data.creditScore} (${data.creditScore >= 750 ? 'Excellent' : data.creditScore >= 700 ? 'Good' : 'Fair'})`],
  ];
  
  let detailY = boxY + 120;
  for (const [label, value] of details) {
    page.drawText(`${label}:`, {
      x: 60,
      y: detailY,
      size: 11,
      font: helveticaBold,
      color: rgb(0.3, 0.3, 0.3),
    });
    page.drawText(value, {
      x: 220,
      y: detailY,
      size: 11,
      font: helvetica,
      color: rgb(0, 0, 0),
    });
    detailY -= 20;
  }
  
  // Terms and Conditions
  page.drawText("Terms & Conditions:", {
    x: 50,
    y: boxY - 30,
    size: 12,
    font: helveticaBold,
    color: primaryColor,
  });
  
  const terms = [
    "1. This sanction is valid for 30 days from the date of this letter.",
    "2. Disbursement is subject to completion of KYC verification.",
    "3. Processing fee of 1% of loan amount is applicable.",
    "4. EMI date will be set as per your preference during agreement signing.",
    "5. Prepayment/foreclosure charges may apply as per RBI guidelines.",
  ];
  
  let termY = boxY - 55;
  for (const term of terms) {
    page.drawText(term, {
      x: 50,
      y: termY,
      size: 9,
      font: helvetica,
      color: rgb(0.3, 0.3, 0.3),
    });
    termY -= 15;
  }
  
  // Investment Nudge Section
  page.drawRectangle({
    x: 40,
    y: termY - 60,
    width: width - 80,
    height: 50,
    color: rgb(1, 0.98, 0.9),
    borderColor: goldColor,
    borderWidth: 1,
  });
  
  page.drawText("Smart Savings Tip:", {
    x: 55,
    y: termY - 25,
    size: 10,
    font: helveticaBold,
    color: rgb(0.6, 0.4, 0),
  });
  
  page.drawText("Round up your EMI to the nearest Rs. 100 and invest the difference in mutual funds for long-term wealth creation!", {
    x: 55,
    y: termY - 45,
    size: 9,
    font: helvetica,
    color: rgb(0.4, 0.3, 0),
  });
  
  // Footer
  page.drawText("For any queries, please contact us at:", {
    x: 50,
    y: 100,
    size: 10,
    font: helvetica,
    color: rgb(0.3, 0.3, 0.3),
  });
  
  page.drawText("📞 1800-267-8282  |  📧 customercare@tatacapital.com  |  🌐 www.tatacapital.com", {
    x: 50,
    y: 80,
    size: 9,
    font: helvetica,
    color: primaryColor,
  });
  
  page.drawRectangle({
    x: 0,
    y: 0,
    width: width,
    height: 40,
    color: primaryColor,
  });
  
  page.drawText("Tata Capital Financial Services Ltd. | CIN: U65990MH2010PLC210201", {
    x: 120,
    y: 15,
    size: 8,
    font: helvetica,
    color: rgb(1, 1, 1),
  });
  
  return await pdfDoc.save();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: SanctionLetterData = await req.json();
    console.log("Generating sanction letter for:", data.customerName);
    
    // Validate required fields
    if (!data.customerName || !data.loanAmount || !data.applicationId) {
      throw new Error("Missing required fields: customerName, loanAmount, or applicationId");
    }
    
    // Generate PDF
    const pdfBytes = await generatePDF(data);
    console.log("PDF generated, size:", pdfBytes.length);
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Upload to storage
    const fileName = `sanction_${data.applicationId}_${Date.now()}.pdf`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("sanction-letters")
      .upload(fileName, pdfBytes, {
        contentType: "application/pdf",
        upsert: true,
      });
    
    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error(`Failed to upload PDF: ${uploadError.message}`);
    }
    
    console.log("PDF uploaded successfully:", fileName);
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from("sanction-letters")
      .getPublicUrl(fileName);
    
    const publicUrl = urlData.publicUrl;
    console.log("Public URL:", publicUrl);
    
    // Update loan application with sanction letter URL
    const { error: updateError } = await supabase
      .from("loan_applications")
      .update({ 
        sanction_letter_url: publicUrl,
        status: "sanctioned"
      })
      .eq("id", data.applicationId);
    
    if (updateError) {
      console.error("Update error:", updateError);
      // Don't throw - PDF was generated successfully
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        url: publicUrl,
        fileName 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error generating sanction letter:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});