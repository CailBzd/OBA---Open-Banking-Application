import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state');

    console.log('🔄 Callback TrueLayer reçu:', { code: !!code, error, state });

    if (error) {
      console.error('❌ Erreur OAuth TrueLayer:', error);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/truelayer?error=${encodeURIComponent(error)}`
      );
    }

    if (!code) {
      console.error('❌ Code d\'autorisation manquant');
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/truelayer?error=missing_code`
      );
    }

    // Rediriger vers la page TrueLayer avec le code d'autorisation
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/truelayer?code=${encodeURIComponent(code)}`;
    
    console.log('✅ Redirection vers:', redirectUrl);
    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error('❌ Erreur lors du traitement du callback:', error);
    
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/truelayer?error=callback_error`
    );
  }
} 