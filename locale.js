(() => {
  const translations = {
    "CHAUFFEUR PRIVÉ · CÔTE D’AZUR":"PRIVATE CHAUFFEUR · FRENCH RIVIERA",
    "Accueil":"Home","Nos véhicules":"Our vehicles","Nos services":"Our services","Entreprises":"Business","Événements":"Events","Mise à disposition":"Hourly chauffeur","Réserver":"Book","ESPACE PRIVÉ":"PRIVATE AREA","Espace administrateur":"Admin area","Consultez et suivez les demandes de réservation depuis votre espace sécurisé.":"Review and manage booking requests from your secure area.","Se connecter admin":"Admin sign in","Espace admin":"Admin area","Accès professionnels":"Professional access","Deux espaces sécurisés pour gérer les réservations et accéder aux missions.":"Two secure areas to manage bookings and view assignments.","Se connecter chauffeur":"Driver sign in","Espace chauffeur":"Driver area",
    "Transferts privés, aviation d’affaires, yachting et événements sur la Côte d’Azur.":"Private transfers, business aviation, yachting and events on the French Riviera.",
    "Un service sur mesure, fiable et discret.":"A tailored, reliable and discreet service.",
    "Service premium":"Premium service","et personnalisé":"and personal attention","Aéroports &":"Airports &","aviation privée":"private aviation","Ponctualité":"Punctuality","et discrétion":"and discretion",
    "Demander une réservation":"Request a booking","Aviation privée":"Private aviation","Transferts vers les terminaux d’aviation d’affaires.":"Transfers to business aviation terminals.",
    "Chauffeur privé":"Private chauffeur","Déplacements sur mesure sur toute la Côte d’Azur.":"Tailored journeys across the French Riviera.",
    "Prises en charge dans les ports et marinas.":"Pickups at ports and marinas.",
    "Événements VIP":"VIP events","Festival de Cannes, congrès et événements privés.":"Cannes Film Festival, conferences and private events.",
    "EN SAVOIR PLUS":"LEARN MORE","Réserver un véhicule":"Book a vehicle",
    "RÉSERVATION SUR MESURE":"TAILORED BOOKING","Réservez votre chauffeur":"Book your chauffeur",
    "Indiquez votre trajet et vos coordonnées, puis vérifiez le récapitulatif avant l’envoi. Nous confirmerons la disponibilité et le tarif.":"Enter your journey and contact details, then review your request before sending. We will confirm availability and pricing.",
    "Transfert":"Transfer","Mise à disposition":"Hourly chauffeur","Événement":"Event",
    "Départ":"Pickup","Arrivée":"Drop-off","Date":"Date","Heure":"Time","Passagers":"Passengers","Bagages":"Luggage",
    "Siège bébé ou réhausseur":"Baby seat or booster seat","Aucun":"None","Siège bébé":"Baby seat","Réhausseur":"Booster seat","Siège bébé + réhausseur":"Baby seat + booster seat","À préciser":"To be confirmed",
    "Catégorie de véhicule":"Vehicle category","Sans préférence":"No preference","Vos coordonnées":"Your contact details","Nom complet":"Full name","Téléphone":"Phone","Informations utiles (facultatif)":"Additional information (optional)","Ne pas remplir":"Leave blank",
    "Vérifier ma demande":"Review my request","Demande sous réserve de disponibilité. Aucun paiement à cette étape.":"Subject to availability. No payment at this stage.",
    "Vérifiez votre demande":"Review your request","Votre réservation sera confirmée après vérification de la disponibilité.":"Your booking will be confirmed after availability is checked.",
    "Envoi en cours d’activation":"Sending is being activated",
    "L’envoi n’est pas encore disponible. Vos coordonnées n’ont pas été transmises.":"Sending is not available yet. Your contact details have not been submitted.",
    "Envoi de votre demande…":"Sending your request…","Votre demande a été transmise. Référence : ":"Your request has been sent. Reference: ",". Elle reste soumise à confirmation.":". It is still subject to confirmation.",
    "L’envoi a échoué. Vous pouvez réessayer ; aucune réservation n’a été confirmée.":"Sending failed. You can try again; no booking has been confirmed.",
    "Un récapitulatif vous a été envoyé par e-mail.":"A summary has been sent to your email address.",
    "Le récapitulatif par e-mail n’a pas pu être envoyé. Votre demande nous est bien parvenue.":"We could not send the email summary. We have received your request.",
    "ENTREPRISES & ÉVÉNEMENTS":"BUSINESS & EVENTS","Votre partenaire mobilité":"Your mobility partner","sur la Côte d’Azur.":"on the French Riviera.",
    "Accueil de délégations, transferts aéroport, déplacements professionnels et mise à disposition de plusieurs véhicules.":"Delegate arrivals, airport transfers, business travel and multiple vehicle bookings.",
    "Nous contacter ↗":"Contact us ↗","Demande de réservation sous réserve de disponibilité. Aucun paiement en ligne à cette étape.":"Booking requests are subject to availability. No online payment at this stage.",
    "Photographies illustratives : Classe V (Tripyana / Mam16600),":"Illustrative photographs: V-Class (Tripyana / Mam16600),",
    "— recadrée. Véhicule photographié non exploité par EPS.":"— cropped. The pictured vehicle is not operated by EPS.",
    "Prestation":"Service","Date et heure":"Date and time","Durée":"Duration","Nombre d’heures":"Number of hours","Nombre d’heures (2 h minimum)":"Number of hours (2 hours minimum)","Numéro de vol":"Flight number","Ex. AF1234":"E.g. AF1234","Ex. 8":"E.g. 8","Passagers / bagages":"Passengers / luggage","Siège enfant":"Child seat","Véhicule":"Vehicle","Client":"Customer","Informations utiles":"Additional information",
    "Vérification de l’envoi…":"Checking sending availability…","Envoyer ma demande":"Send my request","Demande envoyée":"Request sent",
    "Aéroport de Nice, hôtel, adresse…":"Nice Airport, hotel, address…","Votre destination":"Your destination","Vol, étape supplémentaire, siège enfant, demande particulière…":"Flight, extra stop, child seat, special request…",
    "Navigation principale":"Main navigation","Elite Prestige Services, accueil":"Elite Prestige Services, home","Logo officiel Elite Prestige Services":"Official Elite Prestige Services logo",
    "En savoir plus — Aviation privée":"Learn more — Private aviation","En savoir plus — Chauffeur privé":"Learn more — Private chauffeur","En savoir plus — Yachting":"Learn more — Yachting","En savoir plus — Événements VIP":"Learn more — VIP events",
    "En savoir plus sur Business Class":"Learn more about Business Class","En savoir plus sur Business Van":"Learn more about Business Van","En savoir plus sur First Class":"Learn more about First Class","En savoir plus sur Electric Class":"Learn more about Electric Class",
    "Nos véhicules — une flotte haut de gamme : Business Class, Business Van, First Class et Electric Class, Mercedes EQS ou équivalent.":"Our premium fleet: Business Class, Business Van, First Class and Electric Class, Mercedes EQS or equivalent.",
    "Faire défiler le visuel de la flotte":"Scroll through the fleet image","Type de prestation":"Service type","Fermer":"Close",
    "Elite Prestige Services : transferts privés, aviation d’affaires, yachting et événements à Cannes, Nice, Monaco et Saint-Tropez.":"Elite Prestige Services: private transfers, business aviation, yachting and events in Cannes, Nice, Monaco and Saint-Tropez.",
    "Elite Prestige Services | Chauffeur privé Côte d’Azur":"Elite Prestige Services | Private chauffeur French Riviera"
  };
  let language = 'fr';
  const originals = new WeakMap();
  const attributes = ['aria-label', 'alt', 'placeholder', 'content'];
  const excluded = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA']);
  function translateText(value) {
    const key = value.trim();
    if (!translations[key]) return value;
    const start = value.slice(0, value.indexOf(key));
    const end = value.slice(value.indexOf(key) + key.length);
    return start + (language === 'en' ? translations[key] : key) + end;
  }
  function apply() {
    document.documentElement.lang = language;
    document.querySelectorAll('.lang-toggle button').forEach(button => {
      const active = button.dataset.lang === language;
      button.setAttribute('aria-pressed', String(active));
    });
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (excluded.has(node.parentElement?.tagName)) continue;
      if (!originals.has(node)) originals.set(node, node.nodeValue);
      const source = originals.get(node);
      const updated = translateText(source);
      if (node.nodeValue !== updated) node.nodeValue = updated;
    }
    document.querySelectorAll('[aria-label],[alt],[placeholder],meta[content]').forEach(element => {
      for (const attribute of attributes) {
        if (!element.hasAttribute(attribute)) continue;
        const dataKey = 'original' + attribute.replace(/[^a-z]/g,'');
        if (!element.dataset[dataKey]) element.dataset[dataKey] = element.getAttribute(attribute);
        const source = element.dataset[dataKey];
        element.setAttribute(attribute, language === 'en' ? (translations[source] || source) : source);
      }
    });
    document.title = language === 'en' ? translations['Elite Prestige Services | Chauffeur privé Côte d’Azur'] : 'Elite Prestige Services | Chauffeur privé Côte d’Azur';
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = language === 'en' ? translations['Elite Prestige Services : transferts privés, aviation d’affaires, yachting et événements à Cannes, Nice, Monaco et Saint-Tropez.'] : 'Elite Prestige Services : transferts privés, aviation d’affaires, yachting et événements à Cannes, Nice, Monaco et Saint-Tropez.';
  }
  window.epsLanguage = () => language;
  window.epsTranslate = value => language === 'en' ? (translations[value] || value) : value;
  window.epsSetLanguage = value => {
    language = value === 'en' ? 'en' : 'fr';
    try { localStorage.setItem('eps-language', language); } catch {}
    apply();
    if (window.epsRefreshBooking) window.epsRefreshBooking();
  };
  document.querySelectorAll('.lang-toggle button').forEach(button => button.addEventListener('click', () => window.epsSetLanguage(button.dataset.lang)));
  try { language = localStorage.getItem('eps-language') === 'en' ? 'en' : 'fr'; } catch {}
  apply();
})();
