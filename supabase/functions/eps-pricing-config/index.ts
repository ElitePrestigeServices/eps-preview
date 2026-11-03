// EPS — configuration tarifaire publique (03/11/2026).
// Renvoie les périodes majorées actives (salons, haute saison) et vérifie un code partenaire.
// Aucune écriture, aucune donnée personnelle : seulement nom + code du partenaire s'il est actif.
const url=Deno.env.get('SUPABASE_URL')||'';
function serverKey():string{const raw=Deno.env.get('SUPABASE_SECRET_KEYS');if(raw){try{const p=JSON.parse(raw);if(p?.default)return p.default}catch(_){}}return Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')??''}
const service=serverKey();
const allowed=['https://eliteprestigeservices.pages.dev','https://eliteprestigeservices.github.io','https://test.elite-prestige-services.fr','https://www.elite-prestige-services.fr','https://elite-prestige-services.fr'];
const headers=(origin:string|null)=>({'Content-Type':'application/json; charset=utf-8','Cache-Control':'public, max-age=300','Vary':'Origin',...(origin&&allowed.includes(origin)?{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'GET,OPTIONS','Access-Control-Allow-Headers':'content-type'}:{})});
const out=(o:unknown,s:number,origin:string|null)=>new Response(JSON.stringify(o),{status:s,headers:headers(origin)});
Deno.serve(async req=>{
  const origin=req.headers.get('origin');
  if(req.method==='OPTIONS')return new Response(null,{status:204,headers:headers(origin)});
  if(req.method!=='GET')return out({error:'Méthode non autorisée'},405,origin);
  if(!url||!service)return out({error:'Configuration indisponible'},503,origin);
  const h:Record<string,string>=service.startsWith('sb_')?{apikey:service}:{apikey:service,Authorization:'Bearer '+service};
  const today=new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Paris'}).format(new Date());
  const ev=await fetch(url+'/rest/v1/pricing_events?select=name,start_date,end_date,surcharge_percent,kind&enabled=eq.true&start_date=not.is.null&end_date=gte.'+today+'&order=start_date',{headers:h});
  if(!ev.ok)console.error('eps-pricing-config events',ev.status,(await ev.clone().text()).slice(0,200));
  const events=ev.ok?(await ev.json()).map((e:any)=>({name:e.name,start:e.start_date,end:e.end_date,percent:Number(e.surcharge_percent)||0,kind:e.kind})):[];
  let partner=null;
  const code=(new URL(req.url).searchParams.get('partner')||'').toUpperCase().trim();
  if(/^[A-Z0-9-]{3,24}$/.test(code)){
    const p=await fetch(url+'/rest/v1/eps_partners?select=code,name&active=eq.true&code=eq.'+encodeURIComponent(code)+'&limit=1',{headers:h});
    if(p.ok){const r=await p.json();if(r[0])partner={code:r[0].code,name:r[0].name}}
  }
  return out({events,partner},200,origin);
});
