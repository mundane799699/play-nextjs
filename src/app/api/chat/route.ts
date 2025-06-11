import { NextResponse } from 'next/server';

// Hardcode the API key temporarily for testing
const API_KEY = 'sk-5541239aecd84baf8bb20c2432836dd6';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Request body:', body);  // Debug log

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        ...body,
        stream: true
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Deepseek API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      return NextResponse.json({ 
        error: `Deepseek API error: ${response.status} ${response.statusText}`,
        details: errorText 
      }, { status: response.status });
    }

    // Forward the streaming response
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
              break;
            }

            const chunk = decoder.decode(value);
            controller.enqueue(encoder.encode(chunk));
          }
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
