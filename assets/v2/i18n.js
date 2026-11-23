/* Elite Prestige Services — traduction du nouveau site : français (source), anglais, italien, espagnol.
   Même interface que l'ancien locale.js (epsTranslate, epsSetLanguage, epsLanguage) pour script.js. */
(() => {
  const LANGS = ['fr', 'en', 'it', 'es'];
  // [français, anglais, italien, espagnol]
  const D = [
    // En-tête et navigation
    ['Chauffeur privé · Côte d’Azur', 'Private chauffeur · French Riviera', 'Autista privato · Costa Azzurra', 'Chófer privado · Costa Azul'],
    ['Tarifs', 'Prices', 'Tariffe', 'Tarifas'],
    ['Trajets', 'Routes', 'Tragitti', 'Trayectos'],
    ['Prix fixe', 'Fixed price', 'Prezzo fisso', 'Precio fijo'],
    ['Services', 'Services', 'Servizi', 'Servicios'],
    ['Véhicules', 'Vehicles', 'Veicoli', 'Vehículos'],
    ['Entreprises', 'Business', 'Aziende', 'Empresas'],
    ['Événements', 'Events', 'Eventi', 'Eventos'],
    ['Réserver', 'Book', 'Prenota', 'Reservar'],
    ['Accès admin', 'Admin access', 'Accesso admin', 'Acceso admin'],
    ['Accès chauffeur', 'Driver access', 'Accesso autisti', 'Acceso chóferes'],
    ['Ouvrir le menu', 'Open menu', 'Apri il menu', 'Abrir el menú'],
    // Héros
    ['Chauffeur privé VTC sur toute la Côte d’Azur · Transferts aéroport', 'Private chauffeur across the French Riviera · Airport transfers', 'Autista privato NCC in tutta la Costa Azzurra · Transfer aeroportuali', 'Chófer privado VTC en toda la Costa Azul · Traslados al aeropuerto'],
    ['Réserver un chauffeur', 'Book a chauffeur', 'Prenota un autista', 'Reservar un chófer'],
    ['24 h/24, 7 j/7', '24/7', '24 ore su 24, 7 giorni su 7', '24 h, 7 días a la semana'],
    ['Prix confirmé avant la course', 'Price confirmed before the ride', 'Prezzo confermato prima della corsa', 'Precio confirmado antes del trayecto'],
    ['À propos', 'About us', 'Chi siamo', 'Quiénes somos'],
    ['Chauffeur basé à Cannes', 'Chauffeur based in Cannes', 'Autista con base a Cannes', 'Chófer con base en Cannes'],
    ['Logo Elite Prestige Services', 'Elite Prestige Services logo', 'Logo Elite Prestige Services', 'Logotipo de Elite Prestige Services'],
    // Billets
    ['Trajets fréquents', 'Popular routes', 'Tragitti frequenti', 'Trayectos frecuentes'],
    ['Environ 35 min', 'About 35 min', 'Circa 35 min', 'Unos 35 min'],
    ['Environ 30 min', 'About 30 min', 'Circa 30 min', 'Unos 30 min'],
    ['Environ 55 min', 'About 55 min', 'Circa 55 min', 'Unos 55 min'],
    ['Environ 1 h 30', 'About 1 h 30', 'Circa 1 h 30', 'Unos 1 h 30'],
    ['Les trajets les plus demandés', 'Most popular transfers', 'I tragitti più richiesti', 'Los trayectos más solicitados'],
    ['Prix TTC par véhicule, pas par personne. Touchez un trajet pour le réserver.', 'Prices include VAT, per vehicle, not per person. Tap a route to book it.', 'Prezzi IVA inclusa, per veicolo e non a persona. Tocca un tragitto per prenotarlo.', 'Precios con IVA, por vehículo y no por persona. Toca un trayecto para reservarlo.'],
    ['À partir de', 'From', 'A partire da', 'Desde'],
    ['Aéroport de Nice', 'Nice Airport', 'Aeroporto di Nizza', 'Aeropuerto de Niza'],
    ['Nice', 'Nice', 'Nizza', 'Niza'],
    ['Monaco', 'Monaco', 'Monaco', 'Mónaco'],
    ['Environ 35 min · berline Business', 'About 35 min · Business sedan', 'Circa 35 min · berlina Business', 'Unos 35 min · berlina Business'],
    ['Environ 30 min · berline Business', 'About 30 min · Business sedan', 'Circa 30 min · berlina Business', 'Unos 30 min · berlina Business'],
    ['Environ 55 min · berline Business', 'About 55 min · Business sedan', 'Circa 55 min · berlina Business', 'Unos 55 min · berlina Business'],
    ['Environ 1 h 30 · berline Business', 'About 1 h 30 · Business sedan', 'Circa 1 h 30 · berlina Business', 'Unos 1 h 30 · berlina Business'],
    ['Réserver ce trajet', 'Book this route', 'Prenota questo tragitto', 'Reservar este trayecto'],
    ['Tarifs de base en berline Business. Van Mercedes Classe V et First Class sur les mêmes trajets ; majoration pendant les grands événements et en juillet-août.', 'Base prices in a Business sedan. Mercedes V-Class van and First Class available on the same routes; higher rates during major events and in July–August.', 'Tariffe base in berlina Business. Van Mercedes Classe V e First Class sugli stessi tragitti; maggiorazione durante i grandi eventi e a luglio-agosto.', 'Tarifas base en berlina Business. Van Mercedes Clase V y First Class en los mismos trayectos; recargo durante los grandes eventos y en julio-agosto.'],
    // Services
    ['Nos services', 'Our services', 'I nostri servizi', 'Nuestros servicios'],
    ['Aéroports, hôtels, ports et événements : un chauffeur privé pour chaque déplacement sur la Côte d’Azur.', 'Airports, hotels, ports and events: a private chauffeur for every journey on the French Riviera.', 'Aeroporti, hotel, porti ed eventi: un autista privato per ogni spostamento in Costa Azzurra.', 'Aeropuertos, hoteles, puertos y eventos: un chófer privado para cada desplazamiento en la Costa Azul.'],
    ['Transferts aéroports', 'Airport transfers', 'Transfer aeroporto', 'Traslados al aeropuerto'],
    ['Aéroport Nice Côte d’Azur et Cannes-Mandelieu, vols commerciaux et aviation d’affaires.', 'Nice Côte d’Azur and Cannes-Mandelieu airports, commercial flights and business aviation.', 'Aeroporti di Nizza Costa Azzurra e Cannes-Mandelieu, voli di linea e aviazione d’affari.', 'Aeropuertos de Niza Costa Azul y Cannes-Mandelieu, vuelos comerciales y aviación de negocios.'],
    ['Hôtels & conciergeries', 'Hotels & concierges', 'Hotel e concierge', 'Hoteles y conserjerías'],
    ['Arrivées et départs des hôtels 5 étoiles et palaces de Cannes, Nice et Monaco.', 'Arrivals and departures at 5-star hotels and palaces in Cannes, Nice and Monaco.', 'Arrivi e partenze negli hotel 5 stelle e nei palace di Cannes, Nizza e Monaco.', 'Llegadas y salidas de hoteles de 5 estrellas y palacios de Cannes, Niza y Mónaco.'],
    ['Yachting', 'Yachting', 'Yachting', 'Yates'],
    ['Ports de Cannes, Antibes, Monaco et Saint-Tropez, à l’heure de votre embarquement.', 'Ports of Cannes, Antibes, Monaco and Saint-Tropez, timed to your boarding.', 'Porti di Cannes, Antibes, Monaco e Saint-Tropez, all’ora del tuo imbarco.', 'Puertos de Cannes, Antibes, Mónaco y Saint-Tropez, a la hora de su embarque.'],
    ['Événements VIP', 'VIP events', 'Eventi VIP', 'Eventos VIP'],
    ['Festival de Cannes, congrès, galas, mariages et soirées privées.', 'Cannes Film Festival, conferences, galas, weddings and private parties.', 'Festival di Cannes, congressi, gala, matrimoni e feste private.', 'Festival de Cannes, congresos, galas, bodas y fiestas privadas.'],
    ['Découvrir', 'Discover', 'Scopri', 'Descubrir'],
    // Véhicules
    ['Nos véhicules', 'Our vehicles', 'I nostri veicoli', 'Nuestros vehículos'],
    ['À bord : eau, mouchoirs et chargeurs de téléphone.', 'On board: water, tissues and phone chargers.', 'A bordo: acqua, fazzoletti e caricatori per telefono.', 'A bordo: agua, pañuelos y cargadores de teléfono.'],
    ['Quatre catégories Mercedes, du trajet en duo au groupe de sept avec bagages.', 'Four Mercedes categories, from a couple to a group of seven with luggage.', 'Quattro categorie Mercedes, dalla coppia al gruppo di sette con bagagli.', 'Cuatro categorías Mercedes, de una pareja a un grupo de siete con equipaje.'],
    ['Mercedes Classe E, EQE ou équivalent', 'Mercedes E-Class, EQE or similar', 'Mercedes Classe E, EQE o equivalente', 'Mercedes Clase E, EQE o similar'],
    ['Mercedes Classe V Extra-Long ou équivalent', 'Mercedes V-Class Extra-Long or similar', 'Mercedes Classe V Extra-Long o equivalente', 'Mercedes Clase V Extralarga o similar'],
    ['Mercedes Classe S, EQS ou équivalent', 'Mercedes S-Class, EQS or similar', 'Mercedes Classe S, EQS o equivalente', 'Mercedes Clase S, EQS o similar'],
    ['Mercedes EQE, EQS ou équivalent, 100 % électrique', 'Mercedes EQE, EQS or similar, 100% electric', 'Mercedes EQE, EQS o equivalente, 100% elettrica', 'Mercedes EQE, EQS o similar, 100 % eléctrico'],
    ['3 passagers', '3 passengers', '3 passeggeri', '3 pasajeros'],
    ['7 passagers', '7 passengers', '7 passeggeri', '7 pasajeros'],
    ['3 bagages', '3 bags', '3 bagagli', '3 maletas'],
    ['7 bagages', '7 bags', '7 bagagli', '7 maletas'],
    ['Dès', 'From', 'Da', 'Desde'],
    ['Sur demande', 'On request', 'Su richiesta', 'Bajo petición'],
    ['Choisir', 'Choose', 'Scegli', 'Elegir'],
    // Réservation
    ['Réservez votre chauffeur', 'Book your chauffeur', 'Prenota il tuo autista', 'Reserve su chófer'],
    ['Indiquez votre trajet et vos coordonnées. Vous recevez un devis au prix fixe avant de confirmer.', 'Enter your route and contact details. You receive a fixed-price quote before confirming.', 'Indica il tragitto e i tuoi recapiti. Ricevi un preventivo a prezzo fisso prima di confermare.', 'Indique su trayecto y sus datos. Recibirá un presupuesto a precio cerrado antes de confirmar.'],
    ['Vous envoyez votre demande', 'You send your request', 'Invii la tua richiesta', 'Envía su solicitud'],
    ['Aucun paiement à cette étape.', 'No payment at this stage.', 'Nessun pagamento in questa fase.', 'Ningún pago en esta etapa.'],
    ['Vous recevez votre devis par e-mail', 'You receive your quote by email', 'Ricevi il preventivo via e-mail', 'Recibe su presupuesto por correo'],
    ['Prix TTC fixe, chauffeur et véhicule confirmés.', 'Fixed price including VAT, chauffeur and vehicle confirmed.', 'Prezzo fisso IVA inclusa, autista e veicolo confermati.', 'Precio cerrado con IVA, chófer y vehículo confirmados.'],
    ['Vous confirmez en ligne', 'You confirm online', 'Confermi online', 'Confirma en línea'],
    ['Paiement sécurisé par carte, sans surprise le jour J.', 'Secure card payment, no surprises on the day.', 'Pagamento sicuro con carta, nessuna sorpresa il giorno stesso.', 'Pago seguro con tarjeta, sin sorpresas el día del servicio.'],
    ['Écrire sur WhatsApp', 'Message us on WhatsApp', 'Scrivici su WhatsApp', 'Escríbanos por WhatsApp'],
    ['Type de prestation', 'Type of service', 'Tipo di servizio', 'Tipo de servicio'],
    ['Transfert', 'Transfer', 'Transfer', 'Traslado'],
    ['Mise à disposition', 'Hourly hire', 'Autista a ore', 'Servicio por horas'],
    ['Départ', 'Pick-up', 'Partenza', 'Recogida'],
    ['Arrivée', 'Drop-off', 'Arrivo', 'Destino'],
    ['Aéroport de Nice, hôtel, adresse…', 'Nice Airport, hotel, address…', 'Aeroporto di Nizza, hotel, indirizzo…', 'Aeropuerto de Niza, hotel, dirección…'],
    ['Votre destination', 'Your destination', 'La tua destinazione', 'Su destino'],
    ['Numéro de vol', 'Flight number', 'Numero di volo', 'Número de vuelo'],
    ['Ex. AF1234', 'e.g. AF1234', 'Es. AF1234', 'Ej. AF1234'],
    ['Date', 'Date', 'Data', 'Fecha'],
    ['Heure', 'Time', 'Ora', 'Hora'],
    ['Minutes', 'Minutes', 'Minuti', 'Minutos'],
    ['Nombre d’heures (2 h minimum)', 'Number of hours (2 h minimum)', 'Numero di ore (minimo 2 h)', 'Número de horas (mínimo 2 h)'],
    ['Ex. 8', 'e.g. 8', 'Es. 8', 'Ej. 8'],
    ['Passagers', 'Passengers', 'Passeggeri', 'Pasajeros'],
    ['Bagages', 'Bags', 'Bagagli', 'Maletas'],
    ["Forfait journée ski", "Ski day package", "Pacchetto giornata sci", "Paquete día de esquí"],
    ["Aller simple", "One way", "Solo andata", "Solo ida"],
    ["Aller-retour, retour à ", "Return trip, back at ", "Andata e ritorno, rientro alle ", "Ida y vuelta, regreso a las "],
    ["Aller-retour dans la journée, retour à 15 h 30", "Same-day return, back at 15:30", "Andata e ritorno in giornata, rientro alle 15:30", "Ida y vuelta en el día, regreso a las 15:30"],
    ["Aller-retour dans la journée, retour à 16 h", "Same-day return, back at 16:00", "Andata e ritorno in giornata, rientro alle 16:00", "Ida y vuelta en el día, regreso a las 16:00"],
    ["Aller-retour dans la journée, retour à 16 h 30", "Same-day return, back at 16:30", "Andata e ritorno in giornata, rientro alle 16:30", "Ida y vuelta en el día, regreso a las 16:30"],
    ["Aller-retour dans la journée, retour à 17 h", "Same-day return, back at 17:00", "Andata e ritorno in giornata, rientro alle 17:00", "Ida y vuelta en el día, regreso a las 17:00"],
    ["Aller-retour dans la journée, retour à 17 h 30", "Same-day return, back at 17:30", "Andata e ritorno in giornata, rientro alle 17:30", "Ida y vuelta en el día, regreso a las 17:30"],
    ["Aller-retour dans la journée, retour à 18 h", "Same-day return, back at 18:00", "Andata e ritorno in giornata, rientro alle 18:00", "Ida y vuelta en el día, regreso a las 18:00"],
    ['Siège bébé ou réhausseur', 'Baby seat or booster', 'Seggiolino o rialzo', 'Silla de bebé o alzador'],
    ['Aucun', 'None', 'Nessuno', 'Ninguno'],
    ['Siège bébé', 'Baby seat', 'Seggiolino', 'Silla de bebé'],
    ['Réhausseur', 'Booster seat', 'Rialzo', 'Alzador'],
    ['Siège bébé + réhausseur', 'Baby seat + booster', 'Seggiolino + rialzo', 'Silla de bebé + alzador'],
    ['À préciser', 'To be confirmed', 'Da precisare', 'Por precisar'],
    ['Catégorie de véhicule', 'Vehicle category', 'Categoria di veicolo', 'Categoría de vehículo'],
    ['Sans préférence', 'No preference', 'Nessuna preferenza', 'Sin preferencia'],
    ['Electric Class — 100 % électrique', 'Electric Class — 100% electric', 'Electric Class — 100% elettrica', 'Electric Class — 100 % eléctrico'],
    ['Vos coordonnées', 'Your details', 'I tuoi recapiti', 'Sus datos'],
    ['Nom complet', 'Full name', 'Nome e cognome', 'Nombre completo'],
    ['E-mail', 'Email', 'E-mail', 'Correo electrónico'],
    ['Téléphone', 'Phone', 'Telefono', 'Teléfono'],
    ['Indicatif téléphonique', 'Country code', 'Prefisso telefonico', 'Prefijo telefónico'],
    ['Informations utiles (facultatif)', 'Useful information (optional)', 'Informazioni utili (facoltativo)', 'Información útil (opcional)'],
    ['Vol, étape supplémentaire, siège enfant, demande particulière…', 'Flight, extra stop, child seat, special request…', 'Volo, tappa aggiuntiva, seggiolino, richiesta particolare…', 'Vuelo, parada adicional, silla infantil, petición especial…'],
    ['Vérifier ma demande', 'Review my request', 'Verifica la richiesta', 'Revisar mi solicitud'],
    ['Demande sous réserve de disponibilité. Aucun paiement à cette étape.', 'Subject to availability. No payment at this stage.', 'Richiesta soggetta a disponibilità. Nessun pagamento in questa fase.', 'Solicitud sujeta a disponibilidad. Ningún pago en esta etapa.'],
    ['Vérifiez votre demande', 'Check your request', 'Controlla la tua richiesta', 'Revise su solicitud'],
    ['Votre réservation sera confirmée après vérification de la disponibilité.', 'Your booking will be confirmed once availability is checked.', 'La prenotazione sarà confermata dopo la verifica della disponibilità.', 'Su reserva se confirmará tras comprobar la disponibilidad.'],
    // Messages de script.js
    ['Prestation', 'Service', 'Servizio', 'Servicio'],
    ['Date et heure', 'Date and time', 'Data e ora', 'Fecha y hora'],
    [' à ', ' at ', ' alle ', ' a las '],
    ['Durée', 'Duration', 'Durata', 'Duración'],
    [' h', ' hours', ' ore', ' horas'],
    ['Passagers / bagages', 'Passengers / bags', 'Passeggeri / bagagli', 'Pasajeros / maletas'],
    ['Siège enfant', 'Child seat', 'Seggiolino', 'Silla infantil'],
    ['Véhicule', 'Vehicle', 'Veicolo', 'Vehículo'],
    ['Client', 'Customer', 'Cliente', 'Cliente'],
    ['Informations utiles', 'Useful information', 'Informazioni utili', 'Información útil'],
    ['Tarif', 'Price', 'Tariffa', 'Tarifa'],
    ['Choisir un véhicule', 'Choose a vehicle', 'Scegli un veicolo', 'Elija un vehículo'],
    ['Prix fixe TTC', 'Fixed price incl. VAT', 'Prezzo fisso IVA inclusa', 'Precio fijo con IVA'],
    ['Aperçu de l’itinéraire ; votre prix est confirmé par e-mail avec le devis.', 'Route preview; your price is confirmed by email with the quote.', 'Anteprima del percorso; il prezzo ti viene confermato via e-mail con il preventivo.', 'Vista previa del trayecto; su precio se confirma por correo con el presupuesto.'],
    ['Tarif indicatif TTC', 'Estimated price incl. VAT', 'Tariffa indicativa IVA inclusa', 'Tarifa orientativa con IVA'],
    ['Tarif partenaire TTC', 'Partner price incl. VAT', 'Tariffa partner IVA inclusa', 'Tarifa de socio con IVA'],
    ['haute saison', 'high season', 'alta stagione', 'temporada alta'],
    ['tarif événementiel', 'event rate', 'tariffa evento', 'tarifa de evento'],
    ['Sur devis après étude du trajet', 'Quote after reviewing the route', 'Preventivo dopo lo studio del tragitto', 'Presupuesto tras estudiar el trayecto'],
    ['Aperçu de l’itinéraire sur Google Maps ↗', 'Preview route on Google Maps ↗', 'Anteprima del percorso su Google Maps ↗', 'Ver el recorrido en Google Maps ↗'],
    ['Aperçu uniquement ; tarif confirmé par EPS.', 'Route preview only; price confirmed by EPS.', 'Solo anteprima; tariffa confermata da EPS.', 'Solo vista previa; tarifa confirmada por EPS.'],
    ['Carte du départ et de l’arrivée', 'Map of pick-up and drop-off', 'Mappa di partenza e arrivo', 'Mapa de recogida y destino'],
    ['La carte situe le départ. Ouvrir Google Maps pour voir le trajet routier ; EPS confirme le tarif.', 'The map shows the pick-up area. Open Google Maps for the driving route; EPS confirms the price.', 'La mappa mostra la partenza. Apri Google Maps per il percorso stradale; EPS conferma la tariffa.', 'El mapa sitúa la recogida. Abra Google Maps para ver la ruta; EPS confirma la tarifa.'],
    ['Saisissez un numéro de téléphone valide, avec l’indicatif pays pour les numéros internationaux.', 'Enter a valid phone number, with the country code for international numbers.', 'Inserisci un numero di telefono valido, con il prefisso per i numeri internazionali.', 'Introduzca un teléfono válido, con el prefijo del país para números internacionales.'],
    ['Envoi en cours d’activation', 'Sending is being activated', 'Invio in attivazione', 'Envío en activación'],
    ['Vérification de l’envoi…', 'Checking…', 'Verifica in corso…', 'Comprobando…'],
    ['Envoyer ma demande', 'Send my request', 'Invia la richiesta', 'Enviar mi solicitud'],
    ['Envoi de votre demande…', 'Sending your request…', 'Invio della richiesta…', 'Enviando su solicitud…'],
    ['Demande envoyée', 'Request sent', 'Richiesta inviata', 'Solicitud enviada'],
    ['Votre demande a été transmise. Référence : ', 'Your request has been sent. Reference: ', 'La tua richiesta è stata inviata. Riferimento: ', 'Su solicitud ha sido enviada. Referencia: '],
    ['. Elle reste soumise à confirmation.', '. It remains subject to confirmation.', '. Resta soggetta a conferma.', '. Queda sujeta a confirmación.'],
    ['Un récapitulatif vous a été envoyé par e-mail.', 'A summary has been sent to you by email.', 'Ti abbiamo inviato un riepilogo via e-mail.', 'Le hemos enviado un resumen por correo.'],
    ['Le récapitulatif par e-mail n’a pas pu être envoyé. Votre demande nous est bien parvenue.', 'The email summary could not be sent, but we have received your request.', 'Non è stato possibile inviare il riepilogo via e-mail, ma abbiamo ricevuto la tua richiesta.', 'No se pudo enviar el resumen por correo, pero hemos recibido su solicitud.'],
    ['L’envoi a échoué. Vous pouvez réessayer ; aucune réservation n’a été confirmée.', 'Sending failed. You can try again; no booking has been confirmed.', 'Invio non riuscito. Puoi riprovare; nessuna prenotazione è stata confermata.', 'El envío ha fallado. Puede intentarlo de nuevo; no se ha confirmado ninguna reserva.'],
    ['L’envoi n’est pas encore disponible. Vos coordonnées n’ont pas été transmises.', 'Sending is not available yet. Your details have not been sent.', 'L’invio non è ancora disponibile. I tuoi dati non sono stati trasmessi.', 'El envío aún no está disponible. Sus datos no se han enviado.'],
    // Entreprises
    ['Entreprises, agences et hôtels', 'Companies, agencies and hotels', 'Aziende, agenzie e hotel', 'Empresas, agencias y hoteles'],
    ['Agences événementielles et productions :', 'Event agencies and productions:', 'Agenzie di eventi e produzioni:', 'Agencias de eventos y productoras:'],
    ['Festival de Cannes, Lions, MIPIM, plusieurs véhicules, facture société.', 'Cannes Film Festival, Lions, MIPIM, several vehicles, company invoice.', 'Festival di Cannes, Lions, MIPIM, più veicoli, fattura aziendale.', 'Festival de Cannes, Lions, MIPIM, varios vehículos, factura a la empresa.'],
    ['Délégations et congrès :', 'Delegations and conferences:', 'Delegazioni e congressi:', 'Delegaciones y congresos:'],
    ['transferts aéroport et mise à disposition.', 'airport transfers and hourly hire.', 'transfer aeroporto e autista a ore.', 'traslados al aeropuerto y servicio por horas.'],
    ['Entreprises & événements', 'Corporate & events', 'Aziende ed eventi', 'Empresas y eventos'],
    ['Prix fixe par véhicule, affiché avant la validation de votre réservation. Berline, van Mercedes Classe V ou First Class sur chaque trajet.', 'Fixed price per vehicle, shown before you confirm your booking. Saloon, Mercedes V-Class van or First Class on every route.', 'Prezzo fisso per veicolo, mostrato prima della conferma della prenotazione. Berlina, van Mercedes Classe V o First Class su ogni tragitto.', 'Precio fijo por vehículo, mostrado antes de confirmar la reserva. Berlina, van Mercedes Clase V o First Class en cada trayecto.'],
    ['Hôtels, conciergeries et entreprises', 'Hotels, concierges and companies', 'Hotel, concierge e aziende', 'Hoteles, conserjerías y empresas'],
    ['Un chauffeur de confiance pour vos clients et vos équipes, avec un interlocuteur unique.', 'A trusted chauffeur for your guests and teams, with a single point of contact.', 'Un autista di fiducia per i tuoi clienti e i tuoi team, con un unico referente.', 'Un chófer de confianza para sus clientes y equipos, con un único interlocutor.'],
    ['Tarif fixe toute l’année', 'Fixed price all year round', 'Tariffa fissa tutto l’anno', 'Tarifa fija todo el año'],
    [', sans majoration pendant les événements.', ', with no surcharge during events.', ', senza maggiorazioni durante gli eventi.', ', sin recargo durante los eventos.'],
    ['Lien de réservation à votre nom', 'Booking link in your name', 'Link di prenotazione a tuo nome', 'Enlace de reserva a su nombre'],
    ['pour vos clients, suivi de chaque course.', 'for your guests, with every ride tracked.', 'per i tuoi clienti, con il monitoraggio di ogni corsa.', 'para sus clientes, con seguimiento de cada trayecto.'],
    ['Délégations et congrès', 'Delegations and conferences', 'Delegazioni e congressi', 'Delegaciones y congresos'],
    [': plusieurs véhicules, transferts aéroport et mise à disposition.', ': several vehicles, airport transfers and hourly hire.', ': più veicoli, transfer aeroporto e autista a ore.', ': varios vehículos, traslados al aeropuerto y servicio por horas.'],
    ['Devenir partenaire', 'Become a partner', 'Diventa partner', 'Hágase socio'],
    ['En parler sur WhatsApp', 'Talk to us on WhatsApp', 'Parliamone su WhatsApp', 'Hablemos por WhatsApp'],
    // Partenaire Clic&Site
    ['Partenaire officiel :', 'Official partner:', 'Partner ufficiale:', 'Socio oficial:'],
    [', guide de voyage en France', ', France travel guide', ', guida di viaggio in Francia', ', guía de viaje de Francia'],
    ['Que faire sur la Côte d’Azur', 'Things to do on the French Riviera', 'Cosa fare in Costa Azzurra', 'Qué hacer en la Costa Azul'],
    ['Sorties, visites et bonnes adresses :', 'Outings, sightseeing and good addresses:', 'Uscite, visite e buoni indirizzi:', 'Salidas, visitas y buenas direcciones:'],
    ['le guide de notre partenaire officiel Clic&Site →', 'the guide by our official partner Clic&Site →', 'la guida del nostro partner ufficiale Clic&Site →', 'la guía de nuestro socio oficial Clic&Site →'],
    // Agenda
    ['Événements de la Côte d’Azur', 'French Riviera events', 'Eventi della Costa Azzurra', 'Eventos de la Costa Azul'],
    ['Les grands rendez-vous de la Riviera et leurs mois habituels. Réservez tôt : les chauffeurs partent vite.', 'The Riviera’s major events and their usual months. Book early: chauffeurs are in high demand.', 'I grandi appuntamenti della Riviera e i loro mesi abituali. Prenota presto: gli autisti vanno a ruba.', 'Las grandes citas de la Riviera y sus meses habituales. Reserve pronto: los chóferes se agotan rápido.'],
    ['Voir l’agenda complet', 'See the full calendar', 'Vedi il calendario completo', 'Ver la agenda completa'],
    ['Voir les événements', 'See events', 'Vedi gli eventi', 'Ver los eventos'],
    ['Mois indicatifs : vérifiez le calendrier officiel de chaque édition.', 'Months are indicative: check each edition’s official calendar.', 'Mesi indicativi: verifica il calendario ufficiale di ogni edizione.', 'Meses orientativos: consulte el calendario oficial de cada edición.'],
    ['Mars', 'March', 'Marzo', 'Marzo'], ['Mai', 'May', 'Maggio', 'Mayo'], ['Juin', 'June', 'Giugno', 'Junio'], ['Octobre', 'October', 'Ottobre', 'Octubre'],
    ['Avril', 'April', 'Aprile', 'Abril'], ['Mai / juin', 'May / June', 'Maggio / giugno', 'Mayo / junio'], ['Septembre', 'September', 'Settembre', 'Septiembre'],
    ['Été', 'Summer', 'Estate', 'Verano'], ['Sept. / oct.', 'Sept. / Oct.', 'Sett. / ott.', 'Sept. / oct.'], ['Printemps', 'Spring', 'Primavera', 'Primavera'],
    ['Juillet', 'July', 'Luglio', 'Julio'], ['Février', 'February', 'Febbraio', 'Febrero'],
    ['Festival de Cannes', 'Cannes Film Festival', 'Festival di Cannes', 'Festival de Cannes'],
    ['Grand Prix', 'Grand Prix', 'Gran Premio', 'Gran Premio'],
    ['Concerts', 'Concerts', 'Concerti', 'Conciertos'],
    ['Concerts et festivals', 'Concerts and festivals', 'Concerti e festival', 'Conciertos y festivales'],
    ['Carnaval de Nice', 'Nice Carnival', 'Carnevale di Nizza', 'Carnaval de Niza'],
    ['Festivals & concerts', 'Festivals & concerts', 'Festival e concerti', 'Festivales y conciertos'],
    ['Festival de l’Air', 'Air Festival', 'Festival dell’Aria', 'Festival del Aire'],
    ['Fréjus & Saint-Raphaël', 'Fréjus & Saint-Raphaël', 'Fréjus e Saint-Raphaël', 'Fréjus y Saint-Raphaël'],
    // Pied de page
    ['Chauffeur privé VTC basé à Cannes. Transferts aéroport, hôtels, ports et événements sur toute la Côte d’Azur.', 'Private chauffeur service based in Cannes. Airport, hotel, port and event transfers across the French Riviera.', 'Servizio di autista privato con base a Cannes. Transfer da aeroporti, hotel, porti ed eventi in tutta la Costa Azzurra.', 'Chófer privado con base en Cannes. Traslados de aeropuertos, hoteles, puertos y eventos en toda la Costa Azul.'],
    ['Destinations', 'Destinations', 'Destinazioni', 'Destinos'],
    ['Toutes les destinations', 'All destinations', 'Tutte le destinazioni', 'Todos los destinos'],
    ['Transferts', 'Transfers', 'Transfer', 'Traslados'],
    ['Aéroport de Nice → Cannes', 'Nice Airport → Cannes', 'Aeroporto di Nizza → Cannes', 'Aeropuerto de Niza → Cannes'],
    ['Nice → Monaco', 'Nice → Monaco', 'Nizza → Monaco', 'Niza → Mónaco'],
    ['Aéroport de Nice → Saint-Tropez', 'Nice Airport → Saint-Tropez', 'Aeroporto di Nizza → Saint-Tropez', 'Aeropuerto de Niza → Saint-Tropez'],
    ['Aéroport de Cannes-Mandelieu', 'Cannes-Mandelieu Airport', 'Aeroporto di Cannes-Mandelieu', 'Aeropuerto de Cannes-Mandelieu'],
    ['Contact', 'Contact', 'Contatti', 'Contacto'],
    ['Espace admin', 'Admin area', 'Area admin', 'Área de administración'],
    ['Espace chauffeur', 'Driver area', 'Area autisti', 'Área de chóferes'],
    ['© Elite Prestige Services', '© Elite Prestige Services', '© Elite Prestige Services', '© Elite Prestige Services'],
    ['Mentions légales', 'Legal notice', 'Note legali', 'Aviso legal'],
    ['CGV', 'Terms of sale', 'Condizioni di vendita', 'Condiciones de venta'],
    ['CGU', 'Terms of use', 'Condizioni d’uso', 'Condiciones de uso'],
    ['Confidentialité', 'Privacy', 'Privacy', 'Privacidad'],
    // Avis Google
    ['Ce que disent nos clients', 'What our clients say', 'Cosa dicono i nostri clienti', 'Lo que dicen nuestros clientes'],
    ['Les avis laissés sur notre fiche Google.', 'Reviews left on our Google listing (in French).', 'Le recensioni lasciate sulla nostra scheda Google (in francese).', 'Las opiniones dejadas en nuestra ficha de Google (en francés).'],
    ['4 avis Google', '4 Google reviews', '4 recensioni Google', '4 opiniones de Google'],
    ['5 étoiles sur 5', '5 out of 5 stars', '5 stelle su 5', '5 de 5 estrellas'],
    ['Janvier 2025 · Avis Google', 'January 2025 · Google review', 'Gennaio 2025 · Recensione Google', 'Enero de 2025 · Opinión de Google'],
    ['Février 2025 · Avis Google', 'February 2025 · Google review', 'Febbraio 2025 · Recensione Google', 'Febrero de 2025 · Opinión de Google'],
    ['Novembre 2024 · Avis Google', 'November 2024 · Google review', 'Novembre 2024 · Recensione Google', 'Noviembre de 2024 · Opinión de Google'],
    ['Voir tous les avis sur Google', 'See all reviews on Google', 'Vedi tutte le recensioni su Google', 'Ver todas las opiniones en Google'],
    ['Laisser un avis', 'Leave a review', 'Lascia una recensione', 'Dejar una opinión'],
    ['Réserver →', 'Book →', 'Prenota →', 'Reservar →'],
    ['Moyens de paiement acceptés', 'Accepted payment methods', 'Metodi di pagamento accettati', 'Métodos de pago aceptados'],
    ['Moyens de paiement acceptés : carte bancaire (Visa, Mastercard, American Express), Apple Pay, Google Pay, PayPal, Revolut Pay, Amazon Pay, Alipay et WeChat Pay.', 'Accepted payment methods: card (Visa, Mastercard, American Express), Apple Pay, Google Pay, PayPal, Revolut Pay, Amazon Pay, Alipay and WeChat Pay.', 'Metodi di pagamento accettati: carta (Visa, Mastercard, American Express), Apple Pay, Google Pay, PayPal, Revolut Pay, Amazon Pay, Alipay e WeChat Pay.', 'Métodos de pago aceptados: tarjeta (Visa, Mastercard, American Express), Apple Pay, Google Pay, PayPal, Revolut Pay, Amazon Pay, Alipay y WeChat Pay.']
  ];
  // Russe et chinois (23/11/2026) : seulement le formulaire de réservation, utilisé sur /ru/ et /zh/ ; le reste retombe sur l'anglais.
  const RZ = {"Moyens de paiement acceptés":["Способы оплаты (карты, выпущенные за пределами России)","支付方式"],"Moyens de paiement acceptés : carte bancaire (Visa, Mastercard, American Express), Apple Pay, Google Pay, PayPal, Revolut Pay, Amazon Pay, Alipay et WeChat Pay.":["Способы оплаты: банковская карта (Visa, Mastercard, American Express, выпущенная за пределами России), Apple Pay, Google Pay, PayPal, Revolut Pay, Amazon Pay, Alipay и WeChat Pay.", "支付方式：银行卡（Visa、Mastercard、American Express）、Apple Pay、Google Pay、PayPal、Revolut Pay、Amazon Pay、支付宝 Alipay 和微信支付 WeChat Pay。"],"Tarifs": ["Цены", "价格"], "Prix fixe": ["Фиксированная цена", "固定价格"], "Services": ["Услуги", "服务"], "Aéroport de Nice": ["Аэропорт Ниццы", "尼斯机场"], "Nice": ["Ницца", "尼斯"], "Monaco": ["Монако", "摩纳哥"], "Yachting": ["Яхтинг", "游艇"], "Choisir": ["Выбрать", "选择"], "Réservez votre chauffeur": ["Закажите шофёра", "预订您的专车司机"], "Indiquez votre trajet et vos coordonnées. Vous recevez un devis au prix fixe avant de confirmer.": ["Укажите маршрут и контактные данные. Вы получите предложение с фиксированной ценой до подтверждения.", "请填写行程和联系方式。确认之前，您会收到固定价格的报价。"], "Vous envoyez votre demande": ["Вы отправляете запрос", "提交需求"], "Aucun paiement à cette étape.": ["На этом этапе оплата не требуется.", "此步骤无需付款。"], "Vous recevez votre devis par e-mail": ["Вы получаете предложение по электронной почте", "通过电子邮件接收报价"], "Prix TTC fixe, chauffeur et véhicule confirmés.": ["Фиксированная цена с НДС, водитель и автомобиль подтверждены.", "含税固定价格，司机和车辆已确认。"], "Vous confirmez en ligne": ["Вы подтверждаете онлайн", "在线确认"], "Paiement sécurisé par carte, sans surprise le jour J.": ["Безопасная оплата картой, без сюрпризов в день поездки.", "安全的银行卡支付，当天无任何意外费用。"], "Écrire sur WhatsApp": ["Написать в WhatsApp", "通过 WhatsApp 留言"], "Type de prestation": ["Тип услуги", "服务类型"], "Transfert": ["Трансфер", "接送"], "Mise à disposition": ["Почасовая аренда", "包车"], "Départ": ["Откуда", "出发地"], "Arrivée": ["Куда", "目的地"], "Aéroport de Nice, hôtel, adresse…": ["Аэропорт Ниццы, отель, адрес…", "尼斯机场、酒店、地址…"], "Votre destination": ["Пункт назначения", "您的目的地"], "Numéro de vol": ["Номер рейса", "航班号"], "Ex. AF1234": ["Напр. AF1234", "例如 AF1234"], "Date": ["Дата", "日期"], "Heure": ["Время", "时间"], "Minutes": ["Минуты", "分钟"], "Min": ["Мин", "分"], "Nombre d’heures (2 h minimum)": ["Количество часов (минимум 2)", "小时数（至少2小时）"], "Ex. 8": ["Напр. 8", "例如 8"], "Passagers": ["Пассажиры", "乘客"], "Bagages": ["Багаж", "行李"], "Forfait journée ski": ["Лыжный день", "滑雪一日套餐"], "Aller simple": ["В одну сторону", "单程"], "Aller-retour, retour à ": ["Туда и обратно, обратно в ", "往返，返程时间 "], "Aller-retour dans la journée, retour à 15 h 30": ["Туда и обратно за день, обратно в 15:30", "当日往返，15:30返程"], "Aller-retour dans la journée, retour à 16 h": ["Туда и обратно за день, обратно в 16:00", "当日往返，16:00返程"], "Aller-retour dans la journée, retour à 16 h 30": ["Туда и обратно за день, обратно в 16:30", "当日往返，16:30返程"], "Aller-retour dans la journée, retour à 17 h": ["Туда и обратно за день, обратно в 17:00", "当日往返，17:00返程"], "Aller-retour dans la journée, retour à 17 h 30": ["Туда и обратно за день, обратно в 17:30", "当日往返，17:30返程"], "Aller-retour dans la journée, retour à 18 h": ["Туда и обратно за день, обратно в 18:00", "当日往返，18:00返程"], "Siège bébé ou réhausseur": ["Детское кресло или бустер", "婴儿座椅或增高垫"], "Aucun": ["Не нужно", "不需要"], "Siège bébé": ["Детское кресло", "婴儿座椅"], "Réhausseur": ["Бустер", "增高垫"], "Siège bébé + réhausseur": ["Детское кресло + бустер", "婴儿座椅 + 增高垫"], "À préciser": ["Уточню позже", "稍后告知"], "Catégorie de véhicule": ["Класс автомобиля", "车型"], "Sans préférence": ["Без предпочтений", "无偏好"], "Electric Class — 100 % électrique": ["Electric Class — 100 % электро", "Electric Class — 纯电动"], "Vos coordonnées": ["Ваши контактные данные", "您的联系方式"], "Nom complet": ["Имя и фамилия", "姓名"], "E-mail": ["Электронная почта", "电子邮件"], "Téléphone": ["Телефон", "电话"], "Indicatif téléphonique": ["Код страны", "国家区号"], "Informations utiles (facultatif)": ["Дополнительная информация (необязательно)", "补充信息（选填）"], "Vol, étape supplémentaire, siège enfant, demande particulière…": ["Рейс, дополнительная остановка, детское кресло, особые пожелания…", "航班、中途停靠、儿童座椅、特殊要求…"], "Vérifier ma demande": ["Проверить запрос", "检查我的需求"], "Demande sous réserve de disponibilité. Aucun paiement à cette étape.": ["Запрос зависит от наличия свободных автомобилей. На этом этапе оплата не требуется.", "需视车辆情况而定。此步骤无需付款。"], "Vérifiez votre demande": ["Проверьте ваш запрос", "请核对您的需求"], "Votre réservation sera confirmée après vérification de la disponibilité.": ["Бронирование будет подтверждено после проверки наличия.", "确认车辆可用后，您的预订即被确认。"], "Prestation": ["Услуга", "服务"], "Date et heure": ["Дата и время", "日期和时间"], " à ": [" в ", " "], "Durée": ["Продолжительность", "时长"], " h": [" ч", " 小时"], "Passagers / bagages": ["Пассажиры / багаж", "乘客 / 行李"], "Siège enfant": ["Детское кресло", "儿童座椅"], "Véhicule": ["Автомобиль", "车辆"], "Client": ["Клиент", "客户"], "Informations utiles": ["Дополнительная информация", "补充信息"], "Tarif": ["Цена", "价格"], "Choisir un véhicule": ["Выберите автомобиль", "请选择车辆"], "Prix fixe TTC": ["Фиксированная цена с НДС", "含税固定价格"], "Aperçu de l’itinéraire ; votre prix est confirmé par e-mail avec le devis.": ["Предварительный маршрут; цена подтверждается по электронной почте вместе с предложением.", "行程预览；价格将随报价通过电子邮件确认。"], "Tarif partenaire TTC": ["Партнёрская цена с НДС", "合作伙伴含税价格"], "Sur devis après étude du trajet": ["По запросу после изучения маршрута", "研究行程后报价"], "Aperçu de l’itinéraire sur Google Maps ↗": ["Маршрут в Google Maps ↗", "在 Google 地图上查看路线 ↗"], "Carte du départ et de l’arrivée": ["Карта отправления и прибытия", "出发地和目的地地图"], "La carte situe le départ. Ouvrir Google Maps pour voir le trajet routier ; EPS confirme le tarif.": ["Карта показывает место отправления. Откройте Google Maps, чтобы увидеть маршрут; EPS подтверждает цену.", "地图显示出发地点。打开 Google 地图查看驾车路线；价格由 EPS 确认。"], "Saisissez un numéro de téléphone valide, avec l’indicatif pays pour les numéros internationaux.": ["Введите корректный номер телефона с кодом страны.", "请输入有效的电话号码，国际号码请加国家区号。"], "Envoi en cours d’activation": ["Отправка активируется", "发送功能启用中"], "Vérification de l’envoi…": ["Проверка…", "正在检查…"], "Envoyer ma demande": ["Отправить запрос", "提交我的需求"], "Envoi de votre demande…": ["Отправка запроса…", "正在提交…"], "Demande envoyée": ["Запрос отправлен", "需求已提交"], "Votre demande a été transmise. Référence : ": ["Ваш запрос отправлен. Номер: ", "您的需求已提交。编号："], ". Elle reste soumise à confirmation.": [". Он ожидает подтверждения.", "。尚待确认。"], "Un récapitulatif vous a été envoyé par e-mail.": ["Сводка отправлена вам по электронной почте (на английском).", "摘要已通过电子邮件（英文）发送给您。"], "Le récapitulatif par e-mail n’a pas pu être envoyé. Votre demande nous est bien parvenue.": ["Не удалось отправить сводку по почте, но ваш запрос получен.", "摘要邮件未能发送，但我们已收到您的需求。"], "L’envoi a échoué. Vous pouvez réessayer ; aucune réservation n’a été confirmée.": ["Отправка не удалась. Попробуйте ещё раз; бронирование не подтверждено.", "提交失败。请重试；预订尚未确认。"], "L’envoi n’est pas encore disponible. Vos coordonnées n’ont pas été transmises.": ["Отправка пока недоступна. Ваши данные не переданы.", "暂时无法提交。您的信息未被发送。"], "Mars": ["Март", "三月"], "Festival de Cannes": ["Каннский кинофестиваль", "戛纳电影节"], "Grand Prix": ["Гран-при", "大奖赛"], "Aéroport de Cannes-Mandelieu": ["Аэропорт Канны-Манделье", "戛纳-芒德略机场"], "Réserver": ["Заказать", "预订"], "Réserver →": ["Заказать →", "预订 →"]};
  const EXTRA = ['ru', 'zh'];
  const pageLang = (document.documentElement.lang || '').slice(0, 2);
  const map = new Map(D.map(r => [r[0], r]));
  const pageMeta = window.EPS_I18N_PAGE || {};
  let lang = 'fr';
  const tr = s => { if (lang === 'fr' || s == null) return s; if (EXTRA.includes(lang)) { const x = RZ[s]; if (x) return x[EXTRA.indexOf(lang)]; const e = map.get(s); return e ? e[1] : s; } const r = map.get(s); return r ? r[LANGS.indexOf(lang)] : s; };
  const trText = s => { const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(s); if (!m[2]) return s; return m[1] + tr(m[2]) + m[3]; };
  const originals = new WeakMap(), skip = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT']);
  const ATTRS = ['aria-label', 'alt', 'placeholder', 'title'];
  function apply() {
    if (!EXTRA.includes(lang)) document.documentElement.lang = lang;
    document.querySelectorAll('.lang-toggle button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
    while ((n = w.nextNode())) {
      if (skip.has(n.parentElement?.tagName) || n.parentElement?.closest('[data-no-i18n]')) continue;
      if (!originals.has(n)) originals.set(n, n.nodeValue);
      const v = trText(originals.get(n)); if (n.nodeValue !== v) n.nodeValue = v;
    }
    document.querySelectorAll(ATTRS.map(a => '[' + a + ']').join(',')).forEach(el => {
      for (const a of ATTRS) {
        if (!el.hasAttribute(a)) continue;
        const k = 'i18n' + a.replace(/-./g, x => x[1].toUpperCase()).replace(/^./, c => c.toUpperCase());
        if (el.dataset[k] == null) el.dataset[k] = el.getAttribute(a);
        el.setAttribute(a, tr(el.dataset[k]));
      }
    });
    document.querySelectorAll('[data-href-intl]').forEach(a => { if (a.dataset.hrefFr == null) a.dataset.hrefFr = a.getAttribute('href'); a.setAttribute('href', lang === 'fr' ? a.dataset.hrefFr : a.dataset.hrefIntl); });
    document.querySelectorAll('[data-href-en]').forEach(a => { if (a.dataset.hrefFr == null) a.dataset.hrefFr = a.getAttribute('href'); a.setAttribute('href', lang === 'en' ? a.dataset.hrefEn : a.dataset.hrefFr); });
    try { document.dispatchEvent(new CustomEvent('eps:language', { detail: lang })); } catch (_) {}
    if (pageMeta.title && !EXTRA.includes(lang)) document.title = pageMeta.title[LANGS.indexOf(lang)] || pageMeta.title[0];
  }
  window.epsLanguage = () => lang;
  window.epsTranslate = tr;
  window.epsSetLanguage = v => {
    if (EXTRA.includes(pageLang)) return;
    lang = LANGS.includes(v) ? v : 'fr';
    try { localStorage.setItem('eps-language', lang); } catch {}
    apply(); window.epsRefreshBooking?.();
  };
  document.querySelectorAll('.lang-toggle button').forEach(b => b.addEventListener('click', () => window.epsSetLanguage(b.dataset.lang)));
  try { const q = new URLSearchParams(location.search).get('lang'); const s = q || localStorage.getItem('eps-language'); if (LANGS.includes(s)) lang = s; } catch {}
  if (EXTRA.includes(pageLang)) lang = pageLang;
  if (lang !== 'fr') apply(); else document.querySelectorAll('.lang-toggle button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === 'fr')));
})();
