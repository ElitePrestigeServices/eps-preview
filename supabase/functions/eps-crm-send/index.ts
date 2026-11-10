// eps-crm-send (10/11/2026, demande d'Anthony) : écrire / répondre depuis le CRM EPS avec l'adresse contact@elite-prestige-services.fr
// (même canal que le robot de prospection : API Gmail avec l'adresse d'envoi EPS), sans passer par l'appli Gmail du téléphone.
// POST {to, subject, text, contact_id?} — réservé à l'admin EPS connecté (eps_is_admin). Le mail est noté dans les activités du contact.
import postgres from "https://deno.land/x/postgresjs@v3.4.5/mod.js";
const sql = postgres(Deno.env.get("SUPABASE_DB_URL")!, { prepare: false, max: 1 });
const SB = Deno.env.get("SUPABASE_URL")!, ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
const EPS_FROM = "contact@elite-prestige-services.fr", EPS_NAME = "Elite Prestige Services";
const CORS = { "access-control-allow-origin": "*", "access-control-allow-headers": "authorization, apikey, content-type, x-client-info", "access-control-allow-methods": "POST, OPTIONS" };
const json = (d: unknown, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { ...CORS, "content-type": "application/json; charset=utf-8" } });
const enc = new TextEncoder();
const b64 = (s: string) => { const b = enc.encode(s); let x = ""; for (let i = 0; i < b.length; i += 0x8000) x += String.fromCharCode(...b.subarray(i, i + 0x8000)); return btoa(x); };
const b64Mime = (s: string) => (b64(s).match(/.{1,76}/g) || []).join("\r\n");
const b64url = (s: string) => b64(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const encHeader = (s: string) => "=?UTF-8?B?" + b64(s.replace(/[\r\n]/g, " ")) + "?=";
function cleanToken(v: string) { const t = v.trim(); const m = t.match(/1\/\/[A-Za-z0-9_\-]+/); return m ? m[0] : t.replace(/^["']|["']$/g, ""); }
async function gmailToken() {
  const a = (Deno.env.get("GMAIL_CLIENT_ID") || "").trim(), b = (Deno.env.get("GMAIL_CLIENT_SECRET") || "").trim(), c = cleanToken(Deno.env.get("GMAIL_REFRESH_TOKEN") || "");
  if (!a || !b || !c) throw new Error("Connexion Gmail non configurée");
  let last: unknown;
  for (let i = 0; i < 3; i++) {
    const r = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ client_id: a, client_secret: b, refresh_token: c, grant_type: "refresh_token" }) });
    const d = await r.json().catch(() => ({}));
    if (r.ok && d.access_token) return d.access_token as string;
    last = new Error("Connexion Google refusée : " + (d.error_description || d.error || r.status));
    if (/invalid_grant|invalid_client|unauthorized_client/i.test(String(d.error))) break;
    await new Promise((ok) => setTimeout(ok, 3000 * (i + 1)));
  }
  throw last;
}
async function isAdmin(req: Request) {
  const auth = req.headers.get("authorization") || "";
  if (!/^Bearer /.test(auth)) return false;
  const r = await fetch(SB + "/rest/v1/rpc/eps_is_admin", { method: "POST", headers: { authorization: auth, apikey: ANON, "content-type": "application/json" }, body: "{}" });
  return r.ok && (await r.json().catch(() => false)) === true;
}
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
  if (req.method !== "POST") return json({ error: "POST" }, 405);
  try {
    if (!(await isAdmin(req))) return json({ error: "Accès réservé à l'administrateur" }, 401);
    const b = await req.json().catch(() => ({}));
    const to = String(b.to || "").trim().toLowerCase(), subject = String(b.subject || "").replace(/[\r\n]/g, " ").trim().slice(0, 200), text = String(b.text || "").trim().slice(0, 20000);
    if (!/^[^@\s<>]+@[^@\s<>]+\.[a-z]{2,}$/i.test(to)) return json({ ok: false, error: "Adresse du destinataire invalide" });
    if (!subject || !text) return json({ ok: false, error: "Objet et message obligatoires" });
    const mime = [`Date: ${new Date().toUTCString().replace("GMT", "+0000")}`, `From: ${EPS_NAME} <${EPS_FROM}>`, `Reply-To: ${EPS_FROM}`, `To: ${to}`, `Subject: ${encHeader(subject)}`,
      "MIME-Version: 1.0", "Content-Type: text/plain; charset=UTF-8", "Content-Transfer-Encoding: base64", "", b64Mime(text), ""].join("\r\n");
    const tok = await gmailToken();
    const r = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", { method: "POST", headers: { authorization: `Bearer ${tok}`, "content-type": "application/json" }, body: JSON.stringify({ raw: b64url(mime) }) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok || !d.id) return json({ ok: false, error: "Envoi refusé : " + (d?.error?.message || r.status) });
    const cid = typeof b.contact_id === "string" && /^[0-9a-f-]{36}$/.test(b.contact_id) ? b.contact_id : null;
    if (cid) await sql`insert into public.eps_crm_activities(contact_id, kind, title, details, completed_at) values (${cid}::uuid, 'email', ${"Mail envoyé : " + subject}, ${text.slice(0, 4000)}, now())`;
    return json({ ok: true, message: `Mail envoyé à ${to} depuis ${EPS_FROM}.` });
  } catch (e) { return json({ ok: false, error: e instanceof Error ? e.message : String(e) }, 200); }
});
