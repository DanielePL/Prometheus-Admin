# LaunchPad AI - App Launch Assistant

> "From Code to Store in Days, Not Months"

## 🎯 Vision

LaunchPad AI ist der erste KI-gestützte App-Launch-Assistent, der Indie-Entwickler und Vibe-Coders von der fertigen App bis zum erfolgreichen Store-Launch begleitet. Kein Tutorial-Dschungel mehr, keine verwirrenden Dashboards - ein AI-Experte der alles weiß und Schritt für Schritt führt.

---

## 🚀 Das Problem (Warum das noch keiner gemacht hat)

### Der typische Indie-Dev Journey:
```
✅ App gebaut (Vibe-Coding macht's einfach)
❓ Und jetzt...?
😵 Google Play Console - 50 Felder, 20 Policies
😵 Apple Developer Account - Zertifikate, Provisioning Profiles
😵 Screenshots in 10 verschiedenen Größen
😵 Privacy Policy, Terms of Service
😵 Beta Testing Setup
😵 Review Rejection → Panik → Aufgeben
```

### Unsere Lösung:
```
✅ App gebaut
🤖 "Hey LaunchPad, ich will meine App launchen"
🤖 "Okay! Ich sehe du hast eine React Native App. Lass uns starten..."
🤖 [Führt durch ALLES - automatisiert was geht]
🎉 App ist live!
```

---

## 📱 Hauptstruktur: "App Launch" Tab

```
/app-launch
├── /assistant          → AI Chat Interface (Hauptfeature)
├── /projects           → Meine App-Projekte
├── /credentials        → API Keys & Zertifikate
├── /assets            → Screenshots, Icons, Videos
├── /compliance        → Policies & Legal Docs
├── /beta              → Beta Testing Management
├── /releases          → Release History & Status
└── /analytics         → Post-Launch Metrics
```

---

## 🤖 AI Assistant - Das Herzstück

### Persönlichkeit & Expertise

**Name:** "Launch" (oder user-wählbar)

**Charakter:**
- Freundlich aber professionell
- Proaktiv - schlägt nächste Schritte vor
- Erklärt komplexe Dinge einfach
- Kennt alle Fallstricke und warnt vorher
- Feiert Erfolge mit dem User

**Expertise-Bereiche:**
1. **Google Play Store** - Console, Policies, Release-Prozess
2. **Apple App Store** - App Store Connect, Certificates, TestFlight
3. **Store Optimization** - ASO, Screenshots, A/B Testing
4. **Compliance** - GDPR, COPPA, Privacy Policies
5. **Beta Testing** - Strategien, Feedback sammeln
6. **Review Guidelines** - Was führt zu Rejections

### AI Knowledge Base

```typescript
interface AIKnowledgeBase {
  // Ständig aktualisierte Daten
  googlePlayPolicies: PolicyDocument[];      // Alle Google Play Policies
  appleGuidelines: GuidelineDocument[];      // Apple Review Guidelines
  commonRejectionReasons: RejectionPattern[];
  storeRequirements: {
    android: AndroidRequirements;
    ios: IOSRequirements;
  };

  // Best Practices
  screenshotTemplates: ScreenshotTemplate[];
  asoStrategies: ASOStrategy[];
  pricingStrategies: PricingGuide[];

  // Legal Templates
  privacyPolicyTemplates: LegalTemplate[];
  termsTemplates: LegalTemplate[];

  // Troubleshooting
  errorDatabase: ErrorSolution[];
  reviewAppealTemplates: AppealTemplate[];
}
```

### Conversation Flows

#### Flow 1: Neues Projekt starten
```
User: "Ich will meine App launchen"

AI: "Super! Lass uns dein App-Projekt einrichten. 🚀

Zunächst ein paar Fragen:
1. Welche Plattformen? [Android] [iOS] [Beide]
2. Hast du schon Developer Accounts?
3. Was für eine App ist es? (Game, Productivity, Social, etc.)

Basierend darauf erstelle ich dir eine personalisierte Launch-Checkliste!"
```

