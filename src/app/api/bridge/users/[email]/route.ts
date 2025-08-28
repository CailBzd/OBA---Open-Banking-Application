import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { email: string } }
) {
  try {
    const email = decodeURIComponent(params.email);
    console.log('Récupération de l\'utilisateur existant avec l\'ID externe:', email);
    
    // Récupérer l'utilisateur existant via Bridge API
    // Bridge API v3 retourne l'utilisateur existant si l'external_user_id existe déjà
    const response = await fetch('https://api.bridgeapi.io/v3/aggregation/users', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Bridge-Version': '2025-01-15',
        'Client-Id': process.env.BRIDGE_API_CLIENT_ID || 'sandbox_id_45f51a0f76164ff294ec5a0593130c57',
        'Client-Secret': process.env.BRIDGE_API_CLIENT_SECRET || 'sandbox_secret_DUKj7KhU0R2iDTdq9hkNUdXXS00bq3S7ojllWeShBqXYMlC01gD1TA1IzTBQdouw'
      },
      body: JSON.stringify({
        external_user_id: email
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur lors de la récupération de l\'utilisateur:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      return NextResponse.json(
        { 
          error: `Erreur utilisateur: ${response.status} - ${response.statusText}`,
          details: errorText
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Utilisateur existant récupéré avec succès:', data);
    
    return NextResponse.json({
      success: true,
      data: data.data || data
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 