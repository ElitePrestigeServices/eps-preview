// EPS booking API — Supabase migration. No client-side database write access.
// 04/11/2026 (v21) : le prix fixe affiché au client sur le site (calculé dans le navigateur) est repris dans l'alerte admin (à vérifier) et dans l'accusé de réception client.
// 03/11/2026 : code partenaire (agences) — vérifié côté serveur, enregistré dans eps_reservations.partner_code.
const url=Deno.env.get('SUPABASE_URL')||'';
const service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')||'';
const allowed=['https://eliteprestigeservices.pages.dev','https://eliteprestigeservices.github.io','https://test.elite-prestige-services.fr','https://www.elite-prestige-services.fr','https://elite-prestige-services.fr'];
const cors=(origin:string|null)=>({'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Vary':'Origin',...(origin&&allowed.includes(origin)?{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Headers':'content-type','Access-Control-Allow-Methods':'GET,POST,OPTIONS'}:{})});
const response=(obj:unknown,status=200,origin:string|null=null)=>new Response(JSON.stringify(obj),{status,headers:cors(origin)});
const clean=(x:unknown)=>typeof x==='string'?x.trim():'';
Deno.serve(async req=>{
 const origin=req.headers.get('origin');
 if(req.method==='OPTIONS')return allowed.includes(origin||'')?new Response(null,{status:204,headers:cors(origin)}):response({error:'Origine refusée'},403);
 if(req.method==='GET')return response({ready:!!url&&!!service,mode:'supabase',payment:'none',mailReady:!!Deno.env.get('RESEND_API_KEY'),fromReady:!!Deno.env.get('EPS_FROM_EMAIL'),toReady:!!Deno.env.get('EPS_TO_EMAIL')},200,origin);
 if(req.method!=='POST')return response({error:'Méthode non autorisée'},405,origin);
 if(!allowed.includes(origin||''))return response({error:'Origine refusée'},403,origin);
 if(!url||!service)return response({error:'Configuration serveur indisponible'},503,origin);
 if(!req.headers.get('content-type')?.startsWith('application/json'))return response({error:'Format invalide'},415,origin);
 const raw=await req.text();if(raw.length>12000)return response({error:'Requête trop longue'},413,origin);
 let input;try{input=JSON.parse(raw)}catch{return response({error:'JSON invalide'},400,origin)}
 if(!input||typeof input!=='object'||Array.isArray(input))return response({error:'Demande invalide'},400,origin);
 if(clean(input.website))return response({ok:true,reference:'reçue'},200,origin);
 const d={
 id:clean(input.requestId),type:clean(input.type),departure:clean(input.departure),
 destination:clean(input.destination),flight_number:clean(input.flightNumber),date:clean(input.date),
 time:clean(input.time),duration_hours:clean(input.durationHours),passengers:clean(input.passengers),
 luggage:clean(input.luggage),child_seat:clean(input.childSeat),vehicle:clean(input.vehicle),
 customer_name:clean(input.customerName),customer_email:clean(input.customerEmail).toLowerCase(),
 customer_phone:clean(input.customerPhone),notes:clean(input.notes)
 };
 const airport=(s:string)=>/\b(?:aeroport|airport|aerodrome|nce|lfmn|lfmd|cdg|ory|lbg|mrs|tln|gva|mxp|lhr)\b/i.test(s.normalize('NFD').replace(/[̀-ͯ]/g,''));
 const phone=d.customer_phone.replace(/[\s().-]/g,'');
 const flight=airport(d.departure)||(d.type==='Transfert'&&airport(d.destination));
 const today=new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Paris',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 const valid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(d.id)
 &&['Transfert','Mise à disposition','Événement'].includes(d.type)
 &&d.departure.length>=2&&d.departure.length<=160&&d.destination.length<=160
 &&(d.type!=='Transfert'||d.destination.length>=2)
 &&(flight?/^[A-Za-z0-9][A-Za-z0-9 -]{1,23}$/.test(d.flight_number):!d.flight_number)
 &&/^\d{4}-\d{2}-\d{2}$/.test(d.date)&&d.date>=today&&/^([01]\d|2[0-3]):[0-5]\d$/.test(d.time)
 &&(d.type==='Mise à disposition'?/^\d{1,3}$/.test(d.duration_hours)&&Number(d.duration_hours)>=2&&Number(d.duration_hours)<=168:!d.duration_hours)
 &&Number.isInteger(Number(d.passengers))&&Number(d.passengers)>=1&&Number(d.passengers)<=7
 &&['0','1','2','3','4','5+'].includes(d.luggage)
 &&['none','Siège bébé','Réhausseur','Siège bébé + réhausseur','to_confirm'].includes(d.child_seat)
 &&['Sans préférence','Business Class','Business Van','First Class','Electric Class'].includes(d.vehicle)
 &&d.customer_name.length>=2&&d.customer_name.length<=80
 &&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.customer_email)&&d.customer_email.length<=254
 &&/^\+?[0-9]{7,15}$/.test(phone)
 &&d.notes.length<=1000;
 if(!valid)return response({error:'Vérifiez les informations de la demande.'},400,origin);
 // Code partenaire : facultatif ; un code inconnu ou inactif est simplement ignoré (la demande passe quand même).
 let partner_code:string|null=null,partner_name='';
 const pc=clean(input.partnerCode).toUpperCase();
 if(/^[A-Z0-9-]{3,24}$/.test(pc)){
  try{
   const pr=await fetch(url+'/rest/v1/eps_partners?select=code,name&active=eq.true&code=eq.'+encodeURIComponent(pc)+'&limit=1',{headers:{apikey:service,Authorization:'Bearer '+service}});
   if(pr.ok){const rows=await pr.json();if(rows[0]){partner_code=rows[0].code;partner_name=rows[0].name}}
  }catch(e){console.error('EPS reservation partner',String(e))}
 }
 // Prix affiché sur le site (calcul navigateur, non garanti) : informatif seulement.
 const eur=(n:number)=>Math.round(n)+' €';
 const amt=Number(input?.estimate?.amount);
 const opts=Array.isArray(input?.estimateOptions)?input.estimateOptions.slice(0,3).filter((o:any)=>['Business Class','Business Van','First Class'].includes(o?.vehicle)&&Number(o?.amount)>0&&Number(o?.amount)<5000):[];
 const shown=Number.isFinite(amt)&&amt>0&&amt<5000?eur(amt)+' TTC ('+d.vehicle+')':opts.length?opts.map((o:any)=>o.vehicle+' '+eur(Number(o.amount))).join(' · ')+' TTC':'';
 const reference=d.id.slice(0,8).toUpperCase();
 const headers={apikey:service,Authorization:'Bearer '+service,'Content-Type':'application/json',Prefer:'resolution=ignore-duplicates,return=representation'};
 const db=await fetch(url+'/rest/v1/eps_reservations?on_conflict=id',{method:'POST',headers,body:JSON.stringify([{...d,reference,status:'reçue',partner_code}])});
 if(!db.ok){console.error('EPS reservation Supabase',db.status,(await db.text()).slice(0,250));return response({error:'Réservation momentanément indisponible'},503,origin)}
 const resend=Deno.env.get('RESEND_API_KEY'),from='Elite Prestige Services <reservation@elite-prestige-services.fr>',to=Deno.env.get('EPS_TO_EMAIL')||'contact@elite-prestige-services.fr';
 let receiptSent=false,adminAlertSent=false,emailError='';
 if(resend){
  const text=['Nouvelle demande EPS '+reference,...(partner_code?['PARTENAIRE : '+partner_name+' ('+partner_code+') — tarif fixe, commission 10 %']:[]),'Client : '+d.customer_name,'E-mail : '+d.customer_email,'Téléphone : '+d.customer_phone,'Prestation : '+d.type,'Départ : '+d.departure,'Destination : '+d.destination,'Date : '+d.date.split('-').reverse().join('/')+' à '+d.time,'Véhicule : '+d.vehicle,'Passagers : '+d.passengers,...(shown?['Prix affiché sur le site : '+shown+' — à vérifier avant le devis']:['Prix : sur devis (trajet hors grille)']),'Notes : '+d.notes,'Aucun paiement effectué.'].join('\n');
  try{
   const admin=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+resend,'Content-Type':'application/json','Idempotency-Key':'eps-supabase-reservation-admin-'+d.id},body:JSON.stringify({from,to:[to],reply_to:'contact@elite-prestige-services.fr',subject:(partner_code?'[Partenaire '+partner_code+'] ':'')+'Nouvelle réservation EPS — '+reference,text})});
   adminAlertSent=admin.ok;if(!admin.ok){emailError='Alerte admin Resend HTTP '+admin.status;console.error('EPS reservation admin email',admin.status)}
   const customer=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+resend,'Content-Type':'application/json','Idempotency-Key':'eps-supabase-reservation-client-'+d.id},body:JSON.stringify({from,to:[d.customer_email],reply_to:'contact@elite-prestige-services.fr',subject:'Votre demande EPS — '+reference,text:'Bonjour '+d.customer_name+',\n\nNous avons reçu votre demande de réservation '+reference+' pour le '+d.date.split('-').reverse().join('/')+' à '+d.time+'. '+(shown?'Prix fixe indiqué : '+shown+'. ':'')+'Nous vous transmettrons votre devis après vérification. Aucun paiement effectué.\n\nElite Prestige Services'})});
   receiptSent=customer.ok;if(!customer.ok){emailError+=(emailError?' · ':'')+'Accusé client Resend HTTP '+customer.status;console.error('EPS reservation client email',customer.status)}
  }catch(e){emailError='Erreur e-mail : '+String(e).slice(0,160);console.error('EPS reservation mail',String(e))}
 }else emailError='RESEND_API_KEY manquante';
 try{
  const nh={apikey:service,Authorization:'Bearer '+service,'Content-Type':'application/json'};
  const nu=new URL(url+'/rest/v1/eps_admin_notifications');nu.searchParams.set('kind','eq.reservation');nu.searchParams.set('source_id','eq.'+d.id);
  await fetch(nu,{method:'PATCH',headers:nh,body:JSON.stringify(adminAlertSent?{email_sent_at:new Date().toISOString(),email_error:null}:{email_error:emailError||'Alerte admin non envoyée'})});
 }catch(e){console.error('EPS notification status',String(e))}
 return response({ok:true,reference,receiptSent,adminAlertSent,indicativeFare:null,partner:partner_code?partner_name:null},200,origin);
});
