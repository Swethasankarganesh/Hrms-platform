import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const maxDuration = 30;

// Google Gemini has a free tier (no credit card). Get a key at
// https://aistudio.google.com/apikey and set GEMINI_API_KEY (or
// GOOGLE_GENERATIVE_AI_API_KEY) in your environment / Vercel project.
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

interface HrContext {
  employeeCount: number;
  activeEmployees: number;
  departments: string[];
  presentToday: number;
  onLeaveToday: number;
  pendingLeaves: number;
  avgScore: number;
  payrollStatus: string;
}

function buildSystemPrompt(ctx: HrContext): string {
  return `You are PeopleFlow AI, an intelligent HR assistant embedded in PeopleFlow — an AI-powered HRMS platform.

## Live Workspace Data (as of today)
- Total employees: ${ctx.employeeCount} (${ctx.activeEmployees} active, ${ctx.onLeaveToday} on leave)
- Departments: ${ctx.departments.join(", ")}
- Present today: ${ctx.presentToday} / ${ctx.employeeCount} employees
- Pending leave requests: ${ctx.pendingLeaves}
- Average performance score: ${ctx.avgScore}%
- Payroll status: ${ctx.payrollStatus}

## Your role
- Answer HR questions using the live data above as ground truth
- Provide specific, actionable recommendations — not generic advice
- When you spot risks (low scores, attendance issues, leave backlogs), flag them clearly
- Keep responses concise and structured (use bullet points for lists)
- Always ground insights in the numbers provided

## Tone
Professional but approachable. You are a trusted HR advisor, not a search engine.`;
}

const API_KEY = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY;

function textResponse(text: string, status = 200) {
  return new Response(text, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export async function POST(req: Request) {
  // Surface the most common misconfiguration as a visible message instead of
  // an empty stream.
  if (!API_KEY) {
    return textResponse(
      "AI is not configured: GEMINI_API_KEY is missing on the server. Add it in your Vercel project's Environment Variables and redeploy.",
    );
  }

  const { messages, hrContext } = (await req.json()) as {
    messages: { role: "user" | "assistant"; content: string }[];
    hrContext: HrContext;
  };

  const result = streamText({
    model: google("gemini-2.0-flash"),
    system: buildSystemPrompt(hrContext),
    messages,
    onError: ({ error }) => console.error("AI stream error:", error),
  });

  // Manually pipe so streaming errors (e.g. an invalid key) become visible
  // text in the chat instead of a silent empty response.
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const delta of result.textStream) {
          controller.enqueue(encoder.encode(delta));
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        controller.enqueue(encoder.encode(`\n[AI error: ${message}]`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
