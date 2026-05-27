import { useState, useMemo } from "react";

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────
const S = {
  available: { label: "Likely Available", color: "#4ade80", dot: "#22c55e", bg: "#020d05", border: "#404040" },
  unknown:   { label: "No Dates Listed",  color: "#94a3b8", dot: "#64748b", bg: "#07090c", border: "#404040" },
  partial:   { label: "Partial / Logistics", color: "#fb923c", dot: "#f97316", bg: "#0c0602", border: "#404040" },
  conflict:  { label: "Conflict / N/A",   color: "#f87171", dot: "#ef4444", bg: "#0c0202", border: "#404040" },
};

// ─── TIERS (shown in order) ───────────────────────────────────────────────────
const TIERS = [
  { key: "top",      label: "★  Strong Picks",        desc: "Available dates + compelling fit + strategic case" },
  { key: "available",label: "✓  Likely Available",    desc: "Dates look open — worth inquiring" },
  { key: "unknown",  label: "?  No Dates Announced",  desc: "Nothing listed publicly — unknown if touring" },
  { key: "partial",  label: "~  Partial / Logistics", desc: "Minor conflict or travel issue" },
  { key: "conflict", label: "✗  Conflict / N/A",      desc: "Booked, on hiatus, or wrong profile" },
];

// ─── ARTIST DATA ──────────────────────────────────────────────────────────────
const ALL = [
  // ── STRONG PICKS ────────────────────────────────────────────────────────────
  {
    name: "KALEO",
    genre: "Folk / Blues / Rock",
    tier: "available",
    lastBefore: "~Jul 18–21 – Kansas City, MO (US leg wraps)",
    firstAfter: "Sep 11–12 – Cavendish, PEI",
    notes: "Nearly 7-week open window, already in Canada Jul 4 (Vancouver). Dates are clean — but EFF has booked them multiple times recently, so repeat-booking value is the main consideration.",
  },
  {
    name: "Cowboy Junkies",
    genre: "Alt-Country / Folk Rock",
    tier: "top",
    lastBefore: "Jul 19 – Hillside Festival, Guelph, ON",
    firstAfter: "Sep 10 – Ghost Ranch Festival, NM",
    notes: "Nearly 8-week open window. Celebrating 40 Years and Beyond tour. Deeply Canadian, deeply folk — Trinity Session legacy, Margo Timmins' voice. Exactly Edmonton's profile. One of the cleanest windows in the whole list.",
    highlight: true,
  },
  {
    name: "Crash Test Dummies",
    genre: "Folk Rock / Alt-Country",
    tier: "top",
    lastBefore: "Jul 30–Aug 2 – Saint John, NB (festival)",
    firstAfter: "Aug 15 – Yorkton, SK",
    notes: "Edmonton Aug 6–9 slots cleanly between Saint John and Yorkton. Already routing Western Canada that summer. Winnipeg Folk Fest Jul 9–12 too — same circuit as Dan Mangan and the Barr Brothers. Brad Roberts' baritone is a folk fest moment.",
    highlight: true,
  },
  {
    name: "Death Cab for Cutie",
    genre: "Indie Rock / Folk",
    tier: "conflict",
    lastBefore: "Aug 2–3 – Los Angeles, CA (Greek Theatre)",
    firstAfter: "Tour ends Aug 7 – Paso Robles, CA",
    notes: "I Built You A Tower World Tour wraps Aug 7 in California. Their final shows run Aug 2–7, directly through Edmonton's window.",
  },
  {
    name: "Alabama Shakes",
    genre: "Blues-Rock / Soul",
    tier: "top",
    lastBefore: "Jul 26 – Vancouver, BC",
    firstAfter: "Sep 19 – Dover, DE (Zach Bryan support)",
    notes: "Nearly 7-week open window after Vancouver. Reunion tour with new album in progress — peak profile moment. Brittany Howard, Hold On, Don't Wanna Fight. Blues-soul headliner energy that Edmonton programs toward. Strong prediction candidate.",
  },
  {
    name: "Begonia",
    genre: "Indie Pop / Soul",
    tier: "top",
    lastBefore: "Aug 1–3 – Canmore Folk Festival, AB",
    firstAfter: "Sep 29 – Hamilton, ON (fall tour)",
    notes: "Canmore Folk Fest Aug 1–3, then nothing until late September. Canmore → Edmonton is a two-Alberta-folk-fests routing that practically books itself. Already on the Canadian folk circuit. Strong fit.",
    highlight: true,
  },
  {
    name: "A Tribe Called Red",
    genre: "Indigenous Electronic / Pow Wow Step",
    tier: "available",
    lastBefore: "Jul 23 – Baie-Saint-Paul, QC (Le Festif!)",
    firstAfter: "No known dates",
    notes: "Now performing as The Halluci Nation. One confirmed Jul 23 date, nothing after. Aug 6–9 looks open. Culturally significant booking for Edmonton — Indigenous electronic music is a distinct and powerful headliner profile.",
    highlight: false,
  },
  {
    name: "Aysanabee",
    genre: "Indie Folk / Oji-Cree",
    tier: "available",
    lastBefore: "No confirmed summer dates",
    firstAfter: "Double Dragon, Edmonton (fall — date TBD)",
    notes: "Played EFF 2025 to strong response. Juno Award winner (Alternative Album + Songwriter 2024). Next listed dates are small club shows in Edmonton and Red Deer in the fall — no radius issue. Worth noting: club scale currently, so this would be a step-up booking.",
    highlight: false,
  },
  {
    name: "Allison Russell",
    genre: "Folk / Americana / Soul",
    tier: "conflict",
    lastBefore: "Aug 4–5 – Los Angeles, CA (Greek Theatre)",
    firstAfter: "Aug 7 – Bend, OR → Aug 8–9 – Woodinville, WA",
    notes: "Opening for Sarah McLachlan on Better Broken Tour — Aug 7 Bend, Aug 8–9 Woodinville WA. Played EFF 2025. Has her own Canadian solo tour in Oct/Nov with an Edmonton date. Not available this summer.",
    highlight: false,
  },
  {
    name: "Sarah McLachlan",
    genre: "Folk / Pop / Rock",
    tier: "conflict",
    lastBefore: "Aug 5 – Los Angeles, CA (Greek Theatre)",
    firstAfter: "Tour ends Aug 8–9 – Woodinville, WA",
    notes: "Better Broken Tour wraps Aug 8–9 in Washington state. Tour runs right through Edmonton's window. Canadian icon — an extraordinary booking if the timing ever aligned, but not this year.",
    highlight: false,
  },
  {
    name: "Father John Misty",
    genre: "Indie Folk / Rock",
    tier: "top",
    lastBefore: "Jul 9–12 – Winnipeg Folk Festival, MB",
    firstAfter: "Sep 25 – All Things Go Festival, MD",
    notes: "Already headlining Winnipeg Folk Fest — same circuit, same agent conversation. Clear window through August. Perfect profile match.",
  },
  {
    name: "First Aid Kit",
    genre: "Folk / Indie",
    tier: "top",
    lastBefore: "No NA dates",
    firstAfter: "Sep 29 – Royal Albert Hall, London",
    notes: "No North American dates anywhere this summer. Near-perfect folk fest fit. Wide open window.",
  },
  {
    name: "Watchhouse",
    genre: "Folk / Americana",
    tier: "top",
    lastBefore: "Aug 5 – St. Louis, MO",
    firstAfter: "Aug 13 – Tarrytown, NY",
    notes: "Gap is almost purpose-built for Edmonton. New album out May 2025. Ideal folk fest fit.",
  },
  {
    name: "Dan Mangan",
    genre: "Indie Folk / Rock",
    tier: "top",
    lastBefore: "Jul 9–12 – Winnipeg Folk Festival, MB",
    firstAfter: "Aug 25 – Burnaby, BC",
    notes: "Canadian artist already routing Western Canada — Sep dates in Lethbridge and Red Deer AB. Edmonton fills the gap perfectly and completes the circuit.",
  },
  {
    name: "Tank and the Bangas",
    genre: "Soul / Neo-Soul / Funk",
    tier: "top",
    lastBefore: "Jul 4 – Portland, OR",
    firstAfter: "Oct 15 – Atlanta, GA",
    notes: "Three-month open window. New album out May 2026 — peak promo moment. Exactly the Roots / Black Pumas energy Edmonton books.",
  },
  {
    name: "Durand Jones & The Indications",
    genre: "Soul / R&B / Funk",
    tier: "top",
    lastBefore: "Jul 2 – Portland, OR (Waterfront Blues Festival)",
    firstAfter: "Aug 21 – Denver, CO (Fiddler's Green)",
    notes: "Six-week open window. New album Flowers out 2025. High-profile moment. Ideal Roots-adjacent slot — one of the best live soul acts right now.",
  },
  {
    name: "The Barr Brothers",
    genre: "Indie Folk / Rock",
    tier: "top",
    lastBefore: "Jul 9–12 – Winnipeg Folk Festival, MB",
    firstAfter: "No known dates",
    notes: "Montreal-based, harp-driven indie folk. Winnipeg → Edmonton is a natural circuit hop. New album Let It Hiss out now. Strong Ben Howard / National adjacency.",
  },
  {
    name: "CAAMP",
    genre: "Folk / Indie",
    tier: "partial",
    lastBefore: "Jul 25 – Merriweather Post Pavilion, MD",
    firstAfter: "Aug 12 – Missoula, MT → ~Aug 14–16 – Edmonton (sold-out headline show)",
    notes: "Has a sold-out Edmonton headline show the weekend right after Folk Fest — likely within the radius clause window of the booking promoter. Would require that promoter's explicit sign-off. Same issue as Bahamas.",
  },
  {
    name: "Gregory Alan Isakov",
    genre: "Indie Folk",
    tier: "top",
    lastBefore: "May 14 – Washington, DC",
    firstAfter: "Aug 28 – Asheville, NC",
    notes: "Tour wrapped in May. Wide open through late August. Quintessential folk fest headliner.",
  },

  // ── LIKELY AVAILABLE ────────────────────────────────────────────────────────
  {
    name: "Sylvan Esso",
    genre: "Indie Folk / Electronic Pop",
    tier: "top",
    lastBefore: "Jul 9–12 – Winnipeg Folk Festival",
    firstAfter: "Oct 8 – Durham, NC (GOOD MOON show)",
    notes: "Nearly 3-month open window after Winnipeg. One of the most suspicious gaps on the whole list for a prediction exercise. Folk-electronic duo, strong festival profile. Would be an interesting and somewhat unexpected EFF booking.",
  },
  {
    name: "Wolf Parade",
    genre: "Indie Rock / Art Rock",
    tier: "top",
    lastBefore: "Aug 1 – Osheaga, Montreal",
    firstAfter: "Nov 10 – Calgary, AB (fall Canadian tour)",
    notes: "Winnipeg Jul 9–12, Osheaga Aug 1, then nothing until Nov 10. Aug 6–9 is wide open. Already have an Edmonton show booked Nov 11 at Midway — 94 days after folk fest, just outside a 90-day radius clause. Spencer Krug + Dan Boeckner's dual-vocal indie rock is a strong and distinctive EFF fit.",
  },
  {
    name: "Kathleen Edwards",
    genre: "Alt-Country / Folk Rock",
    tier: "top",
    lastBefore: "Jul 9–12 – Winnipeg Folk Festival",
    firstAfter: "No confirmed dates",
    notes: "Only confirmed 2026 date is Winnipeg. Nothing else showing anywhere. Canadian alt-country legend from Ottawa — Return To Me era, beloved by folk festival crowds. Open window and perfect fit makes this a strong prediction.",
  },
  {
    name: "Corb Lund",
    genre: "Country / Folk / Western",
    tier: "top",
    lastBefore: "Jul 9–12 – Winnipeg Folk Festival",
    firstAfter: "No confirmed dates",
    notes: "No 2026 summer dates found beyond Winnipeg. He's from Taber, Alberta — home province booking, deeply rooted in the western Canadian folk and country circuit. Strong prediction candidate.",
  },
  {
    name: "Nathaniel Rateliff",
    genre: "Soul / Folk / Rock",
    tier: "top",
    lastBefore: "May 30 – Greek Theatre, UC Berkeley, CA",
    firstAfter: "Aug 18 – Red Rocks Amphitheatre, CO (with Colorado Symphony)",
    notes: "Nearly 10-week open window. Soul belter with deep folk roots — plays both solo and with the Night Sweats. Big name, perfect fit for Edmonton's headliner profile. Also at Winnipeg Folk Fest this summer.",
  },
  {
    name: "The Sheepdogs",
    genre: "Classic Rock / Roots",
    tier: "available",
    lastBefore: "Jul 19 – Ottawa Bluesfest",
    firstAfter: "Aug 14–15 – The KEE to Bala, ON",
    notes: "Aug 6–9 sits cleanly between Ottawa and Bala. Saskatoon band, toured Western Canada (incl. Edmonton Winspear Apr 20) this spring — far enough out to clear a 90-day radius clause. More classic rock than folk but deeply Canadian.",
  },
  {
    name: "The Glorious Sons",
    genre: "Rock / Alt-Rock",
    tier: "available",
    lastBefore: "Aug 1 – The KEE to Bala, ON (2nd night)",
    firstAfter: "Sep 11 – (Ontario date)",
    notes: "Aug 6–9 is open — 5 days after Bala, doable by flight from Ontario. Kingston band, Juno winners. Genre skews rock over folk, but strong Canadian credibility.",
  },
  {
    name: "Matthew Good",
    genre: "Alt-Rock / Indie",
    tier: "available",
    lastBefore: "May 28–30 – Ontario (with I Mother Earth)",
    firstAfter: "No confirmed summer dates",
    notes: "Wide open after late May Ontario dates. Canadian alt-rock icon — Apparitions, Vancouver, Loser Anthems era. Worth flagging: documented history of unpredictable live performances. Compelling booking if he's in a stable touring cycle.",
  },
  {
    name: "Dave Matthews Band",
    genre: "Jam Rock / Folk Rock",
    tier: "available",
    lastBefore: "Jul 25 – (US amphitheater tour)",
    firstAfter: "Aug 28–29 – Fiddler's Green, CO → Sep 4–6 – The Gorge, WA",
    notes: "Dates technically open Aug 6–9. Major caveat: DMB plays 15,000–30,000 seat amphitheaters. Booking fee almost certainly exceeds folk fest budget range. A dream booking, not a realistic one.",
  },
  {
    name: "Barns Courtney",
    genre: "Blues-Rock / Folk-Rock",
    tier: "available",
    lastBefore: "Jun 7 – (Unplugged Solo Sessions tour wraps)",
    firstAfter: "No confirmed summer dates",
    notes: "Unplugged Solo Sessions tour ends early June, nothing listed after. Aug 6–9 looks open. British blues-rock — Fire, Glitter & Gold. Festival-ready energy, more rock than folk but could fit a Saturday night headliner slot.",
  },
  {
    name: "Margo Price",
    genre: "Country / Americana",
    tier: "available",
    lastBefore: "Jul 9–12 – Winnipeg Folk Festival",
    firstAfter: "No confirmed summer dates",
    notes: "Winnipeg confirmed, no other reliable summer dates found. Americana/country with strong folk festival credibility. Window is open.",
  },
  {
    name: "Billy Bragg",
    genre: "Folk / Punk / Political",
    tier: "available",
    lastBefore: "Jul 16 – Ottawa Bluesfest",
    firstAfter: "No confirmed North American dates",
    notes: "North American run ends Ottawa Jul 16. Aug 6–9 technically open, though he typically returns to the UK after Canadian runs. Possible festival add-on if he extends the trip west.",
  },
  {
    name: "Leif Vollebekk",
    genre: "Indie Folk / Singer-Songwriter",
    tier: "available",
    lastBefore: "Jul 9–12 – Winnipeg Folk Festival",
    firstAfter: "No confirmed dates",
    notes: "Nothing found beyond Winnipeg. Montreal-based Canadian singer-songwriter, quiet and intimate folk sound. Mid-bill EFF profile rather than headliner, but very much the programming style.",
  },
  {
    name: "Lucy Dacus",
    genre: "Indie Rock / Folk",
    tier: "conflict",
    lastBefore: "Jul 25 – Asbury Park, NJ",
    firstAfter: "Aug 8 – Outside Lands, San Francisco, CA",
    notes: "Playing Outside Lands Aug 7–9 in San Francisco. Direct conflict with Edmonton's window. Strong fit otherwise — boygenius member, beloved by folk festival crowds.",
  },
  {
    name: "Grace Potter",
    genre: "Rock / Blues / Soul",
    tier: "available",
    lastBefore: "Jul 24–25 – The Gorge, Quincy, WA (Chris Stapleton support)",
    firstAfter: "Aug 27 – Forest Hills Stadium, NY (Zac Brown Band support)",
    notes: "Month-long gap between Stapleton and Zac Brown dates. Aug 6–9 is wide open for an independent booking. Rock/blues/soul hybrid — not a pure folk fit but Edmonton programs in that direction.",
  },
  {
    name: "Shakey Graves",
    genre: "Folk / Americana / Blues",
    tier: "available",
    lastBefore: "Jul 30–Aug 2 – Pickathon, Happy Valley, OR",
    firstAfter: "Aug 26 – Tønder Festival, Denmark",
    notes: "Pickathon wraps Aug 2, Europe doesn't start until Aug 26. Portland to Edmonton is a two-hour flight — very doable. Active Fondness, Etc. Tour with a clean window over Edmonton's dates.",
  },
  {
    name: "Killer Mike",
    genre: "Hip-Hop / Rap",
    tier: "unknown",
    lastBefore: "—",
    firstAfter: "—",
    notes: "No 2026 dates listed anywhere. Genre fit is the bigger question — he's hip-hop/political rap (Run the Jewels), which is a different lane than Edmonton's typical programming. Would be an unusual booking, though culturally compelling.",
  },
  {
    name: "Band of Horses",
    genre: "Indie Rock / Folk",
    tier: "conflict",
    lastBefore: "Aug 1 – La Vista, NE",
    firstAfter: "Aug 12–15 – Oslo, Norway",
    notes: "Aug 7 in Bellvue, CO and Aug 9 in Waukegan, IL both fall directly inside Edmonton's window. Direct conflict.",
  },
  {
    name: "Tyler Childers",
    genre: "Country / Americana",
    tier: "available",
    lastBefore: "Jul 18 – Boulder, CO (Folsom Field)",
    firstAfter: "Sep 26 – Ohana Festival, CA",
    notes: "10+ week gap. Massive name. Currently at stadium scale — booking fee may be above folk fest range, but the window is there.",
  },
  {
    name: "Adrianne Lenker",
    genre: "Indie Folk",
    tier: "available",
    lastBefore: "Apr 25 – London (UK leg)",
    firstAfter: "Aug 13 – Chicago, IL (Salt Shed)",
    notes: "US dates resume Aug 13. Aug 6–9 is open.",
  },
  {
    name: "Marcus King",
    genre: "Blues / Rock / Soul",
    tier: "available",
    lastBefore: "Jul 10 – Grand Targhee Festival, WY",
    firstAfter: "Aug 20 – (tour resumes)",
    notes: "Clean gap. Nathaniel Rateliff-adjacent energy. Fits the soul/rock headliner slot well.",
  },
  {
    name: "Waxahatchee",
    genre: "Indie Folk / Americana",
    tier: "available",
    lastBefore: "Apr–May (spring tour with MJ Lenderman)",
    firstAfter: "Sep – Farm Aid, Bourbon & Beyond",
    notes: "Spring done, fall festival run starts September. Aug 6–9 looks open. Strong folk fest fit.",
  },
  {
    name: "Kevin Morby",
    genre: "Indie Folk / Rock",
    tier: "available",
    lastBefore: "Jul 24–26 – Latitude Festival, UK",
    firstAfter: "Sep 19 – Iron Blossom Festival",
    notes: "Tour wraps with Latitude. No August dates listed. New album Little Wide Open out May 2026.",
  },
  {
    name: "Hazlett",
    genre: "Indie Folk",
    tier: "available",
    lastBefore: "Jul 17–19 – Vancouver Folk Fest",
    firstAfter: "Sep 11 – Cavendish, PEI",
    notes: "Already on the Canadian folk circuit. Aug 6–9 is open.",
  },
  {
    name: "Bon Iver",
    genre: "Indie Folk",
    tier: "available",
    lastBefore: "Jul 24–25 – Eaux Claires, WI",
    firstAfter: "No known dates",
    notes: "No announced dates after Eaux Claires. Selective booker — harder pitch, but genuinely available.",
  },
  {
    name: "Khruangbin",
    genre: "Psychedelic Soul",
    tier: "available",
    lastBefore: "Jul 31–Aug 2 – Incheon, South Korea",
    firstAfter: "No known NA dates",
    notes: "Asia run ends Aug 2. Nothing after in North America. Travel from Seoul is feasible. Strong Black Pumas-adjacent fit.",
  },
  {
    name: "Phosphorescent",
    genre: "Indie Folk / Roots",
    tier: "available",
    lastBefore: "Jun 20 – Nashville, TN",
    firstAfter: "European dates (Paris, Antwerp etc.)",
    notes: "Very selective about shows. No NA August dates. Quiet career moment — strong fit if they'd consider it.",
  },
  {
    name: "Cage the Elephant",
    genre: "Alt Rock",
    tier: "available",
    lastBefore: "Jul 19 – St. Paul, MN (Minnesota Yacht Club)",
    firstAfter: "No known dates",
    notes: "Nothing after Jul 19. Dates open. Genre skews more alt rock than Edmonton's usual — lower fit but the window is there.",
  },

  // ── NO DATES ANNOUNCED ──────────────────────────────────────────────────────
  {
    name: "City and Colour",
    genre: "Folk / Rock / Indie",
    tier: "unknown",
    lastBefore: "—",
    firstAfter: "—",
    notes: "No 2026 dates announced anywhere. Dallas Green between album cycles after The Love Still Held Me Near. One of the most natural EFF fits on the board — Canadian folk-rock icon, Saint Catharines ON, deeply emotional live show. Worth a direct management inquiry.",
  },
  {
    name: "Fleet Foxes",
    genre: "Indie Folk",
    tier: "unknown",
    lastBefore: "—",
    firstAfter: "—",
    notes: "Zero official 2026 dates on Ticketmaster or Songkick. Would be a major booking. Worth a direct inquiry to management.",
  },
  {
    name: "Maggie Rogers",
    genre: "Indie Pop / Folk",
    tier: "unknown",
    lastBefore: "—",
    firstAfter: "—",
    notes: "No 2026 dates anywhere. Don't Forget Me Tour wrapped 2024. Could be between cycles or unannounced.",
  },
  {
    name: "Angel Olsen",
    genre: "Indie Rock / Folk",
    tier: "unknown",
    lastBefore: "Feb 2026 (winter tour)",
    firstAfter: "No known dates",
    notes: "No summer 2026 dates listed. Strong City and Colour-profile fit. Direct inquiry worth it.",
  },
  {
    name: "Hozier",
    genre: "Folk / Rock",
    tier: "unknown",
    lastBefore: "—",
    firstAfter: "Possibly Aug 20 – Reading/Leeds, UK (unconfirmed)",
    notes: "No official 2026 dates. Fan sites suggest European tour kicks off Aug 20. If accurate, Edmonton could be a pre-tour warm-up window.",
  },
  {
    name: "Novo Amor",
    genre: "Indie Folk",
    tier: "unknown",
    lastBefore: "—",
    firstAfter: "—",
    notes: "No 2026 dates listed anywhere. Unclear if touring at all.",
  },
  {
    name: "Sufjan Stevens",
    genre: "Art Folk / Indie",
    tier: "unknown",
    lastBefore: "—",
    firstAfter: "—",
    notes: "No 2026 dates. Has been recovering from Guillain-Barré syndrome (2023). Some limited shows but unpredictable. A long shot — but would be extraordinary.",
  },

  // ── PARTIAL / LOGISTICS ─────────────────────────────────────────────────────
  {
    name: "Bahamas",
    genre: "Indie Folk / Soul",
    tier: "partial",
    lastBefore: "No known summer dates before Sep 18",
    firstAfter: "Sep 18 – Victoria, BC → Sep 22 – Edmonton, AB (Winspear Centre)",
    notes: "Already booked at Edmonton's Winspear Centre on Sep 22 — 47 days after folk fest ends. Radius clause likely blocks a second Edmonton show within 90 days. Would need both promoters to agree. His agent is already routing Western Canada though.",
  },
  {
    name: "Brandi Carlile",
    genre: "Folk / Rock / Americana",
    tier: "partial",
    lastBefore: "Jul 23 – Montauk, NY",
    firstAfter: "Aug 13 – Portland, ME (The Human Tour North American leg 2, 21 shows)",
    notes: "Aug 6–9 is technically open but she launches a major 21-show amphitheater tour on Aug 13 — four days after folk fest ends. Pre-production mode makes this window unlikely. Scale is also amphitheater-level. Not a realistic prediction for this year.",
  },
  {
    name: "José González",
    genre: "Acoustic Folk / Indie",
    tier: "partial",
    lastBefore: "Jul 29 – Madrid, Spain",
    firstAfter: "Aug 21 – Lowlands Festival, Netherlands",
    notes: "Mid-European stretch Aug 6–9. Technically no show on those dates but transatlantic travel for Edmonton and back is unlikely. Canadian tour starts Sep 11.",
  },
  {
    name: "Lord Huron",
    genre: "Indie Folk / Rock",
    tier: "partial",
    lastBefore: "Aug 2 – Washington, DC",
    firstAfter: "Aug 8 – Beech Mountain, NC",
    notes: "Aug 8 show in NC falls inside Edmonton's window. Aug 6–7 could technically work but logistics are very tight.",
  },
  {
    name: "Zach Bryan",
    genre: "Country / Folk Rock",
    tier: "partial",
    lastBefore: "Aug 1 – San Diego, CA",
    firstAfter: "Aug 7 – Salt Lake City, UT",
    notes: "Aug 7 lands inside Edmonton's window. Also playing 60,000-seat stadiums — scale is well above folk fest range.",
  },

  // ── CONFLICT / NOT AVAILABLE ────────────────────────────────────────────────
  {
    name: "Of Monsters and Men",
    genre: "Indie Folk / Rock",
    tier: "conflict",
    lastBefore: "Jul 31–Aug 2 – Osheaga, Montreal",
    firstAfter: "Sep 19 – CityFolk Festival, Ottawa",
    notes: "Playing Red Rocks Aug 6 — opening day of Edmonton. Also on Calgary Folk Fest Jul 23–26. Packed run right through Edmonton's dates.",
  },
  {
    name: "Noah Kahan",
    genre: "Folk / Pop",
    tier: "conflict",
    lastBefore: "Aug 5 – Minneapolis, MN",
    firstAfter: "Aug 15 – Pasadena, CA",
    notes: "Aug 8–9 at Coors Field, Denver — 2-night stadium run.",
  },
  {
    name: "Iron & Wine",
    genre: "Indie Folk",
    tier: "conflict",
    lastBefore: "May 14 – Washington, DC",
    firstAfter: "Aug 7–9 – Portland Folk Fest, ME",
    notes: "Playing Portland ME folk festival Aug 7–9. Direct clash.",
  },
  {
    name: "Lake Street Dive",
    genre: "Soul / Pop / Jazz",
    tier: "conflict",
    lastBefore: "Aug 5 – Lafayette, NY",
    firstAfter: "Aug 11 – Shelburne, VT",
    notes: "Three back-to-back nights Aug 7–9 (Niagara Falls, Cohasset MA, Hyannis MA).",
  },
  {
    name: "The Revivalists",
    genre: "Rock / Soul",
    tier: "conflict",
    lastBefore: "Aug 5 – Laval, QC",
    firstAfter: "Aug 9 – Madison Square Garden, NY",
    notes: "Supporting Red Clay Strays: Aug 5 Laval, Aug 7 Philadelphia, Aug 9 MSG.",
  },
  {
    name: "Colter Wall",
    genre: "Folk / Country",
    tier: "conflict",
    lastBefore: "Tour cancelled Mar 2026",
    firstAfter: "Indefinite hiatus",
    notes: "Cancelled entire 2026 tour for mental health reasons. On indefinite hiatus — not appropriate to pitch.",
  },
  {
    name: "Ella Langley",
    genre: "Country",
    tier: "partial",
    lastBefore: "Aug 1 – Philadelphia, PA (Morgan Wallen stadium)",
    firstAfter: "Aug 13 – Austin, TX",
    notes: "Dates are open Aug 6–9. Genre fit is debatable — EFF has booked country artists (Orville Peck), but Langley is currently in the Morgan Wallen stadium lane rather than the indie/alt-country lane Peck represents. Unconventional pick, but not impossible if Edmonton wants a commercial country breakout name.",
  },
  {
    name: "Air Supply",
    genre: "Soft Rock / Pop",
    tier: "conflict",
    lastBefore: "Aug 2 – Gary, IN",
    firstAfter: "Aug 26 – Hampton Beach, NH",
    notes: "Aug 6 Fresno, Aug 7 Murphys CA, Aug 9 California — booked all three key dates. Also not Edmonton's profile.",
  },
];

