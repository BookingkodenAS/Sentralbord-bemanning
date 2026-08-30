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
    <iframe
      srcDoc={presentationHtml}
      title="Sentralbordet presentasjon"
      style={{ border: 0, width: "100vw", height: "100vh", display: "block" }}
    />
  );
}
