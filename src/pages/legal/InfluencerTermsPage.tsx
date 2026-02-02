import { Link } from "react-router-dom";
import { Rocket, ArrowLeft, FileText, Scale, Shield, Clock, Ban, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import gradientBg from "@/assets/gradient-bg.jpg";
import gradientBgDark from "@/assets/gradient-bg-dark.png";

export function InfluencerTermsPage() {
  const { theme } = useTheme();
  const lastUpdated = "1. Februar 2026";

  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundImage: `url(${theme === "dark" ? gradientBgDark : gradientBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Rocket className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">LaunchPad</span>
          </Link>
          <Link to="/creator/login">
            <Button variant="outline" size="sm" className="rounded-xl">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zum Creator Portal
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 pb-16">
        <div className="glass rounded-2xl p-8 md:p-12">
          {/* Title Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Allgemeine Geschäftsbedingungen
            </h1>
            <p className="text-lg text-muted-foreground">
              für Influencer & Content Creator
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Stand: {lastUpdated}
            </p>
          </div>

          {/* Table of Contents */}
          <div className="bg-muted/30 rounded-xl p-6 mb-10">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              Inhaltsverzeichnis
            </h2>
            <nav className="grid md:grid-cols-2 gap-2 text-sm">
              <a href="#geltungsbereich" className="hover:text-primary transition-colors">1. Geltungsbereich</a>
              <a href="#vertragsgegenstand" className="hover:text-primary transition-colors">2. Vertragsgegenstand</a>
              <a href="#pflichten-influencer" className="hover:text-primary transition-colors">3. Pflichten des Influencers</a>
              <a href="#verguetung" className="hover:text-primary transition-colors">4. Vergütung & Auszahlung</a>
              <a href="#vertragslaufzeit" className="hover:text-primary transition-colors">5. Vertragslaufzeit & Kündigung</a>
              <a href="#vertraulichkeit" className="hover:text-primary transition-colors">6. Vertraulichkeit</a>
              <a href="#haftung" className="hover:text-primary transition-colors">7. Haftung</a>
              <a href="#datenschutz" className="hover:text-primary transition-colors">8. Datenschutz</a>
              <a href="#schlussbestimmungen" className="hover:text-primary transition-colors">9. Schlussbestimmungen</a>
            </nav>
          </div>

          {/* Sections */}
          <div className="space-y-10 text-foreground/90">
            {/* Section 1 */}
            <section id="geltungsbereich">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">1</span>
                Geltungsbereich
              </h2>
              <div className="space-y-3 pl-10">
                <p>
                  1.1 Diese Allgemeinen Geschäftsbedingungen (nachfolgend "AGB") gelten für alle Vertragsbeziehungen
                  zwischen der Prometheus GmbH (nachfolgend "Agentur") und dem Influencer/Content Creator
                  (nachfolgend "Influencer").
                </p>
                <p>
                  1.2 Abweichende, entgegenstehende oder ergänzende Allgemeine Geschäftsbedingungen des
                  Influencers werden nur dann und insoweit Vertragsbestandteil, als die Agentur ihrer
                  Geltung ausdrücklich schriftlich zugestimmt hat.
                </p>
                <p>
                  1.3 Diese AGB sind Bestandteil jedes individuellen Kooperationsvertrags zwischen der
                  Agentur und dem Influencer.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="vertragsgegenstand">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">2</span>
                Vertragsgegenstand
              </h2>
              <div className="space-y-3 pl-10">
                <p>
                  2.1 Gegenstand des Vertrags ist die Vermittlung von Werbekooperationen zwischen dem
                  Influencer und Werbekunden (nachfolgend "Brands") durch die Agentur sowie die
                  Bereitstellung der LaunchPad-Plattform.
                </p>
                <p>
                  2.2 Der Influencer verpflichtet sich, Werbeinhalte gemäß den vereinbarten
                  Kampagnenbriefings zu erstellen und auf seinen Social-Media-Kanälen zu veröffentlichen.
                </p>
                <p>
                  2.3 Die Agentur stellt dem Influencer Zugang zum Creator Portal zur Verfügung,
                  welches folgende Funktionen umfasst:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Übersicht über aktive Kampagnen und Kooperationen</li>
                  <li>Verwaltung von Referral-Codes und Tracking</li>
                  <li>Einsicht in Vergütungen und Auszahlungshistorie</li>
                  <li>Kommunikation mit dem Agentur-Team</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section id="pflichten-influencer">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">3</span>
                Pflichten des Influencers
              </h2>
              <div className="space-y-3 pl-10">
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-4">
                  <h3 className="font-medium flex items-center gap-2 text-green-600 dark:text-green-400 mb-2">
                    <CheckCircle className="h-5 w-5" />
                    Der Influencer verpflichtet sich:
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>a) Werbeinhalte gemäß Briefing termingerecht zu erstellen und zu veröffentlichen</li>
                    <li>b) Alle werblichen Inhalte ordnungsgemäß als Werbung zu kennzeichnen</li>
                    <li>c) Keine irreführenden oder falschen Aussagen über Produkte/Dienstleistungen zu machen</li>
                    <li>d) Die Rechte Dritter (insbesondere Urheberrechte, Markenrechte, Persönlichkeitsrechte) zu wahren</li>
                    <li>e) Aktuelle und korrekte Kontakt- und Zahlungsdaten bereitzustellen</li>
                    <li>f) Die Agentur unverzüglich über Änderungen seiner Reichweite oder Kanalstatus zu informieren</li>
                  </ul>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <h3 className="font-medium flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
                    <Ban className="h-5 w-5" />
                    Dem Influencer ist untersagt:
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>a) Manipulation von Reichweiten oder Engagement (z.B. durch Bots, Fake-Follower)</li>
                    <li>b) Gleichzeitige Kooperationen mit direkten Konkurrenten ohne Zustimmung</li>
                    <li>c) Weitergabe von vertraulichen Kampagneninformationen an Dritte</li>
                    <li>d) Eigenständige Änderungen an vereinbarten Inhalten ohne Rücksprache</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section id="verguetung">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">4</span>
                Vergütung & Auszahlung
              </h2>
              <div className="space-y-3 pl-10">
                <p>
                  4.1 Die Vergütung des Influencers richtet sich nach dem individuell vereinbarten
                  Vergütungsmodell, welches im jeweiligen Kooperationsvertrag festgelegt wird.
                </p>
                <p>
                  4.2 Mögliche Vergütungsmodelle umfassen:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Feste Vergütung:</strong> Einmalzahlung pro Content-Piece oder Kampagne</li>
                  <li><strong>Performance-basiert:</strong> Provisionen basierend auf Sales, Downloads oder Registrierungen</li>
                  <li><strong>Hybrid:</strong> Kombination aus Fixum und Performance-Anteil</li>
                </ul>
                <p>
                  4.3 Auszahlungen erfolgen monatlich zum 15. des Folgemonats, sofern der Mindestauszahlungsbetrag
                  von 50,00 EUR erreicht wurde. Bei Unterschreitung wird das Guthaben in den Folgemonat übertragen.
                </p>
                <p>
                  4.4 Die Auszahlung erfolgt auf das vom Influencer im Creator Portal hinterlegte Bankkonto.
                  Für Auszahlungen außerhalb des SEPA-Raums können Bankgebühren anfallen, die vom Auszahlungsbetrag
                  abgezogen werden.
                </p>
                <p>
                  4.5 Der Influencer ist für die ordnungsgemäße Versteuerung seiner Einnahmen selbst verantwortlich.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section id="vertragslaufzeit">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">5</span>
                Vertragslaufzeit & Kündigung
              </h2>
              <div className="space-y-3 pl-10">
                <p>
                  5.1 Der Rahmenvertrag wird auf unbestimmte Zeit geschlossen und kann von beiden Parteien
                  mit einer Frist von 30 Tagen zum Monatsende ordentlich gekündigt werden.
                </p>
                <p>
                  5.2 Einzelne Kampagnenverträge haben die im jeweiligen Vertrag festgelegte Laufzeit.
                </p>
                <p>
                  5.3 Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.
                  Ein wichtiger Grund liegt insbesondere vor bei:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Verstoß gegen die Kennzeichnungspflichten</li>
                  <li>Manipulation von Reichweiten oder Performance-Daten</li>
                  <li>Schwerwiegender Rufschädigung der Agentur oder der Brands</li>
                  <li>Insolvenz oder wesentliche Verschlechterung der wirtschaftlichen Verhältnisse</li>
                </ul>
                <p>
                  5.4 Bei Kündigung bleiben bereits abgeschlossene Kampagnenverträge von der Kündigung
                  unberührt und sind vertragsgemäß zu erfüllen.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section id="vertraulichkeit">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">6</span>
                Vertraulichkeit
              </h2>
              <div className="space-y-3 pl-10">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
                    <p className="text-sm">
                      Der Influencer verpflichtet sich, alle ihm im Rahmen der Zusammenarbeit bekannt
                      gewordenen vertraulichen Informationen streng vertraulich zu behandeln.
                    </p>
                  </div>
                </div>
                <p>
                  6.1 Als vertraulich gelten insbesondere:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Informationen über geplante, aber noch nicht veröffentlichte Kampagnen</li>
                  <li>Vergütungsvereinbarungen und Konditionen</li>
                  <li>Geschäftsgeheimnisse der Brands und der Agentur</li>
                  <li>Strategische Informationen und Geschäftspläne</li>
                </ul>
                <p>
                  6.2 Die Vertraulichkeitsverpflichtung gilt auch über das Vertragsende hinaus für
                  einen Zeitraum von zwei Jahren.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section id="haftung">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">7</span>
                Haftung
              </h2>
              <div className="space-y-3 pl-10">
                <p>
                  7.1 Der Influencer haftet für alle Schäden, die durch die Verletzung seiner
                  vertraglichen Pflichten entstehen, insbesondere für:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Verstöße gegen das Werbekennzeichnungsrecht</li>
                  <li>Verletzung von Rechten Dritter in erstellten Inhalten</li>
                  <li>Falsche oder irreführende Produktaussagen</li>
                </ul>
                <p>
                  7.2 Der Influencer stellt die Agentur von allen Ansprüchen Dritter frei, die aus
                  einer Verletzung seiner vertraglichen Pflichten resultieren.
                </p>
                <p>
                  7.3 Die Haftung der Agentur ist auf Vorsatz und grobe Fahrlässigkeit beschränkt,
                  außer bei Verletzung wesentlicher Vertragspflichten.
                </p>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mt-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <p className="text-sm">
                      <strong>Wichtiger Hinweis:</strong> Die Agentur übernimmt keine Haftung für
                      technische Störungen der Social-Media-Plattformen oder Änderungen in deren
                      Algorithmen, die die Reichweite der Inhalte beeinflussen können.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 8 */}
            <section id="datenschutz">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">8</span>
                Datenschutz
              </h2>
              <div className="space-y-3 pl-10">
                <p>
                  8.1 Die Verarbeitung personenbezogener Daten erfolgt gemäß der
                  Datenschutz-Grundverordnung (DSGVO) und dem Bundesdatenschutzgesetz (BDSG).
                </p>
                <p>
                  8.2 Folgende Daten werden von der Agentur verarbeitet:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Kontaktdaten (Name, E-Mail, Telefon, Adresse)</li>
                  <li>Bankverbindung für Auszahlungen</li>
                  <li>Social-Media-Handles und öffentliche Statistiken</li>
                  <li>Performance-Daten der Kampagnen</li>
                </ul>
                <p>
                  8.3 Die Daten werden ausschließlich zur Vertragserfüllung, Abrechnung und
                  Kampagnenoptimierung verwendet.
                </p>
                <p>
                  8.4 Der Influencer hat jederzeit das Recht auf Auskunft, Berichtigung, Löschung
                  und Einschränkung der Verarbeitung seiner Daten.
                </p>
                <p>
                  8.5 Weitere Informationen zum Datenschutz finden sich in unserer separaten
                  Datenschutzerklärung unter{" "}
                  <Link to="/legal/privacy" className="text-primary hover:underline">
                    launchpad.app/legal/privacy
                  </Link>.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section id="schlussbestimmungen">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">9</span>
                Schlussbestimmungen
              </h2>
              <div className="space-y-3 pl-10">
                <p>
                  9.1 Änderungen und Ergänzungen dieser AGB bedürfen der Schriftform. Dies gilt auch
                  für die Aufhebung dieses Schriftformerfordernisses.
                </p>
                <p>
                  9.2 Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, so wird
                  die Wirksamkeit der übrigen Bestimmungen hiervon nicht berührt. Anstelle der
                  unwirksamen Bestimmung tritt eine Regelung, die dem wirtschaftlichen Zweck der
                  unwirksamen Bestimmung am nächsten kommt.
                </p>
                <p>
                  9.3 Es gilt ausschließlich das Recht der Bundesrepublik Deutschland unter Ausschluss
                  des UN-Kaufrechts.
                </p>
                <p>
                  9.4 Gerichtsstand für alle Streitigkeiten aus oder im Zusammenhang mit diesem
                  Vertrag ist, soweit gesetzlich zulässig, der Sitz der Agentur.
                </p>
                <div className="bg-muted/50 rounded-xl p-4 mt-6">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium text-foreground">Letzte Aktualisierung</p>
                      <p>Diese AGB wurden zuletzt am {lastUpdated} aktualisiert.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Contact Section */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Fragen zu diesen AGB?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Bei Fragen zu diesen Allgemeinen Geschäftsbedingungen wenden Sie sich bitte an:
              </p>
              <a
                href="mailto:legal@prometheus.de"
                className="text-primary hover:underline font-medium"
              >
                legal@prometheus.de
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="glass border-t border-border/50 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Prometheus GmbH. Alle Rechte vorbehalten.</p>
          <div className="mt-2 flex items-center justify-center gap-4">
            <Link to="/legal/privacy" className="hover:text-primary transition-colors">
              Datenschutz
            </Link>
            <span>•</span>
            <Link to="/legal/imprint" className="hover:text-primary transition-colors">
              Impressum
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
