import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  pdf,
  Font,
} from "@react-pdf/renderer";

// Prometheus Logo URL (from public folder)
const PROMETHEUS_LOGO = "/logo-prometheus.png";

// Register Inter font (using system fonts as fallback)
Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiJ-Ek-_EeA.woff2",
      fontWeight: 600,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiJ-Ek-_EeA.woff2",
      fontWeight: 700,
    },
  ],
});

// Styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 10,
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 50,
    lineHeight: 1.5,
    color: "#1a1a1a",
  },
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 3,
    borderBottomColor: "#f97316",
  },
  logo: {
    width: 180,
    height: 36,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: "#1a1a1a",
  },
  subtitle: {
    fontSize: 9,
    color: "#666666",
    marginTop: 2,
  },
  // Document info box
  infoBox: {
    backgroundColor: "#fef3e6",
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  infoItem: {
    width: "50%",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 8,
    color: "#92400e",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 10,
    fontWeight: 600,
    color: "#1a1a1a",
  },
  // Section headers
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#f97316",
    marginTop: 18,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#fed7aa",
  },
  sectionSubtitle: {
    fontSize: 10,
    fontWeight: 600,
    color: "#1a1a1a",
    marginTop: 12,
    marginBottom: 6,
  },
  // Text
  paragraph: {
    marginBottom: 8,
    textAlign: "justify",
  },
  bold: {
    fontWeight: 600,
  },
  // Lists
  list: {
    marginLeft: 12,
    marginBottom: 8,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 4,
  },
  bullet: {
    width: 12,
    fontSize: 10,
  },
  listText: {
    flex: 1,
  },
  // Highlight box
  highlight: {
    backgroundColor: "#fef3e6",
    borderLeftWidth: 3,
    borderLeftColor: "#f97316",
    padding: 10,
    marginVertical: 10,
    borderRadius: 4,
  },
  highlightText: {
    fontWeight: 600,
    color: "#ea580c",
  },
  // Table
  table: {
    marginVertical: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f97316",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableHeaderCell: {
    flex: 1,
    padding: 8,
    color: "#ffffff",
    fontWeight: 600,
    fontSize: 9,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  tableRowAlt: {
    backgroundColor: "#fafafa",
  },
  tableCell: {
    flex: 1,
    padding: 8,
    fontSize: 9,
  },
  // Signature section
  signatureSection: {
    marginTop: 30,
  },
  signatureGrid: {
    flexDirection: "row",
    gap: 30,
    marginTop: 16,
  },
  signatureBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 6,
    padding: 16,
  },
  signatureTitle: {
    fontSize: 9,
    fontWeight: 600,
    color: "#666666",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
    height: 40,
    marginBottom: 4,
  },
  signatureLabel: {
    fontSize: 8,
    color: "#666666",
    marginBottom: 12,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 50,
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: "#666666",
  },
  footerLink: {
    color: "#f97316",
  },
  // Page number
  pageNumber: {
    position: "absolute",
    bottom: 30,
    right: 50,
    fontSize: 8,
    color: "#999999",
  },
});

// Contract data interface
export interface ContractData {
  contractId: string;
  contractDate: string;
  creatorName: string;
  creatorLegalName: string;
  creatorHandle: string;
  creatorEmail: string;
  commissionRate: number;
}

// Commission table data
const commissionTable = [
  { subscription: "Weekly Premium", price: "$1.99", net: "$1.39" },
  { subscription: "Weekly Elite", price: "$2.99", net: "$2.09" },
  { subscription: "Monthly Premium", price: "$5.99", net: "$4.19" },
  { subscription: "Monthly Elite", price: "$9.99", net: "$6.99" },
  { subscription: "Yearly Premium", price: "$59.00", net: "$41.30" },
  { subscription: "Yearly Elite", price: "$99.00", net: "$69.30" },
];

// Calculate commission for table
const getCommission = (net: string, rate: number) => {
  const netValue = parseFloat(net.replace("$", ""));
  return `$${(netValue * (rate / 100)).toFixed(2)}`;
};

