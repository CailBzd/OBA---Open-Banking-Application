import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ accountId: string }> }
) {
  try {
    const { accountId } = await params;
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
    
    console.log(`🔑 Récupération des transactions pour le compte ${accountId} depuis ${fromDate || 'début'} jusqu'à ${toDate || 'maintenant'}`);

    // Construire l'URL avec les paramètres de date
    let url = `https://api.truelayer.com/data/v1/accounts/${accountId}/transactions`;
    const queryParams = new URLSearchParams();
    if (fromDate) queryParams.append('from', fromDate);
    if (toDate) queryParams.append('to', toDate);
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    console.log(`🌐 Appel à l'URL: ${url}`);

    // Appel à l'API TrueLayer pour récupérer les transactions
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    console.log(`📊 Réponse API TrueLayer - Status: ${response.status}`);

    if (!response.ok) {
      let errorData;
      try {
        const errorText = await response.text();
        console.error('❌ Erreur API TrueLayer transactions:', response.status, errorText);
        errorData = { error: `Erreur API TrueLayer: ${response.status}`, details: errorText };
      } catch (parseError) {
        console.error('❌ Erreur de parsing de la réponse d\'erreur:', parseError);
        errorData = { error: `Erreur API TrueLayer: ${response.status}`, details: 'Erreur inconnue' };
      }
      
      return NextResponse.json(errorData, { status: response.status });
    }

    let transactionsData;
    try {
      const responseText = await response.text();
      console.log(`📊 Réponse brute transactions: ${responseText.substring(0, 200)}...`);
      
      if (responseText.trim()) {
        transactionsData = JSON.parse(responseText);
      } else {
        console.log('⚠️ Réponse vide pour les transactions');
        transactionsData = { results: [] };
      }
    } catch (parseError) {
      console.error('❌ Erreur de parsing JSON des transactions:', parseError);
      return NextResponse.json(
        { error: 'Erreur de parsing des données de transactions' },
        { status: 500 }
      );
    }

    const transactions = transactionsData.results || transactionsData.transactions || [];
    console.log(`✅ ${transactions.length} transactions récupérées pour le compte ${accountId}`);
    
    return NextResponse.json(transactions);

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des transactions:', error);
    
    return NextResponse.json(
      { error: 'Erreur interne du serveur', details: error instanceof Error ? error.message : 'Erreur inconnue' },
      { status: 500 }
    );
  }
} 