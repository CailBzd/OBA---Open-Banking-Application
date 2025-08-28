import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { accountId: string } }
) {
  try {
    const { accountId } = params;
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header manquant ou invalide' },
        { status: 401 }
      );
    }

    const accessToken = authHeader.replace('Bearer ', '');
    
    console.log(`🔑 Récupération des soldes pour le compte ${accountId}`);

    // Appel à l'API TrueLayer pour récupérer les soldes
    const response = await fetch(`https://api.truelayer.com/data/v1/accounts/${accountId}/balances`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur API TrueLayer balances:', response.status, errorText);
      
      return NextResponse.json(
        { error: `Erreur API TrueLayer: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const balances = await response.json();
    console.log(`✅ Soldes récupérés pour le compte ${accountId}`);
    
    return NextResponse.json(balances.results || []);

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des soldes:', error);
    
    return NextResponse.json(
      { error: 'Erreur interne du serveur', details: error instanceof Error ? error.message : 'Erreur inconnue' },
      { status: 500 }
    );
  }
} 