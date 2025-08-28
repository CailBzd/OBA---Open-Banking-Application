import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header manquant ou invalide' },
        { status: 401 }
      );
    }

    const accessToken = authHeader.replace('Bearer ', '');
    
    console.log('🔑 Token TrueLayer reçu:', accessToken.substring(0, 20) + '...');

    // Appel à l'API TrueLayer pour récupérer les comptes
    const response = await fetch('https://api.truelayer.com/data/v1/accounts', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur API TrueLayer:', response.status, errorText);
      
      return NextResponse.json(
        { error: `Erreur API TrueLayer: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const accounts = await response.json();
    console.log(`✅ ${accounts.results?.length || 0} comptes récupérés de TrueLayer`);
    
    return NextResponse.json(accounts.results || []);

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des comptes:', error);
    
    return NextResponse.json(
      { error: 'Erreur interne du serveur', details: error instanceof Error ? error.message : 'Erreur inconnue' },
      { status: 500 }
    );
  }
} 