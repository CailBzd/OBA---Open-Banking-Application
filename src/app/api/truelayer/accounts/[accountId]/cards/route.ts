import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ accountId: string }> }
) {
  try {
    const { accountId } = await params;
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header manquant ou invalide' },
        { status: 401 }
      );
    }

    const accessToken = authHeader.replace('Bearer ', '');
    
    console.log(`🔑 Récupération des cartes pour le compte ${accountId}`);

    // Appel à l'API TrueLayer pour récupérer les cartes
    const response = await fetch(`https://api.truelayer.com/data/v1/accounts/${accountId}/cards`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur API TrueLayer cards:', response.status, errorText);
      
      return NextResponse.json(
        { error: `Erreur API TrueLayer: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const cards = await response.json();
    console.log(`✅ ${cards.results?.length || 0} cartes récupérées pour le compte ${accountId}`);
    
    return NextResponse.json(cards.results || []);

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des cartes:', error);
    
    return NextResponse.json(
      { error: 'Erreur interne du serveur', details: error instanceof Error ? error.message : 'Erreur inconnue' },
      { status: 500 }
    );
  }
} 