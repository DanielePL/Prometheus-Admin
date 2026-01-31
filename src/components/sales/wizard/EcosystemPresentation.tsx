import { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Users,
  Target,
  TrendingUp,
  BarChart3,
  Smartphone,
  Building2,
  Globe,
  CheckCircle2,
  Crown,
  Zap,
  Dumbbell,
  Brain,
  Utensils,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EcosystemPresentationProps {
  onClose: () => void;
}

interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
}

// Phone mockup wrapper for mobile screenshots
function PhoneMockup({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative mx-auto" style={{ maxWidth: "280px" }}>
      <div className="absolute -inset-4 bg-primary/20 rounded-[3rem] blur-2xl" />
      <div className="relative bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl border-4 border-gray-800">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-b-2xl" />
        <img
          src={src}
          alt={alt}
          className="rounded-[2rem] w-full"
        />
      </div>
    </div>
  );
}

export function EcosystemPresentation({ onClose }: EcosystemPresentationProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    // ========================================
    // INTRO
    // ========================================

    // Slide 1: Title
    {
      id: 1,
      title: "",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
          <div className="relative">
            <div className="absolute -inset-8 bg-primary/20 rounded-full blur-3xl" />
            <img
              src="/presentation/logo-flame.png"
              alt="Prometheus"
              className="relative h-32 w-32 object-contain"
            />
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold font-heading bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
              Prometheus
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
              Das komplette Fitness Ecosystem für Studios,
              Coaches & Athleten
            </p>
          </div>
          <div className="flex gap-4 pt-4 flex-wrap justify-center">
            {["Enterprise Platform", "Coach App", "Athlete App"].map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ),
    },

    // Slide 2: Das Ecosystem Overview
    {
      id: 2,
      title: "Das Prometheus Ecosystem",
      content: (
        <div className="grid md:grid-cols-3 gap-6 h-full items-center">
          {[
            {
              icon: Building2,
              title: "Prometheus Enterprise",
              desc: "B2B-Plattform für Studios, Gyms & Vereine - volle Kontrolle über dein Business",
              color: "from-primary to-orange-600",
            },
            {
              icon: Smartphone,
              title: "Prometheus Coach",
              desc: "Die VBT-App für deine Athleten mit AI-gesteuertem Training",
              color: "from-blue-500 to-cyan-500",
            },
            {
              icon: Globe,
              title: "Partner Portal",
              desc: "Creator & Affiliate Management - verdiene mit Empfehlungen",
              color: "from-purple-500 to-pink-500",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group relative p-8 rounded-3xl bg-card/50 backdrop-blur border border-muted/30 hover:border-primary/30 transition-all duration-300"
            >
              <div
                className={cn(
                  "h-16 w-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform",
                  item.color
                )}
              >
                <item.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      ),
    },

    // ========================================
    // ENTERPRISE SECTION
    // ========================================

    // Slide 3: Enterprise Dashboard
    {
      id: 3,
      title: "Enterprise: Command Center",
      subtitle: "Dein zentrales Business Dashboard",
      content: (
        <div className="grid md:grid-cols-2 gap-8 h-full items-center">
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Behalte alle wichtigen KPIs im Blick - von Mitgliederzahlen
              bis Umsatzentwicklung, alles auf einen Blick.
            </p>
            <div className="space-y-4">
              {[
                { icon: BarChart3, text: "Echtzeit-Statistiken" },
                { icon: TrendingUp, text: "Umsatz-Tracking" },
                { icon: Users, text: "Mitglieder-Übersicht" },
                { icon: Target, text: "Ziel-Monitoring" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl" />
            <img
              src="/presentation/dashboard.png"
              alt="Dashboard"
              className="relative rounded-2xl shadow-2xl border border-muted/30 w-full"
            />
          </div>
        </div>
      ),
    },

    // Slide 4: Team Management
    {
      id: 4,
      title: "Enterprise: Team Management",
      subtitle: "Dein Trainer-Team im Griff",
      content: (
        <div className="grid md:grid-cols-2 gap-8 h-full items-center">
          <div className="relative order-2 md:order-1">
            <div className="absolute -inset-4 bg-blue-500/10 rounded-3xl blur-2xl" />
            <img
              src="/presentation/coach-management.png"
              alt="Coach Management"
              className="relative rounded-2xl shadow-2xl border border-muted/30 w-full"
            />
          </div>
          <div className="space-y-6 order-1 md:order-2">
            <p className="text-lg text-muted-foreground">
              Verwalte dein gesamtes Trainer-Team an einem Ort.
              Zeiterfassung, Provisionen und Performance-Tracking.
            </p>
            <div className="space-y-4">
              {[
                "Trainer-Profile & Qualifikationen",
                "Automatische Provisionsberechnung",
                "Stundenerfassung & Abrechnung",
                "Performance-Vergleiche",
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },

    // Slide 5: Member CRM
    {
      id: 5,
      title: "Enterprise: Member CRM",
      subtitle: "Alle Mitglieder im Blick",
      content: (
        <div className="grid md:grid-cols-2 gap-8 h-full items-center">
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Vollständige Mitgliederverwaltung mit Trainingshistorie,
              Zahlungsstatus und persönlichen Notizen.
            </p>
            <div className="space-y-4">
              {[
                "360° Mitglieder-Profile",
                "Trainings-Historie & Fortschritt",
                "Automatische Erinnerungen",
                "Segmentierung & Tags",
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-purple-500/10 rounded-3xl blur-2xl" />
            <img
              src="/presentation/member-crm.png"
              alt="Member CRM"
              className="relative rounded-2xl shadow-2xl border border-muted/30 w-full"
            />
          </div>
        </div>
      ),
    },

    // Slide 6: Financials
    {
      id: 6,
      title: "Enterprise: Finanzen",
      subtitle: "Volle Kontrolle über deine Zahlen",
      content: (
        <div className="grid md:grid-cols-2 gap-8 h-full items-center">
          <div className="relative order-2 md:order-1">
            <div className="absolute -inset-4 bg-green-500/10 rounded-3xl blur-2xl" />
            <img
              src="/presentation/financials.png"
              alt="Financials"
              className="relative rounded-2xl shadow-2xl border border-muted/30 w-full"
            />
          </div>
          <div className="space-y-6 order-1 md:order-2">
            <p className="text-lg text-muted-foreground">
              Umsätze, Kosten und Margen auf einen Blick.
              Automatische Reports und Prognosen.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "MRR Tracking", value: "€12.5k" },
                { label: "Churn Rate", value: "2.3%" },
                { label: "LTV", value: "€890" },
                { label: "CAC", value: "€45" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-card/30 border border-muted/20"
                >
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },

    // Slide 7: Analytics
    {
      id: 7,
      title: "Enterprise: Analytics",
      subtitle: "Datengetriebene Entscheidungen",
      content: (
        <div className="grid md:grid-cols-2 gap-8 h-full items-center">
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Verstehe dein Business mit detaillierten Analytics.
              Von Besuchszeiten bis Trainingsvorlieben.
            </p>
            <div className="space-y-4">
              {[
                { icon: BarChart3, text: "Auslastungs-Heatmaps" },
                { icon: TrendingUp, text: "Wachstums-Trends" },
                { icon: Users, text: "Kohortenanalyse" },
                { icon: Target, text: "Conversion-Tracking" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-cyan-500/10 rounded-3xl blur-2xl" />
            <img
              src="/presentation/analytics.png"
              alt="Analytics"
              className="relative rounded-2xl shadow-2xl border border-muted/30 w-full"
            />
          </div>
        </div>
      ),
    },

    // ========================================
    // MOBILE APP SECTION
    // ========================================

    // Slide 8: App Intro
    {
      id: 8,
      title: "Prometheus Coach App",
      subtitle: "Die VBT-App für deine Athleten",
      content: (
        <div className="grid md:grid-cols-2 gap-8 h-full items-center">
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Deine Athleten trainieren mit der modernsten VBT-Technologie.
              Community, Workouts und AI-Coaching in einer App.
            </p>
            <div className="space-y-4">
              {[
                { icon: Dumbbell, text: "VBT-gesteuerte Workouts" },
                { icon: Brain, text: "AI Coach mit Echtzeit-Feedback" },
                { icon: Users, text: "Community & Social Features" },
                { icon: Utensils, text: "Nutrition Tracking" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-blue-500" />
                  </div>
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <PhoneMockup src="/presentation/app-home.png" alt="App Home" />
        </div>
      ),
    },

    // Slide 9: Workout Tracking
    {
      id: 9,
      title: "App: Workout Tracking",
      subtitle: "VBT-gesteuertes Training",
      content: (
        <div className="grid md:grid-cols-2 gap-8 h-full items-center">
          <PhoneMockup src="/presentation/app-workout.png" alt="Workout Tracking" />
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Jeder Satz wird mit Velocity Based Training optimiert.
              Automatische Gewichtsempfehlungen basierend auf der Tagesform.
            </p>
            <div className="space-y-4">
              {[
                "Echtzeit Geschwindigkeitsmessung",
                "Automatische Set-Erkennung",
                "Progressive Overload Tracking",
                "Video-Aufnahme für Form-Check",
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },

    // Slide 10: AI Coach Tips
    {
      id: 10,
      title: "App: AI Coach",
      subtitle: "Personalisiertes Coaching in Echtzeit",
      content: (
        <div className="grid md:grid-cols-2 gap-8 h-full items-center">
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Der AI Coach gibt Echtzeit-Tipps während des Trainings.
              "Bleib auf deinen Fersen! Chest hoch!" - wie ein Personal Trainer.
            </p>
            <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
              <div className="flex items-center gap-2 text-yellow-500 font-semibold mb-2">
                <Brain className="h-5 w-5" />
                Coach Tips
              </div>
              <p className="text-sm">
                "Bleib auf deinen Fersen!! Chest hoch! Nutze die Power deiner Quads!"
              </p>
            </div>
            <div className="space-y-3">
              {[
                "Form-Korrektur in Echtzeit",
                "Tempo & Velocity Guidance",
                "Fatigue Detection",
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-yellow-500 shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
          <PhoneMockup src="/presentation/app-coach-tips.png" alt="Coach Tips" />
        </div>
      ),
    },

    // Slide 11: Exercise Library
    {
      id: 11,
      title: "App: Exercise Library",
      subtitle: "Über 500+ Übungen mit Video-Anleitungen",
      content: (
        <div className="grid md:grid-cols-2 gap-8 h-full items-center">
          <PhoneMockup src="/presentation/app-library.png" alt="Exercise Library" />
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Umfangreiche Übungsbibliothek mit Videos, personalisierten
              Empfehlungen basierend auf Sport und Zielen.
            </p>
            <div className="space-y-4">
              {[
                "500+ Übungen mit HD-Videos",
                "Personalisiert für deinen Sport",
                "Eigene Übungen hinzufügen",
                "Programme & Workout-Templates",
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },

    // Slide 12: Profile & Stats
    {
      id: 12,
      title: "App: Profil & Statistiken",
      subtitle: "Alles im Blick - Body Stats bis PRs",
      content: (
        <div className="grid md:grid-cols-3 gap-6 h-full items-center">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Body Stats</h3>
            <div className="space-y-3">
              {[
                "Gewicht & Körpermaße",
                "Nutrition Goals",
                "TDEE & Makros",
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
            <h3 className="font-semibold text-lg pt-4">Performance</h3>
            <div className="space-y-3">
              {[
                "Personal Records",
                "VBT Scores",
                "Top Exercises",
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
          <PhoneMockup src="/presentation/app-profile.png" alt="Profile" />
          <PhoneMockup src="/presentation/app-stats-load.png" alt="Statistics" />
        </div>
      ),
    },

    // Slide 13: VBT Statistics
    {
      id: 13,
      title: "App: VBT Analytics",
      subtitle: "Power & Technique Scores",
      content: (
        <div className="grid md:grid-cols-2 gap-8 h-full items-center">
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Detaillierte VBT-Statistiken zeigen Power, Technique und
              Velocity-Metriken für jede Übung.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Power Score", value: "75", color: "text-cyan-400" },
                { label: "Technique", value: "59", color: "text-yellow-400" },
                { label: "Avg Velocity", value: "0.69 m/s", color: "text-primary" },
                { label: "Peak Velocity", value: "1.56 m/s", color: "text-green-400" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-card/30 border border-muted/20 text-center"
                >
                  <div className={cn("text-2xl font-bold", stat.color)}>{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <PhoneMockup src="/presentation/app-stats-vbt.png" alt="VBT Stats" />
        </div>
      ),
    },

    // Slide 14: Nutrition
    {
      id: 14,
      title: "App: Nutrition Tracking",
      subtitle: "AI-gestütztes Ernährungs-Tracking",
      content: (
        <div className="grid md:grid-cols-2 gap-8 h-full items-center">
          <PhoneMockup src="/presentation/app-nutrition.png" alt="Nutrition" />
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Tracke deine Ernährung mit AI-Unterstützung.
              Foto-Erkennung, Barcode-Scanner und detaillierte Makro-Analyse.
            </p>
            <div className="space-y-4">
              {[
                { icon: Brain, text: "AI Food Recognition" },
                { icon: BarChart3, text: "Makro & Kalorien Tracking" },
                { icon: TrendingUp, text: "Trend-Analyse" },
                { icon: Target, text: "Personalisierte Ziele" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },

    // ========================================
    // PRICING & CLOSING
    // ========================================

    // Slide 15: App Subscription
    {
      id: 15,
      title: "App: Subscription Tiers",
      subtitle: "Für jeden das richtige Paket",
      content: (
        <div className="grid md:grid-cols-2 gap-8 h-full items-center">
          <PhoneMockup src="/presentation/app-subscription-elite.png" alt="Elite Plan" />
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-yellow-500/10 border border-yellow-500/30">
              <div className="flex items-center gap-3 mb-4">
                <Crown className="h-8 w-8 text-yellow-500" />
                <div>
                  <h3 className="font-bold text-xl">Elite Plan</h3>
                  <p className="text-sm text-muted-foreground">$99/mo - Everything unlimited</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  "AI Coach - 24/7 personalized guidance",
                  "Physical Coach - Human expert support",
                  "AI Barbell Tracking - See bar speed live",
                  "Smart Nutrition - Track meals with AI",
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-card/30 border border-muted/20">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Free Tier:</span> Basis-Features kostenlos,
                perfekt zum Testen. Upgrade jederzeit möglich.
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 16: Founding Partner
    {
      id: 16,
      title: "Founding Partner Programm",
      subtitle: "Exklusive Vorteile für Early Adopters",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
          <div className="relative">
            <div className="absolute -inset-4 bg-yellow-500/20 rounded-full blur-2xl" />
            <div className="relative h-24 w-24 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-xl">
              <Crown className="h-12 w-12 text-white" />
            </div>
          </div>
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-3xl font-bold">
              <span className="text-yellow-500">50% Rabatt</span> für immer
            </h2>
            <p className="text-lg text-muted-foreground">
              Als Founding Partner sicherst du dir den halben Preis -
              lebenslang, solange dein Abo aktiv bleibt.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6 w-full max-w-2xl">
            {[
              { label: "Normale Pricing", value: "€99/mo", strike: true },
              { label: "Founding Partner", value: "€49/mo", highlight: true },
              { label: "Ersparnis/Jahr", value: "€600" },
            ].map((item, i) => (
              <div
                key={i}
                className={cn(
                  "p-4 rounded-2xl border",
                  item.highlight
                    ? "bg-primary/10 border-primary"
                    : "bg-card/30 border-muted/20"
                )}
              >
                <div
                  className={cn(
                    "text-2xl font-bold",
                    item.strike && "line-through text-muted-foreground",
                    item.highlight && "text-primary"
                  )}
                >
                  {item.value}
                </div>
                <div className="text-sm text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Nur noch begrenzte Plätze verfügbar
          </p>
        </div>
      ),
    },

    // Slide 17: Enterprise Pricing
    {
      id: 17,
      title: "Enterprise Pricing",
      subtitle: "Flexibel für jede Größe",
      content: (
        <div className="grid md:grid-cols-3 gap-6 h-full items-center">
          {[
            {
              name: "Starter",
              price: "€49",
              period: "/mo",
              desc: "Für einzelne Coaches",
              features: ["1 Coach", "Bis 25 Athleten", "VBT Basics", "Email Support"],
            },
            {
              name: "Professional",
              price: "€99",
              period: "/mo",
              desc: "Für wachsende Studios",
              features: [
                "Bis 5 Coaches",
                "Unbegrenzte Athleten",
                "Volle Analytics",
                "Priority Support",
                "API Zugang",
              ],
              popular: true,
            },
            {
              name: "Enterprise",
              price: "Custom",
              period: "",
              desc: "Für große Organisationen",
              features: [
                "Unbegrenzte Coaches",
                "White-Label Option",
                "Custom Integrationen",
                "Dedicated Manager",
                "SLA Garantie",
              ],
            },
          ].map((plan, i) => (
            <div
              key={i}
              className={cn(
                "relative p-6 rounded-3xl border backdrop-blur transition-all",
                plan.popular
                  ? "bg-primary/5 border-primary scale-105 shadow-xl shadow-primary/10"
                  : "bg-card/30 border-muted/20"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-white text-xs font-medium">
                  Beliebt
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.desc}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-3">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ),
    },
  ];

  const goToSlide = useCallback(
    (index: number) => {
      if (index >= 0 && index < slides.length) {
        setCurrentSlide(index);
      }
    },
    [slides.length]
  );

  const nextSlide = useCallback(() => {
    goToSlide(currentSlide + 1);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentSlide - 1);
  }, [currentSlide, goToSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, onClose]);

  const currentSlideData = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-muted/30">
        <div className="flex items-center gap-4">
          <img
            src="/presentation/logo-flame.png"
            alt="Prometheus"
            className="h-10 w-10 object-contain"
          />
          <div>
            <div className="font-semibold font-heading">Prometheus Ecosystem</div>
            <div className="text-xs text-muted-foreground">
              Slide {currentSlide + 1} / {slides.length}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground mr-4 hidden md:block">
            ← → zum Navigieren • ESC zum Schließen
          </span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Slide Content */}
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 p-6 md:p-12 overflow-y-auto">
          {/* Slide Header */}
          {currentSlideData.title && (
            <div className="mb-6 md:mb-8">
              <h2 className="text-2xl md:text-4xl font-bold font-heading">
                {currentSlideData.title}
              </h2>
              {currentSlideData.subtitle && (
                <p className="text-base md:text-lg text-muted-foreground mt-2">
                  {currentSlideData.subtitle}
                </p>
              )}
            </div>
          )}

          {/* Slide Body */}
          <div className={cn(
            currentSlideData.title ? "h-[calc(100%-100px)]" : "h-full"
          )}>
            {currentSlideData.content}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-card/50 backdrop-blur border border-muted/30 flex items-center justify-center transition-all z-10",
            currentSlide === 0
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-card hover:border-primary/30"
          )}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className={cn(
            "absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-card/50 backdrop-blur border border-muted/30 flex items-center justify-center transition-all z-10",
            currentSlide === slides.length - 1
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-card hover:border-primary/30"
          )}
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center justify-center gap-1.5 py-4 border-t border-muted/30 flex-wrap px-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={cn(
              "h-2 rounded-full transition-all",
              i === currentSlide
                ? "w-6 bg-primary"
                : "w-2 bg-muted hover:bg-muted-foreground"
            )}
          />
        ))}
      </div>
    </div>
  );
}