#### Flow 2: Problem lösen
```
User: "Meine App wurde von Apple rejected"

AI: "Das passiert den Besten! Lass mich dir helfen.

Kannst du mir den Rejection-Grund zeigen?
[Screenshot hochladen] oder [Text einfügen]

Ich analysiere das und zeige dir genau:
- Warum das passiert ist
- Wie du es fixst
- Einen Appeal-Text falls nötig"
```

#### Flow 3: Proaktive Hilfe
```
AI: "Hey! Mir ist aufgefallen, dass deine App Kamera-Zugriff
benötigt, aber du hast noch keine Privacy Policy die das erklärt.

Das wird zu einer Rejection führen!

Soll ich dir eine passende Privacy Policy generieren?
Ich kenne die Anforderungen für iOS und Android."
```

---

## 📋 Feature-Module im Detail

### 1. 🎯 Project Dashboard

```typescript
interface AppProject {
  id: string;
  name: string;
  platforms: ('android' | 'ios')[];
  status: LaunchStatus;

  // Progress Tracking
  checklist: ChecklistItem[];
  completionPercentage: number;

  // Store Connections
  googlePlayApp?: GooglePlayConnection;
  appStoreApp?: AppStoreConnection;

  // Assets
  assets: ProjectAssets;

  // Timeline
  targetLaunchDate?: Date;
  milestones: Milestone[];
}

type LaunchStatus =
  | 'setup'           // Projekt einrichten
  | 'preparing'       // Assets & Compliance vorbereiten
  | 'beta'            // Beta Testing
  | 'review'          // Im Store Review
  | 'approved'        // Genehmigt, nicht live
  | 'live'            // Veröffentlicht
  | 'updating';       // Update in Arbeit
```

**UI: Kanban-Board Style**
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│   Setup     │  Preparing  │    Beta     │    Live     │
├─────────────┼─────────────┼─────────────┼─────────────┤
│ [FitApp]    │ [PhotoEdit] │ [GameX]     │ [TodoPro]   │
│ 15% ████░░░ │ 67% █████░░ │ 89% ██████░ │ ✅ v1.2.0   │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### 2. 🔐 Credentials Manager

Sichere Verwaltung aller API-Keys und Zertifikate:

```typescript
interface CredentialsVault {
  // Google Play
  googlePlay: {
    serviceAccountJson: EncryptedFile;    // API Zugang
    signingKey: EncryptedFile;            // Upload Key
    keystoreFile: EncryptedFile;          // App Signing
  };

  // Apple
  apple: {
    apiKey: EncryptedFile;                // App Store Connect API
    certificates: Certificate[];           // Distribution Certs
    provisioningProfiles: Profile[];      // Provisioning
    pushCertificate?: EncryptedFile;      // Push Notifications
  };

  // Third Party
  thirdParty: {
    firebase?: FirebaseConfig;
    oneSignal?: OneSignalConfig;
    amplitude?: AmplitudeConfig;
    // ... weitere Integrationen
  };
}
```

**AI-Assisted Setup:**
```
AI: "Lass uns deinen Google Play API-Zugang einrichten.

Schritt 1: Geh zur Google Cloud Console
[Link: console.cloud.google.com]

Schritt 2: Erstelle ein Service Account
Ich zeige dir genau welche Berechtigungen du brauchst...

[Screenshot mit markierten Bereichen]

Hast du die JSON-Datei? Dann lad sie hier hoch -
ich überprüfe ob alles korrekt ist."
```

### 3. 🖼️ Asset Studio

Automatische Generierung von Store-Assets:

