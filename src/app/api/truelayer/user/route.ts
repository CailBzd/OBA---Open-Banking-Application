import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token d\'autorisation requis' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    const response = await fetch('https://api.truelayer.com/data/v1/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: `Erreur API: ${errorData.error_description || errorData.error}` },
        { status: response.status }
      );
    }

    const userData = await response.json();
    return NextResponse.json(userData);

  } catch (error) {
    console.error('Erreur lors de la récupération des données utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
