import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { clientId, clientSecret } = await request.json();

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'Client ID et Client Secret requis' },
        { status: 400 }
      );
    }

    // Générer l'URL d'autorisation TrueLayer
    const authUrl = new URL('https://auth.truelayer.com/');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('scope', 'info accounts balance cards transactions direct_debits standing_orders offline_access');
    authUrl.searchParams.set('redirect_uri', 'http://localhost:3000/callback');
    authUrl.searchParams.set('providers', 'uk-ob-all uk-oauth-all fr-stet-credit-agricole');

    return NextResponse.json({
      authUrl: authUrl.toString(),
      message: 'URL d\'autorisation générée avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la génération de l\'URL d\'autorisation:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