```typescript
interface AssetStudio {
  // Screenshots
  screenshots: {
    generate: (sourceScreenshot: Image, devices: Device[]) => Screenshot[];
    addFrames: (screenshot: Image, frameStyle: FrameStyle) => Image;
    addText: (screenshot: Image, text: string, style: TextStyle) => Image;
    batchProcess: (screenshots: Image[], template: Template) => Image[];
  };

  // App Icon
  icon: {
    generateSizes: (source: Image) => IconSet;  // Alle benötigten Größen
    checkGuidelines: (icon: Image) => GuidelineCheck;
    suggestions: (icon: Image) => IconSuggestion[];
  };

  // Feature Graphic (Android)
  featureGraphic: {
    templates: Template[];
    generate: (appInfo: AppInfo, style: Style) => Image;
  };

  // Preview Video
  video: {
    recordSimulator: () => Video;
    addCaptions: (video: Video, captions: Caption[]) => Video;
    optimizeForStore: (video: Video) => Video;
  };
}
```

**Erforderliche Größen (auto-generiert):**
```
Android:
├── Phone: 1080x1920, 1080x2160, 1080x2340
├── Tablet 7": 1200x1920
├── Tablet 10": 1600x2560
├── Feature Graphic: 1024x500
└── Icon: 512x512

iOS:
├── iPhone 6.7": 1290x2796
├── iPhone 6.5": 1284x2778
├── iPhone 5.5": 1242x2208
├── iPad Pro 12.9": 2048x2732
├── iPad Pro 11": 1668x2388
└── Icon: 1024x1024
```

### 4. 📜 Compliance Center

Automatische Generierung aller rechtlichen Dokumente:

```typescript
interface ComplianceCenter {
  // Dokumente
  documents: {
    privacyPolicy: {
      generate: (appInfo: AppInfo, dataUsage: DataUsage) => Document;
      checkCompliance: (policy: Document) => ComplianceReport;
      hostOnLaunchpad: (policy: Document) => URL;
    };

    termsOfService: {
      generate: (appInfo: AppInfo) => Document;
      customize: (template: Template, options: Options) => Document;
    };

    dataRetention: {
      generate: (dataTypes: DataType[]) => Document;
    };
  };

  // Checks
  checks: {
    gdprCompliance: (app: AppInfo) => ComplianceCheck;
    coppaCompliance: (app: AppInfo) => ComplianceCheck;
    ccpaCompliance: (app: AppInfo) => ComplianceCheck;
    appTrackingTransparency: (app: AppInfo) => ComplianceCheck;
  };

  // Data Safety (Android)
  dataSafety: {
    wizard: () => DataSafetyForm;
    generateAnswers: (appAnalysis: AppAnalysis) => DataSafetyAnswers;
  };

  // App Privacy (iOS)
  appPrivacy: {
    wizard: () => AppPrivacyForm;
    generateLabels: (appAnalysis: AppAnalysis) => PrivacyLabels;
  };
}
```

**AI-Guided Flow:**
```
AI: "Lass uns deine Privacy Policy erstellen.

Ich habe deine App analysiert und festgestellt:
✅ Du sammelst E-Mail-Adressen (für Login)
✅ Du nutzt Analytics (Firebase)
⚠️ Du greifst auf Kamera zu
⚠️ Du speicherst Fotos

Basierend darauf generiere ich jetzt eine
GDPR-konforme Privacy Policy...

[Generierte Policy anzeigen]

Du kannst sie direkt bei uns hosten:
https://launchpad.app/privacy/your-app

Oder herunterladen und selbst hosten."
```

### 5. 🧪 Beta Testing Hub

Zentrale Steuerung für TestFlight & Google Play Beta:

```typescript
interface BetaHub {
  // Tester Management
  testers: {
    groups: TesterGroup[];
    inviteByEmail: (emails: string[], group: TesterGroup) => void;
    inviteByLink: (group: TesterGroup) => InviteLink;
    manageFeedback: (testerId: string) => Feedback[];
  };

  // Builds
  builds: {
    upload: (file: File, platform: Platform) => Build;
    distribute: (build: Build, groups: TesterGroup[]) => Distribution;
    trackInstalls: (build: Build) => InstallStats;
  };

  // Feedback
  feedback: {
    collect: InAppFeedback;
    crashReports: CrashReport[];
    surveys: Survey[];
    analyze: (feedback: Feedback[]) => FeedbackAnalysis;
  };

  // TestFlight specific
  testFlight: {
    externalTesting: ExternalTestConfig;
    betaAppReview: ReviewStatus;
    buildExpiration: Date;
  };

  // Google Play specific
  googlePlayBeta: {
    tracks: ('internal' | 'alpha' | 'beta' | 'production')[];
    rolloutPercentage: number;
    countries: Country[];
  };
}
```

