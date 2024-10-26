import { NextResponse } from 'next/server';

interface GitHubError {
  message: string;
  documentation_url?: string;
}

export async function POST(request: Request) {
  try {
    // Validate request body
    if (!request.body) {
      return NextResponse.json({ 
        message: 'Request body is required' 
      }, { status: 400 });
    }

    const { path, token } = await request.json();

    // Validate path parameter
    if (!path) {
      return NextResponse.json({ 
        message: 'GitHub API path is required' 
      }, { status: 400 });
    }
    
    // Use provided token or fall back to environment token
    const authToken = token || process.env.GITHUB_TOKEN;
    
    if (!authToken) {
      return NextResponse.json({ 
        message: 'GitHub token not provided. Required for private repositories.',
        type: 'TOKEN_MISSING'
      }, { status: 401 });
    }

    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'doc-ocr-ai',
      'Authorization': `Bearer ${authToken}`
    };

    try {
      const response = await fetch(`https://api.github.com${path}`, { 
        headers,
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      if (!response.ok) {
        const error = await response.json() as GitHubError;
        
        // Enhanced error handling with specific messages
        switch (response.status) {
          case 401:
            return NextResponse.json({ 
              message: 'Invalid GitHub token or unauthorized access',
              type: 'UNAUTHORIZED',
              details: error.message,
              docs: error.documentation_url
            }, { status: 401 });
          
          case 403:
            return NextResponse.json({ 
              message: 'API rate limit exceeded or forbidden access',
              type: 'FORBIDDEN',
              details: error.message,
              docs: error.documentation_url,
              isRateLimit: error.message.includes('rate limit')
            }, { status: 403 });
          
          case 404:
            return NextResponse.json({ 
              message: 'Repository not found or private. Please check the URL or provide a valid token',
              type: 'NOT_FOUND',
              details: error.message,
              docs: error.documentation_url
            }, { status: 404 });
          
          case 422:
            return NextResponse.json({ 
              message: 'Invalid request parameters',
              type: 'VALIDATION_FAILED',
              details: error.message,
              docs: error.documentation_url
            }, { status: 422 });

          default:
            return NextResponse.json({
              message: 'GitHub API error',
              type: 'API_ERROR',
              details: error.message,
              docs: error.documentation_url
            }, { status: response.status });
        }
      }

      const data = await response.json();
      return NextResponse.json(data);
      
    } catch (fetchError:any) {
      // Handle network-specific errors
      if (fetchError.name === 'TimeoutError') {
        return NextResponse.json({ 
          message: 'GitHub API request timed out',
          type: 'TIMEOUT'
        }, { status: 504 });
      }
      
      if (fetchError.name === 'AbortError') {
        return NextResponse.json({ 
          message: 'Request was aborted',
          type: 'ABORTED'
        }, { status: 499 });
      }

      throw fetchError; // Re-throw other errors to be caught by outer try-catch
    }
    
  } catch (error:any) {
    console.error('GitHub API error:', error);
    
    return NextResponse.json({ 
      message: 'Internal server error',
      type: 'INTERNAL_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