// List Item component
const ListItem = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.listItem}>
    <Text style={styles.bullet}>•</Text>
    <Text style={styles.listText}>{children}</Text>
  </View>
);

// Contract PDF Document
export const ContractPdfDocument = ({ data }: { data: ContractData }) => (
  <Document>
    {/* Page 1 */}
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Image style={styles.logo} src={PROMETHEUS_LOGO} />
        <View style={styles.headerText}>
          <Text style={styles.title}>Creator Partnership Agreement</Text>
          <Text style={styles.subtitle}>
            PeakForce OÜ • www.prometheus.coach
          </Text>
        </View>
      </View>

      {/* Document Info */}
      <View style={styles.infoBox}>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Agreement Date</Text>
            <Text style={styles.infoValue}>{data.contractDate}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Agreement ID</Text>
            <Text style={styles.infoValue}>{data.contractId}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Creator Name</Text>
            <Text style={styles.infoValue}>{data.creatorName}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Creator Handle</Text>
            <Text style={styles.infoValue}>{data.creatorHandle}</Text>
          </View>
        </View>
      </View>

      {/* Section 1: Parties */}
      <Text style={styles.sectionTitle}>1. Parties</Text>
      <Text style={styles.paragraph}>
        This Creator Partnership Agreement ("Agreement") is entered into between:
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Company: </Text>
        PeakForce OÜ, a company registered in Estonia (Registry Code: 16768488),
        operating the Prometheus fitness platform ("Prometheus", "Company", "we",
        "us")
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Creator: </Text>
        {data.creatorLegalName}, known as {data.creatorHandle} on social media
        platforms ("Creator", "Partner", "you")
      </Text>

      {/* Section 2: Definitions */}
      <Text style={styles.sectionTitle}>2. Definitions</Text>
      <View style={styles.list}>
        <ListItem>
          <Text style={styles.bold}>"Referral"</Text> means any new user who
          signs up for Prometheus using the Creator's unique referral code or
          link.
        </ListItem>
        <ListItem>
          <Text style={styles.bold}>"Qualifying Purchase"</Text> means any paid
          subscription purchased by a Referral through the Prometheus app.
        </ListItem>
        <ListItem>
          <Text style={styles.bold}>"Net Revenue"</Text> means the gross purchase
          price minus applicable app store fees (typically 15-30%).
        </ListItem>
        <ListItem>
          <Text style={styles.bold}>"Commission"</Text> means the percentage of
          Net Revenue payable to Creator for Qualifying Purchases.
        </ListItem>
        <ListItem>
          <Text style={styles.bold}>"Content"</Text> means any promotional
          materials, posts, videos, or other media created by Creator mentioning
          Prometheus.
        </ListItem>
      </View>

      {/* Section 3: Commission Structure */}
      <Text style={styles.sectionTitle}>3. Commission Structure</Text>

      <View style={styles.highlight}>
        <Text style={styles.highlightText}>
          Commission Rate: {data.commissionRate}% of Net Revenue
        </Text>
        <Text style={{ marginTop: 4 }}>
          Commissions are recurring for as long as your Referrals maintain their
          paid subscriptions.
        </Text>
      </View>

      <Text style={styles.sectionSubtitle}>3.1 Commission Calculation</Text>
      <Text style={styles.paragraph}>
        Commission = Gross Price × 0.70 (after App Store) × {data.commissionRate}%
      </Text>

      <Text style={styles.sectionSubtitle}>3.2 Commission Table</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>Subscription</Text>
          <Text style={styles.tableHeaderCell}>Price</Text>
          <Text style={styles.tableHeaderCell}>Net (after 30%)</Text>
          <Text style={styles.tableHeaderCell}>
            Your {data.commissionRate}%
          </Text>
        </View>
        {commissionTable.map((row, i) => (
          <View
            key={i}
            style={i % 2 === 1 ? [styles.tableRow, styles.tableRowAlt] : styles.tableRow}
          >
            <Text style={styles.tableCell}>{row.subscription}</Text>
            <Text style={styles.tableCell}>{row.price}</Text>
            <Text style={styles.tableCell}>{row.net}</Text>
            <Text style={styles.tableCell}>
              {getCommission(row.net, data.commissionRate)}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionSubtitle}>3.3 Payment Terms</Text>
      <View style={styles.list}>
        <ListItem>
          <Text style={styles.bold}>Minimum Payout:</Text> $50 USD (balances
          below this roll over)
        </ListItem>
        <ListItem>
          <Text style={styles.bold}>Payment Schedule:</Text> Monthly, within 15
          days after month end
        </ListItem>
        <ListItem>
          <Text style={styles.bold}>Payment Methods:</Text> Bank transfer
          (SEPA/SWIFT) or Revolut
        </ListItem>
        <ListItem>
          <Text style={styles.bold}>Currency:</Text> USD (converted at payment
          date rate)
        </ListItem>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          PeakForce OÜ • Registry Code: 16768488 • Tallinn, Estonia
        </Text>
        <Text style={styles.footerText}>
          <Text style={styles.footerLink}>www.prometheus.coach</Text> •
          creators@prometheus.coach
        </Text>
      </View>
      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        fixed
      />
    </Page>

    {/* Page 2 */}
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Image style={styles.logo} src={PROMETHEUS_LOGO} />
        <View style={styles.headerText}>
          <Text style={styles.title}>Creator Partnership Agreement</Text>
          <Text style={styles.subtitle}>
            {data.creatorName} • {data.contractId}
          </Text>
        </View>
      </View>

      {/* Section 4: Creator Obligations */}
      <Text style={styles.sectionTitle}>4. Creator Obligations</Text>

      <Text style={styles.sectionSubtitle}>4.1 Content Requirements</Text>
      <View style={styles.list}>
        <ListItem>Create authentic, honest content about Prometheus</ListItem>
        <ListItem>
          Clearly disclose the partnership relationship in accordance with FTC
          guidelines (#ad, #sponsored, #partner)
        </ListItem>
        <ListItem>
          Not make false, misleading, or unsubstantiated claims about the app
        </ListItem>
        <ListItem>
          Not engage in deceptive practices to generate referrals (fake accounts,
          bots, incentivized installs)
        </ListItem>
      </View>

      <Text style={styles.sectionSubtitle}>4.2 Brand Guidelines</Text>
      <View style={styles.list}>
        <ListItem>
          Use Prometheus branding assets only as provided and approved
        </ListItem>
        <ListItem>
          Not modify, distort, or alter the Prometheus logo or brand elements
        </ListItem>
        <ListItem>
          Maintain a professional image consistent with Prometheus brand values
        </ListItem>
      </View>

      <Text style={styles.sectionSubtitle}>4.3 Prohibited Activities</Text>
      <View style={styles.list}>
        <ListItem>
          Use paid advertising competing with Prometheus's own advertising
        </ListItem>
        <ListItem>
          Bid on Prometheus brand terms in search advertising without permission
        </ListItem>
        <ListItem>Send unsolicited bulk messages or spam</ListItem>
        <ListItem>
          Create content that is offensive, discriminatory, or harmful
        </ListItem>
        <ListItem>
          Misrepresent the relationship with Prometheus
        </ListItem>
      </View>

      {/* Section 5: Company Obligations */}
      <Text style={styles.sectionTitle}>5. Company Obligations</Text>
      <View style={styles.list}>
        <ListItem>
          Provide Creator with a unique referral code and tracking link
        </ListItem>
        <ListItem>
          Accurately track and report all Referrals and Qualifying Purchases
        </ListItem>
        <ListItem>Pay commissions in accordance with Section 3</ListItem>
        <ListItem>
          Provide access to a Creator Portal for real-time statistics
        </ListItem>
        <ListItem>
          Notify Creator of material changes with at least 30 days notice
        </ListItem>
        <ListItem>
          Provide marketing materials and brand assets upon request
        </ListItem>
      </View>

      {/* Section 6: Intellectual Property */}
      <Text style={styles.sectionTitle}>6. Intellectual Property</Text>

      <Text style={styles.sectionSubtitle}>6.1 Prometheus IP</Text>
      <Text style={styles.paragraph}>
        All Prometheus trademarks, logos, and brand materials remain the exclusive
        property of PeakForce OÜ. Creator is granted a limited, non-exclusive,
        revocable license to use these materials solely for promoting Prometheus
        under this Agreement.
      </Text>

      <Text style={styles.sectionSubtitle}>6.2 Creator Content</Text>
      <Text style={styles.paragraph}>
        Creator retains ownership of all original Content created. Creator grants
        Prometheus a non-exclusive, royalty-free, worldwide license to use,
        reproduce, and display Creator's Content for marketing purposes, with
        appropriate attribution.
      </Text>

      <Text style={styles.sectionSubtitle}>6.3 Custom Programs</Text>
      <Text style={styles.paragraph}>
        If Creator provides workout programs for inclusion in the Prometheus app:
        Creator retains ownership of the underlying IP; Creator grants Prometheus
        a license to distribute within the app during the term; Programs will be
        clearly attributed to Creator; Upon termination, programs will be removed
        within 30 days.
      </Text>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          PeakForce OÜ • Registry Code: 16768488 • Tallinn, Estonia
        </Text>
      </View>
      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        fixed
      />
    </Page>

    {/* Page 3 */}
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Image style={styles.logo} src={PROMETHEUS_LOGO} />
        <View style={styles.headerText}>
          <Text style={styles.title}>Creator Partnership Agreement</Text>
          <Text style={styles.subtitle}>
            {data.creatorName} • {data.contractId}
          </Text>
        </View>
      </View>

      {/* Section 7: Term and Termination */}
      <Text style={styles.sectionTitle}>7. Term and Termination</Text>

      <Text style={styles.sectionSubtitle}>7.1 Term</Text>
      <Text style={styles.paragraph}>
        This Agreement begins on the date of signature and continues for an
        initial term of 12 months, automatically renewing for successive 12-month
        periods unless terminated.
      </Text>

      <Text style={styles.sectionSubtitle}>7.2 Termination Without Cause</Text>
      <Text style={styles.paragraph}>
        Either party may terminate this Agreement at any time with 30 days written
        notice to the other party.
      </Text>

      <Text style={styles.sectionSubtitle}>7.3 Termination for Cause</Text>
      <Text style={styles.paragraph}>
        Either party may terminate immediately if the other party: materially
        breaches this Agreement and fails to cure within 14 days; engages in
        fraud, illegal activity, or harmful conduct; or becomes insolvent.
      </Text>

      <Text style={styles.sectionSubtitle}>7.4 Effect of Termination</Text>
      <View style={styles.list}>
        <ListItem>Creator's referral code will be deactivated</ListItem>
        <ListItem>
          Final payment for earned commissions within 45 days
        </ListItem>
        <ListItem>
          Creator must cease using Prometheus branding and materials
        </ListItem>
        <ListItem>
          Sections 6, 8, and 9 survive termination
        </ListItem>
      </View>

      {/* Section 8: Confidentiality */}
      <Text style={styles.sectionTitle}>8. Confidentiality</Text>
      <Text style={styles.paragraph}>
        Both parties agree to keep confidential any non-public information
        disclosed during this partnership, including: commission rates and payment
        terms; business strategies and unreleased features; user data and
        analytics; financial information. This obligation survives termination for
        2 years.
      </Text>

      {/* Section 9: Limitation of Liability */}
      <Text style={styles.sectionTitle}>9. Limitation of Liability</Text>
      <Text style={styles.paragraph}>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW: Neither party shall be liable for
        indirect, incidental, special, consequential, or punitive damages.
        Prometheus's total liability shall not exceed the total commissions paid
        in the 12 months preceding the claim. Creator acknowledges that earnings
        depend on factors outside Prometheus's control and are not guaranteed.
      </Text>

      {/* Section 10: General Provisions */}
      <Text style={styles.sectionTitle}>10. General Provisions</Text>
      <View style={styles.list}>
        <ListItem>
          <Text style={styles.bold}>Independent Contractor:</Text> Creator is not
          an employee, agent, or partner. Creator is responsible for own taxes.
        </ListItem>
        <ListItem>
          <Text style={styles.bold}>Assignment:</Text> Creator may not assign
          without written consent. Prometheus may assign in a merger/acquisition.
        </ListItem>
        <ListItem>
          <Text style={styles.bold}>Modifications:</Text> Only in writing signed
          by both parties, or by Prometheus with 30 days notice for non-material
          changes.
        </ListItem>
        <ListItem>
          <Text style={styles.bold}>Governing Law:</Text> Laws of Estonia. Disputes
          resolved through arbitration in Tallinn, Estonia.
        </ListItem>
        <ListItem>
          <Text style={styles.bold}>Entire Agreement:</Text> This constitutes the
          entire agreement and supersedes all prior negotiations.
        </ListItem>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          PeakForce OÜ • Registry Code: 16768488 • Tallinn, Estonia
        </Text>
      </View>
      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        fixed
      />
    </Page>

    {/* Page 4 - Signatures */}
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Image style={styles.logo} src={PROMETHEUS_LOGO} />
        <View style={styles.headerText}>
          <Text style={styles.title}>Creator Partnership Agreement</Text>
          <Text style={styles.subtitle}>
            {data.creatorName} • {data.contractId}
          </Text>
        </View>
      </View>

      {/* Section 11: Signatures */}
      <View style={styles.signatureSection}>
        <Text style={styles.sectionTitle}>11. Signatures</Text>
        <Text style={styles.paragraph}>
          By signing below, both parties agree to be bound by the terms of this
          Agreement.
        </Text>

        <View style={styles.signatureGrid}>
          {/* Prometheus Signature */}
          <View style={styles.signatureBox}>
            <Text style={styles.signatureTitle}>
              For Prometheus (PeakForce OÜ)
            </Text>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Signature</Text>
            <View style={[styles.signatureLine, { height: 20 }]} />
            <Text style={styles.signatureLabel}>Name: Daniele Pauli, CEO</Text>
            <View style={[styles.signatureLine, { height: 20 }]} />
            <Text style={styles.signatureLabel}>Date</Text>
          </View>

          {/* Creator Signature */}
          <View style={styles.signatureBox}>
            <Text style={styles.signatureTitle}>For Creator</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Signature</Text>
            <View style={[styles.signatureLine, { height: 20 }]} />
            <Text style={styles.signatureLabel}>
              Name: {data.creatorLegalName}
            </Text>
            <View style={[styles.signatureLine, { height: 20 }]} />
            <Text style={styles.signatureLabel}>Date</Text>
          </View>
        </View>
      </View>

      {/* Agreement Summary Box */}
      <View style={[styles.highlight, { marginTop: 30 }]}>
        <Text style={styles.highlightText}>Agreement Summary</Text>
        <Text style={{ marginTop: 8 }}>
          Creator: {data.creatorName} ({data.creatorHandle})
        </Text>
        <Text>Commission Rate: {data.commissionRate}% recurring</Text>
        <Text>Agreement ID: {data.contractId}</Text>
        <Text>Agreement Date: {data.contractDate}</Text>
        <Text>Term: 12 months, auto-renewing</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          PeakForce OÜ • Registry Code: 16768488 • Tallinn, Estonia
        </Text>
        <Text style={styles.footerText}>
          <Text style={styles.footerLink}>www.prometheus.coach</Text> •
          creators@prometheus.coach
        </Text>
        <Text style={[styles.footerText, { marginTop: 4 }]}>
          Agreement Version 1.0 • Generated: {new Date().toLocaleDateString()}
        </Text>
      </View>
      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        fixed
      />
    </Page>
  </Document>
);

// Generate PDF blob
export async function generateContractPdf(data: ContractData): Promise<Blob> {
  const blob = await pdf(<ContractPdfDocument data={data} />).toBlob();
  return blob;
}

// Download PDF
export async function downloadContractPdf(data: ContractData): Promise<void> {
  const blob = await generateContractPdf(data);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Prometheus_Creator_Agreement_${data.creatorHandle.replace("@", "")}_${data.contractId}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