**Dashboard:**
```
┌─────────────────────────────────────────────────────────┐
│  Beta Testing Dashboard - MyApp v1.0.0-beta.5           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📱 TestFlight          📱 Google Play Internal         │
│  ━━━━━━━━━━━━━━━        ━━━━━━━━━━━━━━━━━━━━           │
│  Testers: 47/100        Testers: 23/unlimited          │
│  Installs: 42           Installs: 19                    │
│  Crashes: 3             Crashes: 1                      │
│  Rating: 4.2 ⭐         Rating: 4.5 ⭐                  │
│                                                         │
│  Recent Feedback:                                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │ "App crashes when I upload large photos" - Tom  │   │
│  │ "Love the new design!" - Sarah                  │   │
│  │ "Dark mode please?" - 5 users                   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [Analyze Feedback with AI] [Send Update] [Go Live]    │
└─────────────────────────────────────────────────────────┘
```

### 6. 🚀 Release Manager

Der komplette Release-Prozess an einem Ort:

```typescript
interface ReleaseManager {
  // Release erstellen
  createRelease: {
    version: (semver: string) => Release;
    generateChangelog: (commits: Commit[]) => Changelog;
    localizeChangelog: (changelog: Changelog, languages: Language[]) => LocalizedChangelog;
  };

  // Store Listings
  storeListing: {
    title: LocalizedText;           // max 30 chars
    shortDescription: LocalizedText; // max 80 chars
    fullDescription: LocalizedText;  // max 4000 chars
    keywords: string[];              // iOS only
    category: Category;
    contentRating: ContentRating;

    // AI-Hilfe
    generateDescription: (appInfo: AppInfo) => Description;
    optimizeForASO: (listing: StoreListing) => ASOSuggestions;
    translateListing: (listing: StoreListing, languages: Language[]) => LocalizedListing;
  };

  // Submission
  submit: {
    preflight: (release: Release) => PreflightCheck[];
    submitToReview: (release: Release) => Submission;
    trackReviewStatus: (submission: Submission) => ReviewStatus;
    handleRejection: (rejection: Rejection) => RejectionAnalysis;
    appeal: (rejection: Rejection, reason: string) => Appeal;
  };

  // Post-Release
  postRelease: {
    stagedRollout: (percentage: number) => Rollout;
    monitorCrashes: () => CrashMonitor;
    respondToReviews: (review: Review) => Response;
  };
}
```

**Pre-Submit Checklist (AI-Generated):**
```
┌─────────────────────────────────────────────────────────┐
│  🚀 Release Preflight Check - v1.0.0                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Store Listing                                          │
│  ✅ App Title (28/30 chars)                             │
│  ✅ Short Description (76/80 chars)                     │
│  ✅ Full Description (2,847/4,000 chars)                │
│  ✅ Screenshots - All sizes uploaded                    │
│  ✅ App Icon - Meets guidelines                         │
│  ⚠️ Keywords - Could be optimized (AI Suggestions)      │
│                                                         │
│  Compliance                                             │
│  ✅ Privacy Policy URL - Active                         │
│  ✅ Data Safety Form - Complete                         │
│  ✅ Content Rating - Completed                          │
│  ✅ App Category - Set                                  │
│                                                         │
│  Technical                                              │
│  ✅ APK/AAB signed correctly                            │
│  ✅ Version code incremented                            │
│  ✅ Target SDK meets requirements (34+)                 │
│  ⚠️ App size: 89MB (consider optimization)              │
│                                                         │
│  [Fix Issues] [Submit Anyway] [Ask AI for Help]         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔌 Store API Integrations

### Google Play Developer API

```typescript
interface GooglePlayIntegration {
  // Authentifizierung
  auth: {
    connectServiceAccount: (jsonKey: string) => Connection;
    validateConnection: () => boolean;
  };

