import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userUuid = searchParams.get('user_uuid');
    
    if (!userUuid) {
      return NextResponse.json(
        { error: 'user_uuid parameter is required' },
        { status: 400 }
      );
    }
    
    console.log('Récupération des vraies données Bridge pour l\'utilisateur:', userUuid);
    
    // Récupérer les items (connexions bancaires) via Bridge API
    const response = await fetch(`https://api.bridgeapi.io/v3/aggregation/users/${userUuid}/items`, {
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
      console.error('Erreur lors de la récupération des items:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      return NextResponse.json(
        { 
          error: `Erreur de récupération des items: ${response.status} - ${response.statusText}`,
          details: errorText
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Vraies données Bridge récupérées avec succès:', { count: data.data?.length || 0 });
    
    return NextResponse.json({
      success: true,
      data: data.data || data
    });

  } catch (error) {
    console.error('Error fetching Bridge data:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 