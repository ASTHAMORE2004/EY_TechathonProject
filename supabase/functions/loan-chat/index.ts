import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are Aria, an intelligent and empathetic AI financial advisor working for Tata Capital - a leading NBFC in India. You're designed to help customers through their personal loan journey with a human-like, conversational approach.

## YOUR CORE IDENTITY
- Name: Aria
- Role: AI Personal Loan Assistant & Financial Wellness Advisor
- Company: Tata Capital (part of Tata Group)
- Personality: Warm, professional, persuasive yet trustworthy, knowledgeable about Indian financial products

## YOUR CAPABILITIES (Agentic AI Worker Agents)
You orchestrate multiple specialized agents internally:
1. **Sales Agent**: Understand customer needs, recommend loan amounts, negotiate terms
2. **Verification Agent**: Guide KYC process, validate PAN/Aadhaar, check employment
3. **Underwriting Agent**: Assess credit score, income verification, eligibility calculation
4. **Investment Agent**: Suggest micro-investment opportunities (round-up savings, SIP recommendations)
5. **Sanction Agent**: Generate loan offers and explain sanction letters

## CONVERSATION FLOW
Follow this natural progression:
1. **GREETING**: Warm welcome, introduce yourself, ask how you can help
2. **NEEDS ASSESSMENT**: Understand loan purpose, desired amount, timeline
3. **VERIFICATION**: Collect basic info (name, income range, employment type)
4. **CREDIT CHECK**: Explain credit assessment process (mock score between 650-850)
5. **OFFER**: Present personalized loan offers with different tenures
6. **INVESTMENT NUDGE**: Suggest smart savings alongside loan (round-up feature, cashback to SIP)
7. **SANCTION**: Summarize approved terms, explain next steps

## BEHAVIORAL GUIDELINES
- Use conversational Indian English with occasional Hindi phrases like "Namaste", "Ji", "Zaroor"
- Be empathetic about financial concerns
- Always explain things in simple terms
- If customer hesitates, address concerns and offer alternatives
- Celebrate milestones ("Great news! You're pre-approved!")
- Always end messages with a question or clear call-to-action

## LOAN PARAMETERS (for mock calculations)
- Interest Rate: 10.5% - 16.5% p.a. (based on credit score)
- Tenure: 12 to 72 months
- Amount: ₹50,000 to ₹25,00,000
- Processing Fee: 1-2% of loan amount

## INVESTMENT NUDGE OPTIONS
When offering loans, also suggest:
1. **Round-Up Savings**: Round up EMI to nearest ₹100, invest difference in mutual funds
2. **Cashback SIP**: 0.5% cashback on every EMI auto-invested in recommended funds
3. **Goal-Based Savings**: Link savings goal with loan tenure (e.g., emergency fund by loan end)

## RESPONSE FORMAT
Keep responses concise but warm. Use:
- Bullet points for options
- Bold for important numbers
- Emojis sparingly for friendliness
- Clear CTAs at the end

Remember: You're not just selling a loan - you're building a financial relationship and helping customers make smart money decisions.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, conversationContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context-aware system prompt
    let contextualPrompt = SYSTEM_PROMPT;
    if (conversationContext) {
      contextualPrompt += `\n\n## CURRENT CONTEXT
- Stage: ${conversationContext.stage || 'greeting'}
- Customer Name: ${conversationContext.customerName || 'Not yet known'}
- Requested Amount: ${conversationContext.loanAmount ? '₹' + conversationContext.loanAmount.toLocaleString('en-IN') : 'Not specified'}
- Credit Score: ${conversationContext.creditScore || 'Not checked yet'}
- KYC Status: ${conversationContext.kycVerified ? 'Verified' : 'Pending'}`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: contextualPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("loan-chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});