  // App Management
  apps: {
    list: () => App[];
    create: (packageName: string) => App;
    getDetails: (packageName: string) => AppDetails;
  };

  // Releases
  releases: {
    uploadBundle: (aab: File) => UploadResult;
    createRelease: (track: Track, release: ReleaseConfig) => Release;
    updateReleaseNotes: (release: Release, notes: LocalizedText) => void;
    rollout: (release: Release, percentage: number) => void;
  };

  // Reviews
  reviews: {
    list: (packageName: string) => Review[];
    reply: (reviewId: string, reply: string) => void;
  };

  // Analytics
  analytics: {
    getInstalls: (period: DateRange) => InstallStats;
    getCrashes: (period: DateRange) => CrashStats;
    getRatings: (period: DateRange) => RatingStats;
  };
}
```

### App Store Connect API

```typescript
interface AppStoreConnectIntegration {
  // Authentifizierung (JWT-based)
  auth: {
    configureAPIKey: (keyId: string, issuerId: string, privateKey: string) => Connection;
    validateConnection: () => boolean;
  };

  // App Management
  apps: {
    list: () => App[];
    getDetails: (appId: string) => AppDetails;
    updateMetadata: (appId: string, metadata: AppMetadata) => void;
  };

  // Builds & TestFlight
  builds: {
    list: (appId: string) => Build[];
    getProcessingStatus: (buildId: string) => ProcessingStatus;
    submitForBetaReview: (buildId: string) => BetaSubmission;
  };

  // Versions & Submissions
  versions: {
    create: (appId: string, version: string) => AppVersion;
    submitForReview: (versionId: string) => Submission;
    getReviewStatus: (versionId: string) => ReviewStatus;
  };

  // TestFlight
  testFlight: {
    getBetaTesters: (appId: string) => BetaTester[];
    inviteTesters: (appId: string, emails: string[]) => void;
    createBetaGroup: (appId: string, name: string) => BetaGroup;
  };

  // Analytics
  analytics: {
    getSalesAndTrends: (appId: string, period: DateRange) => SalesData;
  };
}
```

---

## 🎨 UI/UX Design

### Haupt-Navigation

```
┌─────────────────────────────────────────────────────────────────┐
│  🚀 LaunchPad                           [Search] [?] [Profile]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐                                                │
│  │ 📊 Dashboard│ ← Existing                                     │
│  ├─────────────┤                                                │
│  │ 🚀 App      │ ← NEW: Hauptfeature                           │
│  │    Launch   │                                                │
│  │   ├─ 🤖 AI  │                                                │
│  │   ├─ 📱 Apps│                                                │
│  │   ├─ 🔐 Keys│                                                │
│  │   ├─ 🖼️ Asset│                                               │
│  │   ├─ 📜 Legal│                                               │
│  │   ├─ 🧪 Beta│                                                │
│  │   └─ 📈 Live│                                                │
│  ├─────────────┤                                                │
│  │ 👥 Creators │ ← Existing                                     │
│  │ ✅ Tasks    │                                                │
│  │ ⚙️ Settings │                                                │
│  └─────────────┘                                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### AI Assistant Interface

