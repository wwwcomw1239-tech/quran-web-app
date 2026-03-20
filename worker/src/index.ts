/**
 * Cloudflare Worker - Quran Audio Proxy
 * 
 * Endpoints:
 * - GET /cors?url=... → CORS proxy for Archive.org and audio files
 * 
 * This Worker serves as a CORS proxy for the static Next.js app
 */

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

// Handle OPTIONS request
function handleOptions(): Response {
  return new Response(null, { headers: corsHeaders });
}

// JSON response helper
function jsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      ...corsHeaders,
    },
  });
}

// Handle /cors endpoint (general CORS proxy)
async function handleCorsProxy(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('url');
  
  if (!targetUrl) {
    return jsonResponse({ error: 'Missing url parameter' }, 400);
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Noor-Al-Quran-App/1.0',
      },
    });

    const contentType = response.headers.get('Content-Type') || 'application/octet-stream';
    const contentLength = response.headers.get('Content-Length');
    const contentRange = response.headers.get('Content-Range');
    const acceptRanges = response.headers.get('Accept-Ranges');

    const headers: HeadersInit = {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    };

    if (contentLength) headers['Content-Length'] = contentLength;
    if (contentRange) headers['Content-Range'] = contentRange;
    if (acceptRanges) headers['Accept-Ranges'] = acceptRanges;

    return new Response(response.body, { headers });

  } catch (error: any) {
    return jsonResponse({ error: error.message }, 500);
  }
}

// Main request handler
export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle OPTIONS preflight
    if (request.method === 'OPTIONS') {
      return handleOptions();
    }

    // Route requests
    if (path === '/cors') {
      return handleCorsProxy(request);
    }

    // Default response
    return jsonResponse({
      name: 'Noor Al-Quran Proxy',
      version: '3.0.0',
      description: 'CORS proxy for Quran audio streaming',
      endpoints: {
        '/cors?url=': 'GET - General CORS proxy for audio files',
      },
    });
  },
};