const CATS = ["All", "Folk / Indie Folk", "Alt / Soul / Indie", "National / Ben Howard Lane"];

// Assign categories loosely for filtering
const CAT_MAP = {
  "Alabama Shakes": "Alt / Soul / Indie",
  "Brandi Carlile": "Folk / Indie Folk",
  "Father John Misty": "National / Ben Howard Lane",
  "First Aid Kit": "Folk / Indie Folk",
  "Watchhouse": "Folk / Indie Folk",
  "Dan Mangan": "National / Ben Howard Lane",
  "Tank and the Bangas": "Alt / Soul / Indie",
  "Durand Jones & The Indications": "Alt / Soul / Indie",
  "The Barr Brothers": "National / Ben Howard Lane",
  "CAAMP": "Folk / Indie Folk",
  "Gregory Alan Isakov": "Folk / Indie Folk",
  "Nathaniel Rateliff": "Alt / Soul / Indie",
  "The Sheepdogs": "National / Ben Howard Lane",
  "The Glorious Sons": "National / Ben Howard Lane",
  "Matthew Good": "National / Ben Howard Lane",
  "Dave Matthews Band": "National / Ben Howard Lane",
  "Barns Courtney": "Alt / Soul / Indie",
  "Sylvan Esso": "Alt / Soul / Indie",
  "Wolf Parade": "National / Ben Howard Lane",
  "Kathleen Edwards": "Folk / Indie Folk",
  "Corb Lund": "Folk / Indie Folk",
  "Margo Price": "Folk / Indie Folk",
  "Billy Bragg": "Folk / Indie Folk",
  "Leif Vollebekk": "Folk / Indie Folk",
  "Lucy Dacus": "National / Ben Howard Lane",
  "Grace Potter": "Alt / Soul / Indie",
  "Shakey Graves": "Folk / Indie Folk",
  "Killer Mike": "Alt / Soul / Indie",
  "Band of Horses": "National / Ben Howard Lane",
  "Tyler Childers": "Folk / Indie Folk",
  "Adrianne Lenker": "Folk / Indie Folk",
  "Marcus King": "Alt / Soul / Indie",
  "Waxahatchee": "National / Ben Howard Lane",
  "Kevin Morby": "National / Ben Howard Lane",
  "Hazlett": "Folk / Indie Folk",
  "Bon Iver": "Folk / Indie Folk",
  "Khruangbin": "Alt / Soul / Indie",
  "Phosphorescent": "National / Ben Howard Lane",
  "Cage the Elephant": "Alt / Soul / Indie",
  "City and Colour": "National / Ben Howard Lane",
  "Fleet Foxes": "Folk / Indie Folk",
  "Maggie Rogers": "Alt / Soul / Indie",
  "Angel Olsen": "Alt / Soul / Indie",
  "Hozier": "Folk / Indie Folk",
  "Novo Amor": "Folk / Indie Folk",
  "Sufjan Stevens": "National / Ben Howard Lane",
  "José González": "National / Ben Howard Lane",
  "KALEO": "National / Ben Howard Lane",
  "Cowboy Junkies": "National / Ben Howard Lane",
  "Crash Test Dummies": "National / Ben Howard Lane",
  "Death Cab for Cutie": "National / Ben Howard Lane",
  "A Tribe Called Red": "Alt / Soul / Indie",
  "Aysanabee": "Folk / Indie Folk",
  "Allison Russell": "Folk / Indie Folk",
  "Sarah McLachlan": "Folk / Indie Folk",
  "Lord Huron": "Folk / Indie Folk",
  "Zach Bryan": "Folk / Indie Folk",
  "Of Monsters and Men": "National / Ben Howard Lane",
  "Noah Kahan": "Folk / Indie Folk",
  "Iron & Wine": "Folk / Indie Folk",
  "Lake Street Dive": "Alt / Soul / Indie",
  "The Revivalists": "Alt / Soul / Indie",
  "Colter Wall": "Folk / Indie Folk",
  "Ella Langley": "Folk / Indie Folk",
  "Air Supply": "Alt / Soul / Indie",
};