```
┌─────────────────────────────────────────────────────────────────┐
│  🤖 Launch Assistant                              [New Chat] ⚙️  │
├───────────────────────────────────┬─────────────────────────────┤
│                                   │                             │
│  Chat History                     │  Current Project: FitApp    │
│  ─────────────                    │  Platform: Android + iOS    │
│  📱 FitApp Setup                  │  Status: Preparing (67%)    │
│  ⚠️ PhotoEdit Rejection          │                             │
│  ✅ GameX Launched               │  ─────────────────────────   │
│                                   │                             │
│                                   │  🤖 Hi! Ich sehe du         │
│                                   │  arbeitest an FitApp.       │
│                                   │                             │
│                                   │  Dein nächster Schritt:     │
│                                   │  Screenshots erstellen.     │
│                                   │                             │
│                                   │  Soll ich dir dabei helfen? │
│                                   │                             │
│                                   │  [Ja, Screenshots] [Andere] │
│                                   │                             │
│                                   │  ─────────────────────────   │
│                                   │                             │
│                                   │  Du: "Ich brauche Hilfe     │
│                                   │  mit den iOS Screenshots"   │
│                                   │                             │
│                                   │  🤖 Klar! Für iOS brauchst  │
│                                   │  du Screenshots in diesen   │
│                                   │  Größen:                    │
│                                   │  • iPhone 6.7" (1290×2796)  │
│                                   │  • iPhone 6.5" (1284×2778)  │
│                                   │  • iPad 12.9" (2048×2732)   │
│                                   │                             │
│                                   │  [Upload Screenshots]       │
│                                   │  [Auto-Generate from 1]     │
│                                   │                             │
├───────────────────────────────────┴─────────────────────────────┤
│  💬 Type your message...                            [Send] 📎   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technische Implementierung

### Tech Stack

```typescript
// AI Assistant
const aiStack = {
  model: "Claude 3.5 Sonnet",  // Oder GPT-4
  vectorDB: "Pinecone",         // Für Knowledge Base
  embedding: "text-embedding-3-small",

  // System Prompt Komponenten
  systemPrompt: {
    persona: LAUNCH_ASSISTANT_PERSONA,
    knowledge: STORE_GUIDELINES_KNOWLEDGE,
    tools: AVAILABLE_TOOLS,
    context: USER_PROJECT_CONTEXT,
  }
};

// API Integrationen
const integrations = {
  googlePlay: "@googleapis/androidpublisher",
  appStoreConnect: "app-store-connect-api", // Custom implementation
  imageProcessing: "sharp",
  pdfGeneration: "puppeteer",
};

// Frontend
const frontend = {
  chat: "Vercel AI SDK",
  streaming: true,
  fileUpload: "tus-js-client",  // Resumable uploads
};
```

### Datenbank-Erweiterungen

```sql
-- App Projects
CREATE TABLE app_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  package_name text,  -- com.company.app
  bundle_id text,     -- iOS Bundle ID
  platforms text[] DEFAULT '{}',
  status text DEFAULT 'setup',
  target_launch_date timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Project Checklist
CREATE TABLE project_checklist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES app_projects(id) ON DELETE CASCADE,
  category text NOT NULL,  -- 'store_listing', 'compliance', 'assets', etc.
  item_key text NOT NULL,
  title text NOT NULL,
  description text,
  is_required boolean DEFAULT true,
  is_completed boolean DEFAULT false,
  completed_at timestamptz,
  completed_by uuid REFERENCES auth.users(id)
);

-- Store Credentials (encrypted)
CREATE TABLE store_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  platform text NOT NULL,  -- 'google_play', 'app_store'
  credential_type text NOT NULL,
  encrypted_data bytea NOT NULL,  -- Verschlüsselt mit org-spezifischem Key
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- AI Conversations
CREATE TABLE ai_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  project_id uuid REFERENCES app_projects(id) ON DELETE SET NULL,
  user_id uuid REFERENCES auth.users(id),
  title text,
  messages jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Asset Library
CREATE TABLE project_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES app_projects(id) ON DELETE CASCADE,
  asset_type text NOT NULL,  -- 'screenshot', 'icon', 'feature_graphic', 'video'
  platform text,
  device_type text,
  file_path text NOT NULL,
  dimensions jsonb,  -- {width, height}
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Beta Testers
CREATE TABLE beta_testers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES app_projects(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text,
  platform text,  -- 'android', 'ios', 'both'
  group_name text,
  status text DEFAULT 'invited',  -- 'invited', 'active', 'inactive'
  feedback_count integer DEFAULT 0,
  invited_at timestamptz DEFAULT now()
);

