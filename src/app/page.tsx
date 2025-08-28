import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, TrendingUp, Shield, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bienvenue sur OBA
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Gérez vos finances en toute simplicité avec l'Open Banking européen.
          Connectez vos comptes bancaires et suivez vos dépenses en temps réel.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              TrueLayer Open Banking
            </CardTitle>
            <CardDescription>
              Connectez vos comptes bancaires européens via TrueLayer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/truelayer">
              <Button className="w-full">
                Commencer
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Suivi Financier
            </CardTitle>
            <CardDescription>
              Visualisez vos dépenses et revenus mois par mois
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/analytics">
              <Button className="w-full" variant="outline">
                Voir les analyses
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Sécurisé
            </CardTitle>
            <CardDescription>
              Vos données sont protégées par les standards Open Banking européens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Conformité PSD2 et chiffrement de bout en bout
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Prêt à commencer ?
        </h2>
        <p className="text-gray-600 mb-6">
          Connectez votre première banque en quelques clics
        </p>
        <Link href="/truelayer">
          <Button size="lg" className="px-8">
            <CreditCard className="h-4 w-4 mr-2" />
            Connecter ma banque
          </Button>
        </Link>
      </div>
    </div>
  );
}