export default function App() {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [expandedTiers, setExpandedTiers] = useState({ top: true, available: true, unknown: true, partial: true, conflict: true });

  const filtered = useMemo(() => ALL.filter(a => {
    if (cat !== "All" && CAT_MAP[a.name] !== cat) return false;
    if (search.trim() && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [cat, search]);

  const byTier = useMemo(() => {
    const map = {};
    TIERS.forEach(t => { map[t.key] = filtered.filter(a => a.tier === t.key); });
    return map;
  }, [filtered]);

  const counts = useMemo(() => {
    const c = {};
    TIERS.forEach(t => { c[t.key] = ALL.filter(a => a.tier === t.key).length; });
    return c;
  }, []);

  const toggleTier = key => setExpandedTiers(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#070809", minHeight: "100vh", color: "#d8dde4" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(160deg,#0d1114 0%,#070809 100%)", borderBottom: "1px solid #404040", padding: "24px 22px 18px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#eaeff5", letterSpacing: "-0.2px" }}>
            Edmonton Folk Music Festival — Artist Research
          </h1>
          <p style={{ margin: "4px 0 14px", fontSize: 16, color: "#A3A3A3", fontStyle: "italic" }}>
            Aug 6–9, 2026 · {ALL.length} artists checked · Tour data as of May 2026
          </p>

          {/* Summary pills */}
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 14 }}>
            {[
              { key: "top",      color: "#f0c040", label: `★ Strong picks (${counts.top})` },
              { key: "available",color: "#4ade80", label: `✓ Available (${counts.available})` },
              { key: "unknown",  color: "#94a3b8", label: `? No dates (${counts.unknown})` },
              { key: "partial",  color: "#fb923c", label: `~ Partial (${counts.partial})` },
              { key: "conflict", color: "#f87171", label: `✗ Conflict (${counts.conflict})` },
            ].map(p => (
              <span key={p.key} style={{ fontSize: 15, background: "#0d1114", border: `1px solid ${p.color}22`, borderRadius: 4, padding: "3px 9px", color: p.color }}>
                {p.label}
              </span>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 3 }}>
              {CATS.map(c => (
                <button key={c} onClick={() => setCat(c)} style={{
                  background: cat === c ? "#131c28" : "transparent",
                  border: `1px solid ${cat === c ? "#A3A3A3" : "#404040"}`,
                  color: cat === c ? "#7a9ac8" : "#A3A3A3",
                  borderRadius: 4, padding: "4px 10px", fontSize: 15,
                  cursor: "pointer", fontFamily: "Georgia, serif",
                }}>{c}</button>
              ))}
            </div>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search…"
              style={{ background: "#0d1114", border: "1px solid #131c28", color: "#8898b0", borderRadius: 4, padding: "4px 10px", fontSize: 15, width: 120, fontFamily: "Georgia, serif", outline: "none" }} />
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ background: "#090a0c", borderBottom: "1px solid #404040", padding: "6px 22px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", fontSize: 15, color: "#8898b0" }}>
          ⚠ "Likely Available" = no conflicting dates found in public listings. Agents must confirm actual availability.
        </div>
      </div>

      {/* Tiers */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "14px 22px 48px" }}>
        {TIERS.map(tier => {
          const artists = byTier[tier.key];
          if (!artists || artists.length === 0) return null;
          const expanded = expandedTiers[tier.key];
          const tierColor = tier.key === "top" ? "#f0c040" : tier.key === "available" ? "#4ade80" : tier.key === "unknown" ? "#94a3b8" : tier.key === "partial" ? "#fb923c" : "#f87171";

          return (
            <div key={tier.key} style={{ marginBottom: 18 }}>
              {/* Tier header */}
              <button onClick={() => toggleTier(tier.key)} style={{
                background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left",
                padding: "8px 0 6px", display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: tierColor }}>{tier.label}</span>
                <span style={{ fontSize: 15, color: "#A3A3A3", fontStyle: "italic" }}>{tier.desc}</span>
                <span style={{ marginLeft: "auto", fontSize: 15, color: "#A3A3A3" }}>
                  {artists.length} artist{artists.length !== 1 ? "s" : ""} {expanded ? "▲" : "▼"}
                </span>
              </button>
              <div style={{ height: 1, background: `${tierColor}22`, marginBottom: 7 }} />

              {expanded && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {artists.map((a, i) => {
                    const st = S[a.tier === "top" ? "available" : a.tier];
                    const isTopTier = a.tier === "top";
                    return (
                      <div key={a.name} style={{
                        background: isTopTier ? "#0a1008" : "#090a0c",
                        border: `1px solid ${isTopTier ? "#1a3018" : "#404040"}`,
                        borderLeft: `3px solid ${isTopTier ? "#f0c040" : st.dot}`,
                        borderRadius: 6,
                        padding: "10px 14px",
                        display: "grid",
                        gridTemplateColumns: "190px 1fr",
                        gap: "0 14px",
                      }}>
                        {/* Left */}
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2, flexWrap: "wrap" }}>
                            {isTopTier && <span style={{ fontSize: 14, color: "#f0c040" }}>★</span>}
                            <span style={{ fontWeight: 700, fontSize: 16, color: "#dce8f0" }}>{a.name}</span>
                          </div>
                          <div style={{ fontSize: 15, color: "#A3A3A3", marginBottom: 5 }}>{a.genre}</div>
                          {a.lastBefore !== "—" && a.lastBefore && (
                            <div style={{ fontSize: 15, color: "#d4d4d4", lineHeight: 1.6 }}>
                              <div>← {a.lastBefore}</div>
                              {a.firstAfter && <div>→ {a.firstAfter}</div>}
                            </div>
                          )}
                        </div>
                        {/* Right */}
                        <div>
                          <p style={{ margin: 0, fontSize: 16, color: "#d4d4d4", lineHeight: 1.55 }}>{a.notes}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ borderTop: "1px solid #0e1318", padding: "10px 22px", textAlign: "center", fontSize: 15, color: "#8898b0" }}>
        Researched via Ticketmaster · Songkick · JamBase · Live Nation · Music Festival Wizard · May 2026 · Edmonton Folk Fest Aug 6–9, 2026
      </div>
    </div>
  );
}