-- Release History
CREATE TABLE releases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES app_projects(id) ON DELETE CASCADE,
  platform text NOT NULL,
  version_name text NOT NULL,
  version_code integer,
  status text DEFAULT 'draft',
  track text,  -- 'internal', 'alpha', 'beta', 'production'
  changelog jsonb,  -- Localized
  submitted_at timestamptz,
  reviewed_at timestamptz,
  released_at timestamptz,
  created_at timestamptz DEFAULT now()
);
```

---

## 📊 Business Model Integration

### Pricing Tiers

```
┌─────────────────┬─────────────────┬─────────────────┐
│    Starter      │  Professional   │   Enterprise    │
│    €49/mo       │    €149/mo      │    Custom       │
├─────────────────┼─────────────────┼─────────────────┤
│ 1 App Project   │ 5 App Projects  │ Unlimited       │
│ Basic AI Chat   │ Advanced AI     │ Priority AI     │
│ Manual Uploads  │ API Integration │ Full Automation │
│ 5 Beta Testers  │ 100 Testers     │ Unlimited       │
│ Basic Templates │ All Templates   │ Custom Templates│
│                 │ ASO Tools       │ White-Label     │
│                 │ Priority Support│ Dedicated CSM   │
└─────────────────┴─────────────────┴─────────────────┘
```

### Add-Ons

- **Extra App Project**: €19/mo
- **Screenshot Design Service**: €99 one-time
- **Expedited Review Help**: €49 per submission
- **Translation Pack**: €29 per language

---

## 🚀 Implementation Roadmap

### Phase 1: Foundation (2 Wochen)
- [ ] Datenbank-Tabellen erstellen
- [ ] Basic App Project CRUD
- [ ] Navigation & UI Shell
- [ ] AI Chat Interface (ohne Knowledge)

### Phase 2: AI Integration (2 Wochen)
- [ ] Claude/GPT Integration
- [ ] Knowledge Base aufbauen (Store Guidelines)
- [ ] Conversation Flows implementieren
- [ ] Context-aware Responses

### Phase 3: Store Integrations (3 Wochen)
- [ ] Google Play Developer API
- [ ] App Store Connect API
- [ ] Credentials Manager
- [ ] Build Upload

### Phase 4: Asset Studio (2 Wochen)
- [ ] Screenshot Generator
- [ ] Icon Size Generator
- [ ] Frame & Text Overlays
- [ ] Batch Processing

### Phase 5: Compliance & Beta (2 Wochen)
- [ ] Privacy Policy Generator
- [ ] Data Safety Wizard
- [ ] Beta Tester Management
- [ ] Feedback Collection

### Phase 6: Release Manager (2 Wochen)
- [ ] Pre-flight Checks
- [ ] Submission Flow
- [ ] Review Status Tracking
- [ ] Post-Release Monitoring

---

## 🎯 Success Metrics

```
KPIs to Track:
- Apps successfully launched per month
- Average time from setup to live
- Review rejection rate (aim: <10%)
- User satisfaction score
- AI conversation completion rate
- Feature adoption rate
```

---

## 💡 Unique Selling Points

1. **Erster AI-First App Launch Assistant**
   - Kein anderes Tool hat einen spezialisierten AI für App-Publishing

2. **Unified Dashboard**
   - Android + iOS an einem Ort (sonst 2 verschiedene Consoles)

3. **Proaktive Fehlervermeidung**
   - AI warnt vor Rejection-Gründen BEVOR man submitted

4. **One-Click Compliance**
   - Privacy Policy, Terms, Data Safety - alles generiert

5. **Learn as you go**
   - Jeder Launch macht den User zum besseren Publisher

---

## 🔮 Future Vision

- **Auto-Publish**: App hochladen → AI macht alles automatisch
- **Multi-Platform**: Web Apps (PWA), Desktop, Konsolen
- **Marketing Integration**: ASO + Ads Optimization
- **Revenue Analytics**: Unified Dashboard für Einnahmen
- **Community**: Indie Dev Network für Feedback & Support

---

*"Vibe-Coding bringt die App, LaunchPad bringt sie in die Welt."*
