// eps-us-outreach (20/11/2026, validé par Anthony) : prospection USA en anglais, séparée du robot français.
// - Lit uniquement public.eps_us_prospects (jamais eps_crm_contacts ni les campagnes existantes).
// - N'envoie rien tant que eps_us_outreach_settings.sending_enabled = false (feu vert d'Anthony).
// - Envoie aux prospects au statut « prêt » (validés par Anthony), le modèle selon le segment ; relance à J+5 sans réponse.
// - Fenêtre 15 h–17 h heure de Paris, en semaine ; au plus daily_limit mails par jour (15 par défaut).
// - Respecte eps_crm_email_oppositions et les réponses : si le prospect a écrit (« unsubscribe » ou autre), plus de relance.
// - Tout par mail (demande d'Anthony) : pas de WhatsApp, pas de promesse de chauffeur anglophone.
// Appel : cron (en-tête x-eps-cron = clé du coffre) ou admin connecté (POST {dry_run:true} pour voir sans envoyer).
import postgres from "https://deno.land/x/postgresjs@v3.4.5/mod.js";
const sql = postgres(Deno.env.get("SUPABASE_DB_URL")!, { prepare: false, max: 1 });
const SB = Deno.env.get("SUPABASE_URL")!, ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
const FROM = "contact@elite-prestige-services.fr", NAME = "Elite Prestige Services";
const CORS = { "access-control-allow-origin": "*", "access-control-allow-headers": "authorization, apikey, content-type, x-client-info, x-eps-cron", "access-control-allow-methods": "POST, OPTIONS" };
const json = (d: unknown, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { ...CORS, "content-type": "application/json; charset=utf-8" } });

const SIGN = `Best regards,
Anthony Doche
Elite Prestige Services – Cannes, France
contact@elite-prestige-services.fr · +33 7 45 49 53 21
www.elite-prestige-services.fr/en/`;
const FOOT = `—
If you'd rather not hear from me, just reply "unsubscribe" and I won't contact you again.
Elite Prestige Services, 34 rue Borniol, 06400 Cannes, France`;
const EMAIL_ONLY = "All bookings are handled by email, so every detail (times, addresses, flight numbers) is confirmed in writing.";

function first(p: Row) {
  const hi = p.first_name ? `Hi ${p.first_name},` : "Hello,";
  if (p.segment === "lions") return {
    subject: "Chauffeur service for your team at Cannes Lions 2027",
    text: `${hi}

Is ${p.company} heading to Cannes Lions in June?

I'm Anthony, owner of Elite Prestige Services, a premium private chauffeur company based in Cannes. During festival week, cars are fully booked weeks in advance and traffic on the Croisette is tough, so having a dedicated chauffeur makes a real difference.

What we offer:
- Nice Airport pick-ups and drop-offs for your whole team
- A chauffeur on standby all day, between the Palais, beach events and dinners
- Mercedes V-Class for up to 7 passengers
- Several vehicles available for larger delegations
- One single invoice for your company

${EMAIL_ONLY}

I'm already planning the 2027 bookings. Would you like me to hold a vehicle for your dates?

${SIGN}

${FOOT}` };
  return {
    subject: "Your trusted private chauffeur on the French Riviera",
    text: `${hi}

I'm Anthony, owner of Elite Prestige Services, a premium private chauffeur company based in Cannes.

When your clients travel to the French Riviera, we take care of every ride so you don't have to worry:
- Nice Airport meet & greet, flight tracking included
- Transfers to Cannes, Monaco, Saint-Tropez and Antibes
- Full-day hire with a private chauffeur (Èze, Saint-Paul-de-Vence, Grasse, Provence)
- Mercedes V-Class for up to 7 passengers with luggage
- Trade rates, invoicing to your agency, and white-label service on request

${EMAIL_ONLY}

We also cover the big events: Cannes Film Festival, Monaco Grand Prix and Cannes Lions.

Would it help if I sent you our trade rate sheet for the 2027 season?

${SIGN}

${FOOT}` };
}
function followup(p: Row) {
  const f = first(p);
  return {
    subject: "Re: " + f.subject,
    text: `${p.first_name ? `Hi ${p.first_name},` : "Hello,"}

Just following up on my message from last week.

If you have clients or a team visiting Nice, Cannes or Monaco in 2027, I'd be happy to be your local contact. Just reply to this email and everything is arranged and confirmed in writing.

Shall I send over our trade rates?

Best,
Anthony Doche
Elite Prestige Services – Cannes
contact@elite-prestige-services.fr

${FOOT}` };
}

