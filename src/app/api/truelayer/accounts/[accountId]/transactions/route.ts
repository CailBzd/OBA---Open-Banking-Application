import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { accountId: string } }
) {
  try {
    const { accountId } = params;
    const { searchParams } = new URL(request.url);
    const fromDate = searchParams.get('from');
    const toDate = searchParams.get('to');
    
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header manquant ou invalide' },
        { status: 401 }
      );
    }

    const accessToken = authHeader.replace('Bearer ', '');
    
    console.log(`🔑 Récupération des transactions pour le compte ${accountId}`);

    // Construire l'URL avec les paramètres de date
    let url = `https://api.truelayer.com/data/v1/accounts/${accountId}/transactions`;
    const params = new URLSearchParams();
    if (fromDate) params.append('from', fromDate);
    if (toDate) params.append('to', toDate);
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    // Appel à l'API TrueLayer pour récupérer les transactions
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur API TrueLayer transactions:', response.status, errorText);
      
      return NextResponse.json(
        { error: `Erreur API TrueLayer: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const transactions = await response.json();
    console.log(`✅ ${transactions.results?.length || 0} transactions récupérées pour le compte ${accountId}`);
    
    return NextResponse.json(transactions.results || []);

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des transactions:', error);
    
    return NextResponse.json(
      { error: 'Erreur interne du serveur', details: error instanceof Error ? error.message : 'Erreur inconnue' },
      { status: 500 }
    );
  }
} 