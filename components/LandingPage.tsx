"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Trophy, Target, Map, Sparkles, Shield, Zap, Brain, ScrollText } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Hero Section */}
      <header className="relative overflow-hidden pt-20 pb-32 md:pt-32 md:pb-48">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
            <motion.div 
                animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ 
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "reverse" 
                }}
                className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" 
            />
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{ 
                    duration: 7,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: 1
                }}
                className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" 
            />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border backdrop-blur-sm mb-8"
          >
            <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">La version Beta est disponible</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl md:text-7xl font-heading font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70"
          >
            Devenez le Héros <br/>
            <span className="text-primary">de votre propre Vie</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Prometheus transforme votre développement personnel en une aventure RPG épique. 
            Transformez vos objectifs réels en quêtes, gagnez de l'XP et débloquez votre potentiel.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/auth/sign-up">
                <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all duration-300 group">
                    Commencer l'Aventure
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
            </Link>
            <Link href="/auth/sign-in">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg h-14 px-8 hover:bg-muted/50">
                    Se Connecter
                </Button>
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="py-24 bg-muted/30 border-y">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Tout ce dont vous avez besoin pour évoluer</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Une suite d'outils conçus pour gamifier chaque aspect de votre existence, du passé au futur.
                </p>
            </div>

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
                <FeatureCard 
                    icon={<ScrollText className="w-8 h-8 text-blue-500" />}
                    title="Diagnostic Introspectif"
                    description="Revisitez votre passé, de vos origines à aujourd'hui, pour construire le socle de votre personnage."
                />
                <FeatureCard 
                    icon={<Map className="w-8 h-8 text-green-500" />}
                    title="Parcours de Vie"
                    description="Des itinéraires guidés (Résilience, Carrière, Autonomie) pour structurer votre progression."
                />
                <FeatureCard 
                    icon={<Trophy className="w-8 h-8 text-yellow-500" />}
                    title="Système de Récompenses"
                    description="Gagnez des badges uniques et de l'XP à chaque étape franchie. Visualisez votre montée en puissance."
                />
                <FeatureCard 
                    icon={<Brain className="w-8 h-8 text-purple-500" />}
                    title="Arbre de Compétences"
                    description="Développez vos statistiques réelles (Force, Intelligence, Charisme) à travers vos actions."
                />
                <FeatureCard 
                    icon={<Target className="w-8 h-8 text-red-500" />}
                    title="Quêtes Quotidiennes"
                    description="Transformez les corvées et les objectifs en missions claires et gratifiantes."
                />
                <FeatureCard 
                    icon={<Shield className="w-8 h-8 text-indigo-500" />}
                    title="Héritage & Vision"
                    description="Définissez votre vision à long terme et laissez une trace de votre parcours."
                />
            </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="w-full md:w-1/2 space-y-8"
                >
                    <h2 className="text-3xl md:text-4xl font-heading font-bold">Comment ça marche ?</h2>
                    <div className="space-y-6">
                        <Step 
                            number="01" 
                            title="Créez votre Profil" 
                            desc="Inscrivez-vous et commencez par le Diagnostic de Vie pour initialiser vos statistiques." 
                        />
                        <Step 
                            number="02" 
                            title="Choisissez votre Voie" 
                            desc="Sélectionnez un Parcours (ex: Résilience) ou picorez des quêtes à la carte." 
                        />
                        <Step 
                            number="03" 
                            title="Passez à l'Action" 
                            desc="Accomplissez les tâches dans le monde réel et validez-les sur l'application." 
                        />
                        <Step 
                            number="04" 
                            title="Évoluez" 
                            desc="Regardez votre niveau augmenter et débloquez de nouvelles opportunités." 
                        />
                    </div>
                </motion.div>
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="w-full md:w-1/2 relative"
                >
                    <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-border/50 shadow-2xl hover:scale-105 transition-transform duration-500">
                        <Zap className="w-32 h-32 text-primary animate-pulse" />
                    </div>
                </motion.div>
            </div>
          </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24">
          <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-4">Investissez en Vous-même</h2>
              <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
                  Commencez gratuitement et débloquez tout votre potentiel avec notre offre unique.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {/* Free Plan */}
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="p-8 rounded-3xl border bg-card relative"
                  >
                      <div className="mb-6">
                          <h3 className="text-2xl font-bold">Explorateur</h3>
                          <div className="text-4xl font-bold mt-2">0€ <span className="text-lg font-normal text-muted-foreground">/ mois</span></div>
                          <p className="text-muted-foreground mt-2">Pour découvrir le concept et commencer votre diagnostic.</p>
                      </div>
                      <ul className="space-y-4 mb-8">
                          <li className="flex items-center gap-3"><Shield className="w-5 h-5 text-primary" /> Accès au Diagnostic de Vie complet</li>
                          <li className="flex items-center gap-3"><Shield className="w-5 h-5 text-primary" /> 3 Premières Quêtes de chaque Parcours</li>
                          <li className="flex items-center gap-3"><Shield className="w-5 h-5 text-primary" /> Profil de base & Badges</li>
                      </ul>
                      <Link href="/auth/sign-up">
                        <Button className="w-full h-12 text-lg" variant="outline">Commencer Gratuitement</Button>
                      </Link>
                  </motion.div>

                  {/* Lifetime Plan */}
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="p-8 rounded-3xl border-2 border-primary bg-card relative shadow-2xl shadow-primary/10"
                  >
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold">
                          Offre de Lancement
                      </div>
                      <div className="mb-6">
                          <h3 className="text-2xl font-bold text-primary">Légende</h3>
                          <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-4xl font-bold">49€</span>
                            <span className="text-lg font-normal text-muted-foreground line-through">99€</span>
                          </div>
                          <p className="text-muted-foreground mt-2 font-medium text-green-600">Paiement unique. Accès à vie.</p>
                      </div>
                      <ul className="space-y-4 mb-8">
                          <li className="flex items-center gap-3"><Sparkles className="w-5 h-5 text-primary" /> <strong>Accès illimité</strong> à tous les Parcours</li>
                          <li className="flex items-center gap-3"><Sparkles className="w-5 h-5 text-primary" /> Générateur de Quêtes IA illimité</li>
                          <li className="flex items-center gap-3"><Sparkles className="w-5 h-5 text-primary" /> Statistiques & Analytiques avancées</li>
                          <li className="flex items-center gap-3"><Sparkles className="w-5 h-5 text-primary" /> Accès prioritaire aux nouveautés</li>
                      </ul>
                      <Link href="/auth/sign-up?plan=lifetime">
                        <Button className="w-full h-12 text-lg font-bold shadow-lg hover:shadow-primary/25 transition-all">Obtenir l'Accès à Vie</Button>
                      </Link>
                  </motion.div>
              </div>
          </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-muted/30 border-y">
          <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-12">Ils ont changé de vie</h2>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                  <TestimonialCard 
                      name="Thomas L."
                      role="Développeur Junior"
                      quote="Grâce au parcours 'De la Science au Numérique', j'ai structuré ma reconversion étape par étape. C'est comme un jeu, mais les résultats sont réels."
                  />
                  <TestimonialCard 
                      name="Sarah M."
                      role="Entrepreneuse"
                      quote="La gamification m'a aidée à surmonter la procrastination. Voir ma barre d'XP monter me motive à accomplir mes tâches administratives !"
                  />
                  <TestimonialCard 
                      name="Julien D."
                      role="Étudiant"
                      quote="J'adore le système de badges. Ça donne un sentiment d'accomplissement immédiat, même pour les petites victoires du quotidien."
                  />
              </motion.div>
          </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 bg-primary text-primary-foreground text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="container relative z-10 mx-auto px-4">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-5xl font-heading font-bold mb-6"
              >
                Prêt à changer la donne ?
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-primary-foreground/80 text-xl mb-10 max-w-2xl mx-auto"
              >
                  Rejoignez les milliers d'utilisateurs qui ont décidé de reprendre le contrôle de leur narratif.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <Link href="/auth/sign-up">
                    <Button size="lg" variant="secondary" className="text-lg h-16 px-10 shadow-2xl hover:scale-105 transition-transform font-bold">
                        Créer mon Compte Gratuit
                    </Button>
                </Link>
              </motion.div>
              <p className="mt-6 text-sm opacity-60">Aucune carte bancaire requise.</p>
          </div>
      </section>

      <footer className="py-8 border-t text-center text-muted-foreground text-sm">
          <div className="container mx-auto px-4">
            <p>&copy; {new Date().getFullYear()} Prometheus. Tous droits réservés.</p>
          </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-background border hover:border-primary/50 transition-colors hover:shadow-lg group">
            <div className="mb-4 p-3 rounded-xl bg-muted w-fit group-hover:bg-primary/10 transition-colors">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">{description}</p>
        </motion.div>
    )
}

function Step({ number, title, desc }: { number: string, title: string, desc: string }) {
    return (
        <div className="flex gap-4 group">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                {number}
            </div>
            <div>
                <h4 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">{title}</h4>
                <p className="text-muted-foreground">{desc}</p>
            </div>
        </div>
    )
}

function TestimonialCard({ name, role, quote }: { name: string, role: string, quote: string }) {
    return (
        <motion.div variants={itemVariants} className="p-8 rounded-2xl bg-background border shadow-sm hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center font-bold text-lg text-muted-foreground">
                    {name.charAt(0)}
                </div>
                <div>
                    <div className="font-bold">{name}</div>
                    <div className="text-sm text-muted-foreground">{role}</div>
                </div>
            </div>
            <p className="italic text-muted-foreground leading-relaxed">"{quote}"</p>
        </motion.div>
    )
}
