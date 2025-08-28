'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  User,
  CreditCard,
  Database
} from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="text-gray-600">Configurez votre application OpenBank</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Navigation des paramètres */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Catégories</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <User className="h-4 w-4 mr-2" />
                Profil
              </Button>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <Shield className="h-4 w-4 mr-2" />
                Sécurité
              </Button>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <CreditCard className="h-4 w-4 mr-2" />
                Comptes
              </Button>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <Palette className="h-4 w-4 mr-2" />
                Apparence
              </Button>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <Globe className="h-4 w-4 mr-2" />
                Langue
              </Button>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <Database className="h-4 w-4 mr-2" />
                Données
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contenu des paramètres */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profil */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profil Utilisateur</span>
              </CardTitle>
              <CardDescription>Gérez vos informations personnelles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input id="firstName" defaultValue="Jean" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input id="lastName" defaultValue="Dupont" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="jean.dupont@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" defaultValue="+33 6 12 34 56 78" />
              </div>
              <Button>Sauvegarder</Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </CardTitle>
              <CardDescription>Configurez vos préférences de notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications push</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications sur votre appareil
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alertes de solde</Label>
                  <p className="text-sm text-muted-foreground">
                    Être notifié quand votre solde est faible
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Résumé hebdomadaire</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir un résumé de vos finances chaque semaine
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Nouvelles fonctionnalités</Label>
                  <p className="text-sm text-muted-foreground">
                    Être informé des nouvelles fonctionnalités
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Sécurité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Sécurité</span>
              </CardTitle>
              <CardDescription>Paramètres de sécurité de votre compte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Authentification à deux facteurs</Label>
                  <p className="text-sm text-muted-foreground">
                    Ajouter une couche de sécurité supplémentaire
                  </p>
                </div>
                <Switch />
              </div>
              <Button variant="outline">Changer le mot de passe</Button>
            </CardContent>
          </Card>

          {/* Apparence */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Apparence</span>
              </CardTitle>
              <CardDescription>Personnalisez l'apparence de l'application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Thème</Label>
                <Select defaultValue="system">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Clair</SelectItem>
                    <SelectItem value="dark">Sombre</SelectItem>
                    <SelectItem value="system">Système</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Langue</Label>
                <Select defaultValue="fr">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Devise</Label>
                <Select defaultValue="EUR">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">Euro (€)</SelectItem>
                    <SelectItem value="USD">Dollar US ($)</SelectItem>
                    <SelectItem value="GBP">Livre Sterling (£)</SelectItem>
                    <SelectItem value="CHF">Franc Suisse (CHF)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Données */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Gestion des Données</span>
              </CardTitle>
              <CardDescription>Gérez vos données et votre vie privée</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Téléchargez toutes vos données personnelles
                </p>
                <Button variant="outline">Exporter mes données</Button>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Supprimez définitivement votre compte et toutes vos données
                </p>
                <Button variant="destructive">Supprimer mon compte</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 