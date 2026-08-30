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
          Merknad om kostnadsfordelingen per avdeling
        </h2>
        <p style={{ maxWidth: 780, lineHeight: 1.6, margin: "0 0 12px" }}>
          En gjennomgang i Tripletex (30. august 2026) viser at kostnadsbildet per
          avdeling ovenfor kan være skjevt: av 151 leverandørfakturaer bokført hittil i
          2026 mangler <strong>118 (ca. 78 %)</strong> avdelingstagg helt. Dermed er ikke
          alle kostnader korrekt fordelt mellom sentralbordets avdelinger i tallene
          over.
        </p>
        <p style={{ maxWidth: 780, lineHeight: 1.6, margin: "0 0 12px" }}>
          Foreslått fordelingsregel for opprydding: fakturaer fra Telenor, samt
          fakturaer med kostnadslinje på konto 4300 (innkjøp varer), tagges{" "}
          <strong>04 VPN</strong> — øvrige leverandørfakturaer tagges{" "}
          <strong>03 Svartjeneste</strong>. Med denne regelen fordeler de 151
          fakturaene seg som 17 → 04 VPN og 134 → 03 Svartjeneste.
        </p>
        <p style={{ maxWidth: 780, lineHeight: 1.6, margin: 0, opacity: 0.85 }}>
          Selve taggingen må gjøres manuelt i Tripletex og er ikke utført ennå
          (avklares med regnskapsfører). Tallene i presentasjonen over bør derfor leses
          med dette forbeholdet inntil retting er gjennomført.
        </p>
      </div>
    </div>
  );
}
