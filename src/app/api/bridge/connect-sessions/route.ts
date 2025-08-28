import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_uuid, provider_id, callback_url, user_email, account_types } = body;
    
    // Récupérer les credentials depuis les headers
    const clientId = request.headers.get('Client-Id') || process.env.BRIDGE_API_CLIENT_ID || 'sandbox_id_45f51a0f76164ff294ec5a0593130c57';
    const clientSecret = request.headers.get('Client-Secret') || process.env.BRIDGE_API_CLIENT_SECRET || 'sandbox_secret_DUKj7KhU0R2iDTdq9hkNUdXXS00bq3S7ojllWeShBqXYMlC01gD1TA1IzTBQdouw';
    
    console.log('Création de session de connexion pour:', { user_uuid, provider_id });
    console.log('Credentials utilisés:', { clientId: clientId.substring(0, 10) + '...', clientSecret: clientSecret.substring(0, 10) + '...' });
    
    // Étape 1: Obtenir un access token avec les credentials Bridge
    const tokenResponse = await fetch('https://api.bridgeapi.io/v3/aggregation/authorization/token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Bridge-Version': '2025-01-15',
        'Client-Id': clientId,
        'Client-Secret': clientSecret
      },
      body: JSON.stringify({
        user_uuid: user_uuid
      })
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Erreur lors de l\'obtention du token:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error: errorText
      });
      
      return NextResponse.json(
        { 
          error: `Erreur d'authentification: ${tokenResponse.status} - ${tokenResponse.statusText}`,
          details: errorText
        },
        { status: tokenResponse.status }
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token || tokenData.data?.access_token;
    
    if (!accessToken) {
      console.error('Token non trouvé dans la réponse:', tokenData);
      return NextResponse.json(
        { 
          error: 'Token d\'accès non trouvé dans la réponse',
          details: tokenData
        },
        { status: 500 }
      );
    }

    console.log('Token d\'accès obtenu avec succès');

    // Étape 2: Créer la session de connexion avec le token ET les credentials
    const sessionBody = {
      user_email: user_email,
      provider_id: provider_id,
      // callback_url: callback_url,
      account_types: 'all' // Selon la doc, défaut à "payment" pour la meilleure expérience
    };
    
    console.log('Body de la session à envoyer (selon la doc Bridge):', sessionBody);
    
    const sessionResponse = await fetch('https://api.bridgeapi.io/v3/aggregation/connect-sessions', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Bridge-Version': '2025-01-15',
        'Authorization': `Bearer ${accessToken}`,
        'Client-Id': clientId,
        'Client-Secret': clientSecret
      },
      body: JSON.stringify(sessionBody)
    });

    if (!sessionResponse.ok) {
      const errorText = await sessionResponse.text();
      console.error('Erreur lors de la création de la session:', {
        status: sessionResponse.status,
        statusText: sessionResponse.statusText,
        error: errorText
      });
      
      return NextResponse.json(
        { 
          error: `Erreur de création de session: ${sessionResponse.status} - ${sessionResponse.statusText}`,
          details: errorText
        },
        { status: sessionResponse.status }
      );
    }

    const sessionData = await sessionResponse.json();
    console.log('Session de connexion créée avec succès:', sessionData);
    
    return NextResponse.json({
      success: true,
      data: sessionData.data || sessionData
    });

  } catch (error) {
    console.error('Error creating connect session:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 