type Row = { id: string; company: string; first_name: string | null; email: string; segment: string; status: string; sent_at: string | null };

const enc = new TextEncoder();
const b64 = (s: string) => { const b = enc.encode(s); let x = ""; for (let i = 0; i < b.length; i += 0x8000) x += String.fromCharCode(...b.subarray(i, i + 0x8000)); return btoa(x); };
const b64Mime = (s: string) => (b64(s).match(/.{1,76}/g) || []).join("\r\n");
const b64url = (s: string) => b64(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const encHeader = (s: string) => "=?UTF-8?B?" + b64(s.replace(/[\r\n]/g, " ")) + "?=";
function cleanToken(v: string) { const t = v.trim(); const m = t.match(/1\/\/[A-Za-z0-9_\-]+/); return m ? m[0] : t.replace(/^["']|["']$/g, ""); }
async function gmailToken() {
  const a = (Deno.env.get("GMAIL_CLIENT_ID") || "").trim(), b = (Deno.env.get("GMAIL_CLIENT_SECRET") || "").trim(), c = cleanToken(Deno.env.get("GMAIL_REFRESH_TOKEN") || "");
  if (!a || !b || !c) throw new Error("Connexion Gmail non configurée");
  const r = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ client_id: a, client_secret: b, refresh_token: c, grant_type: "refresh_token" }) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok || !d.access_token) throw new Error("Connexion Google refusée : " + (d.error_description || d.error || r.status));
  return d.access_token as string;
}
async function send(tok: string, to: string, subject: string, text: string) {
  const mime = [`Date: ${new Date().toUTCString().replace("GMT", "+0000")}`, `From: ${NAME} <${FROM}>`, `Reply-To: ${FROM}`, `To: ${to}`, `Subject: ${encHeader(subject)}`,
    "List-Unsubscribe: <mailto:" + FROM + "?subject=unsubscribe>", "MIME-Version: 1.0", "Content-Type: text/plain; charset=UTF-8", "Content-Transfer-Encoding: base64", "", b64Mime(text), ""].join("\r\n");
  const r = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", { method: "POST", headers: { authorization: `Bearer ${tok}`, "content-type": "application/json" }, body: JSON.stringify({ raw: b64url(mime) }) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok || !d.id) throw new Error("Envoi refusé : " + (d?.error?.message || r.status));
}
// A-t-il répondu ? (lecture seule de la boîte ; si l'accès lecture manque, on considère « peut-être » et on ne relance pas)
async function replied(tok: string, email: string): Promise<boolean | null> {
  const q = encodeURIComponent(`from:${email} newer_than:30d`);
  const r = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=1&q=${q}`, { headers: { authorization: `Bearer ${tok}` } });
  if (!r.ok) return null;
  const d = await r.json().catch(() => ({}));
  return Array.isArray(d.messages) && d.messages.length > 0;
}
async function isAdmin(req: Request) {
  const auth = req.headers.get("authorization") || "";
  if (!/^Bearer /.test(auth)) return false;
  const r = await fetch(SB + "/rest/v1/rpc/eps_is_admin", { method: "POST", headers: { authorization: auth, apikey: ANON, "content-type": "application/json" }, body: "{}" });
  return r.ok && (await r.json().catch(() => false)) === true;
}
async function isCron(req: Request) {
  const k = req.headers.get("x-eps-cron") || "";
  if (k.length < 20) return false;
  const [s] = await sql`select decrypted_secret from vault.decrypted_secrets where name = 'eps_us_outreach_cron_key'`;
  return !!s && s.decrypted_secret === k;
}
function parisNow() {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Paris", weekday: "short", hour: "2-digit", hour12: false }).formatToParts(new Date()).map((x) => [x.type, x.value]));
  return { day: p.weekday as string, hour: Number(p.hour) };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
  if (req.method !== "POST") return json({ error: "POST" }, 405);
  try {
    const cron = await isCron(req);
    if (!cron && !(await isAdmin(req))) return json({ error: "Accès refusé" }, 401);
    const body = await req.json().catch(() => ({}));
    const dry = !!body.dry_run;
    const [cfg] = await sql`select sending_enabled, daily_limit from public.eps_us_outreach_settings where id = 1`;
    if (!cfg?.sending_enabled && !dry) return json({ ok: true, sent: 0, message: "Envois coupés : en attente du feu vert d'Anthony." });
    const { day, hour } = parisNow();
    if (!dry && (["Sat", "Sun"].includes(day) || hour < 15 || hour >= 17)) return json({ ok: true, sent: 0, message: "Hors de la fenêtre 15 h–17 h (Paris), en semaine." });
    const [{ n }] = await sql`select count(*)::int n from public.eps_us_prospects
      where (sent_at >= date_trunc('day', now() at time zone 'Europe/Paris') at time zone 'Europe/Paris')
         or (followup_at >= date_trunc('day', now() at time zone 'Europe/Paris') at time zone 'Europe/Paris')`;
    let room = Math.max(0, (cfg?.daily_limit ?? 15) - n);
    // au plus 3 par passage (toutes les 20 min), pour étaler les envois
    room = Math.min(room, 3);
    const opp = sql`select 1 from public.eps_crm_email_oppositions o where lower(o.email) = lower(p.email)`;
    const fresh = await sql`select * from public.eps_us_prospects p where status = 'prêt' and not exists (${opp}) order by created_at limit ${room}`;
    const due = room - fresh.length > 0 ? await sql`select * from public.eps_us_prospects p where status = 'envoyé' and followup_at is null
      and sent_at < now() - interval '5 days' and not exists (${opp}) order by sent_at limit ${room - fresh.length}` : [];
    if (dry) return json({ ok: true, dry_run: true, would_send: fresh.map((p: Row) => ({ to: p.email, ...first(p) })), would_follow_up: due.map((p: Row) => p.email) });
    if (!fresh.length && !due.length) return json({ ok: true, sent: 0, message: "Rien à envoyer." });
    const tok = await gmailToken();
    let sent = 0;
    for (const p of fresh as Row[]) {
      try { const m = first(p); await send(tok, p.email, m.subject, m.text); sent++;
        await sql`update public.eps_us_prospects set status = 'envoyé', sent_at = now(), last_error = null, updated_at = now() where id = ${p.id}`;
      } catch (e) { await sql`update public.eps_us_prospects set status = 'erreur', last_error = ${String(e instanceof Error ? e.message : e).slice(0, 300)}, updated_at = now() where id = ${p.id}`; }
    }
    for (const p of due as Row[]) {
      const r = await replied(tok, p.email);
      if (r === true) { await sql`update public.eps_us_prospects set status = 'répondu', replied_at = now(), updated_at = now() where id = ${p.id}`; continue; }
      if (r === null) continue; // on ne sait pas lire la boîte : prudence, pas de relance automatique
      try { const m = followup(p); await send(tok, p.email, m.subject, m.text); sent++;
        await sql`update public.eps_us_prospects set status = 'relancé', followup_at = now(), updated_at = now() where id = ${p.id}`;
      } catch (e) { await sql`update public.eps_us_prospects set last_error = ${String(e instanceof Error ? e.message : e).slice(0, 300)}, updated_at = now() where id = ${p.id}`; }
    }
    return json({ ok: true, sent });
  } catch (e) { return json({ ok: false, error: e instanceof Error ? e.message : String(e) }, 200); }
});
