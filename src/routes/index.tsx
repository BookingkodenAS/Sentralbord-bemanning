import { createFileRoute } from "@tanstack/react-router";
import presentationHtml from "../content/presentation.html?raw";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sentralbordet – Lønnsomhet og kapasitetsanalyse Jan–Mai 2026" },
      { name: "description", content: "Privat presentasjon." },
      { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <iframe
        srcDoc={presentationHtml}
        title="Sentralbordet presentasjon"
        style={{ border: 0, width: "100vw", height: "100vh", flexShrink: 0, display: "block" }}
      />
      <div
        style={{
          fontFamily: "Calibri, Arial, sans-serif",
          background: "#1E2761",
          color: "#EAF0FF",
          padding: "32px 48px 48px",
        }}
      >
        <h2 style={{ color: "#F5A623", fontSize: 18, margin: "0 0 12px" }}>
          Merknad om leverandørkostnadene (slide 12)
        </h2>
        <p style={{ maxWidth: 780, lineHeight: 1.6, margin: "0 0 12px" }}>
          Tripletex sine gamle avdelingskoder ga et skjevt/ufullstendig bilde av
          kostnadene (de fleste leverandørfakturaer manglet avdelingstagg helt). Slide 12
          er derfor bygget om 30. august 2026: kostnadene er forenklet til kun{" "}
          <strong>Sentralbordet</strong> og <strong>VPN</strong>, beregnet direkte fra
          Tripletex sine 139 leverandørfakturaer for januar–juli 2026 etter regelen
          Telenor eller konto 4300 (varekjøp) → VPN, øvrige → Sentralbordet. Full
          fakturaliste med denne klassifiseringen ligger i et eget regneark.
        </p>
        <p style={{ maxWidth: 780, lineHeight: 1.6, margin: "0 0 12px", opacity: 0.85 }}>
          Isabel (DIN CONTROLLER AS) bokfører med disse to avdelingene fra og med
          august 2026 — historiske fakturaer rettes ikke manuelt, så tallene over er en
          beregnet (ikke bokført) fordeling frem til bokføringen tar igjen seg selv.
          Skillen som bygger denne oversikten kjører automatisk den 20. hver måned og
          tar da med neste måneds fakturaer (august legges til ved neste kjøring).
        </p>
        <p style={{ maxWidth: 780, lineHeight: 1.6, margin: 0, opacity: 0.7, fontSize: 13 }}>
          Oppdatert 11. september 2026: inntekt, kostnad og resultat er verifisert i
          Tripletex til og med august 2026, anropstatistikken dekker juni–august (egen
          slide 14), og pipeline-tallene er hentet fra Bigin per 11.09. Slide 12
          (leverandørkostnader) dekker fortsatt januar–juli 2026 — augustfakturaene
          kommer inn ved neste automatiske kjøring den 20.
        </p>
      </div>
    </div>
  );
}
