import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { clientId, clientSecret, authCode, redirectUri } = await request.json();

    if (!clientId || !clientSecret || !authCode) {
      return NextResponse.json(
        { error: 'Client ID, Client Secret et code d\'autorisation requis' },
        { status: 400 }
      );
    }

    // Échanger le code d'autorisation contre un token
    const tokenResponse = await fetch('https://auth.truelayer.com/connect/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri || 'http://localhost:3000/callback',
        code: authCode,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Erreur TrueLayer:', errorData);
      return NextResponse.json(
        { error: `Erreur d'authentification: ${errorData.error_description || errorData.error}` },
        { status: tokenResponse.status }
      );
    }

    const tokenData = await tokenResponse.json();

    return NextResponse.json({
      success: true,
      token: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
      tokenType: tokenData.token_type,
      scope: tokenData.scope
    });

  } catch (error) {
    console.error('Erreur lors de l\'échange du token:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
