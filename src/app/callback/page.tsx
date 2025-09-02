'use client';

import { useEffect } from 'react';

export default function CallbackPage() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');

    console.log('Callback reçu:', { code, error, errorDescription });

    if (error) {
      // Envoyer l'erreur à la fenêtre parent
      window.opener?.postMessage({
        type: 'TRUELAYER_AUTH_ERROR',
        error: errorDescription || error
      }, window.location.origin);
      window.close();
      return;
    }

    if (code) {
      // Envoyer le code de succès à la fenêtre parent
      window.opener?.postMessage({
        type: 'TRUELAYER_AUTH_SUCCESS',
        code: code
      }, window.location.origin);
      window.close();
    } else {
      // Aucun code trouvé
      window.opener?.postMessage({
        type: 'TRUELAYER_AUTH_ERROR',
        error: 'Aucun code d\'autorisation reçu'
      }, window.location.origin);
      window.close();
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Traitement de l'autorisation...
        </h2>
        <p className="text-gray-600">
          Veuillez patienter pendant que nous traitons votre autorisation.
        </p>
        <div className="mt-4 text-sm text-gray-500">
          <p>Cette fenêtre se fermera automatiquement.</p>
        </div>
      </div>
    </div>
  );
}
