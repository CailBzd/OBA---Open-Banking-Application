import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Tentative de création d\'utilisateur avec le payload:', body);
    
    // Utiliser l'endpoint qui fonctionne
    const endpoint = 'https://api.bridgeapi.io/v3/aggregation/users';
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Bridge-Version': '2025-01-15',
        'Client-Id': process.env.BRIDGE_API_CLIENT_ID || 'sandbox_id_45f51a0f76164ff294ec5a0593130c57',
        'Client-Secret': process.env.BRIDGE_API_CLIENT_SECRET || 'sandbox_secret_DUKj7KhU0R2iDTdq9hkNUdXXS00bq3S7ojllWeShBqXYMlC01gD1TA1IzTBQdouw'
      },
      body: JSON.stringify(body)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Utilisateur créé avec succès:', data);
      
      return NextResponse.json({
        success: true,
        data: data.data || data
      });
    } else {
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

  } catch (error) {
    console.error('Error creating user:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 