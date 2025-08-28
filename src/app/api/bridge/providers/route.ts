import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const countryCode = searchParams.get('country_code') || 'FR';
    const limit = searchParams.get('limit') || '500';

    const url = `https://api.bridgeapi.io/v3/providers?country_code=${countryCode}&limit=${limit}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Bridge-Version': '2025-01-15',
        'Client-Id': process.env.BRIDGE_API_CLIENT_ID || 'sandbox_id_45f51a0f76164ff294ec5a0593130c57',
        'Client-Secret': process.env.BRIDGE_API_CLIENT_SECRET || 'sandbox_secret_DUKj7KhU0R2iDTdq9hkNUdXXS00bq3S7ojllWeShBqXYMlC01gD1TA1IzTBQdouw'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Bridge API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      return NextResponse.json(
        { 
          error: `Bridge API Error: ${response.status} - ${response.statusText}`,
          details: errorText
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: data.data || data.resources || data || []
    });

  } catch (error) {
    console.error('Error fetching providers:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 