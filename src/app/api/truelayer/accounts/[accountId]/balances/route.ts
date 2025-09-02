import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ accountId: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token d\'autorisation requis' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const { accountId } = await params;

    console.log(`🔄 Récupération des soldes pour le compte: ${accountId}`);

    // Essayer d'abord l'endpoint standard
    let response = await fetch(`https://api.truelayer.com/data/v1/accounts/${accountId}/balances`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    // Si 404, essayer l'endpoint alternatif
    if (response.status === 404) {
      console.log(`⚠️ Endpoint standard 404, essai de l'endpoint alternatif...`);
      response = await fetch(`https://api.truelayer.com/data/v1/accounts/${accountId}/balance`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
    }

    console.log(`📊 Réponse API soldes - Status: ${response.status}`);

    if (!response.ok) {
      // Si 404, cela peut signifier que le compte n'a pas de soldes disponibles
      if (response.status === 404) {
        console.log(`⚠️ Aucun solde disponible pour le compte ${accountId}`);
        return NextResponse.json(
          { 
            message: 'Aucun solde disponible pour ce compte',
            account_id: accountId,
            balances: []
          },
          { status: 200 }
        );
      }

      let errorData;
      try {
        errorData = await response.json();
      } catch (parseError) {
        console.error('Erreur de parsing de la réponse d\'erreur:', parseError);
        errorData = { error: 'Erreur inconnue', status: response.status };
      }
      
      console.error('Erreur API TrueLayer:', errorData);
      return NextResponse.json(
        { error: `Erreur API: ${errorData.error_description || errorData.error || 'Erreur inconnue'}` },
        { status: response.status }
      );
    }

    let balancesData;
    try {
      const responseText = await response.text();
      console.log(`📊 Réponse brute soldes: ${responseText.substring(0, 200)}...`);
      
      if (responseText.trim()) {
        balancesData = JSON.parse(responseText);
      } else {
        console.log('⚠️ Réponse vide pour les soldes');
        balancesData = [];
      }
    } catch (parseError) {
      console.error('Erreur de parsing JSON des soldes:', parseError);
      return NextResponse.json(
        { error: 'Erreur de parsing des données de soldes' },
        { status: 500 }
      );
    }

    console.log(`✅ Soldes récupérés pour ${accountId}:`, balancesData);
    return NextResponse.json(balancesData);

  } catch (error) {
    console.error('Erreur lors de la récupération des soldes:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}