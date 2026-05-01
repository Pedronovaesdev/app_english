/** Diálogos originais para prática oral — cenários comuns em materiais ESL e contexto técnico (B1–B2). */

export type DialogueLine = { speaker: string; line: string };

export type DialogueBlock = {
  id: string;
  title: string;
  subtitle: string;
  lines: DialogueLine[];
};

export const DIALOGUE_BLOCKS: DialogueBlock[] = [
  {
    id: "travel",
    title: "Viagem",
    subtitle: "Aeroporto, atraso e conexão",
    lines: [
      { speaker: "Agent", line: "Good afternoon. May I see your passport and boarding pass, please?" },
      { speaker: "You", line: "Here you are. I’m connecting to Houston in two hours — is this the right line?" },
      { speaker: "Agent", line: "Yes, it is. Do you have any checked baggage today?" },
      { speaker: "You", line: "Just this carry-on. Could you tell me which gate usually handles domestic connections?" },
      { speaker: "Agent", line: "Check the monitors after security; gates can change. Have a pleasant flight." },
    ],
  },
  {
    id: "work",
    title: "Trabalho",
    subtitle: "Alinhamento rápido com o chefe de equipa",
    lines: [
      { speaker: "Lead", line: "Morning — can you give me a sixty-second update on the rollout blocker?" },
      { speaker: "You", line: "Sure. We’re waiting on sign-off from compliance; the build itself is green in staging." },
      { speaker: "Lead", line: "What’s your fallback if we don’t get sign-off by noon?" },
      { speaker: "You", line: "We’ll ship behind a feature flag and enable it for internal users first, then expand." },
      { speaker: "Lead", line: "Sounds reasonable. Loop me in before you toggle anything in production." },
    ],
  },
  {
    id: "daily",
    title: "Dia a dia",
    subtitle: "Banco de bairro e horário",
    lines: [
      { speaker: "Teller", line: "Hi there — how can I help you today?" },
      { speaker: "You", line: "Hi. I’d like to deposit this cheque and ask whether you’re open on Saturday mornings." },
      { speaker: "Teller", line: "We’re open Saturdays from nine to one. Do you need a balance printout as well?" },
      { speaker: "You", line: "Not today, thanks. Could you confirm when the funds will be available?" },
      { speaker: "Teller", line: "For this amount, the usual hold is two business days. Anything else?" },
    ],
  },
  {
    id: "cafe",
    title: "Cafeteria",
    subtitle: "Pedido para levar e intolerância",
    lines: [
      { speaker: "Barista", line: "Next in line — what can I get started for you?" },
      { speaker: "You", line: "Could I have a large oat latte, extra hot, and a spinach muffin to go, please?" },
      { speaker: "Barista", line: "Absolutely. Any allergies we should flag on the muffin?" },
      { speaker: "You", line: "No nuts, please. Also, could you use the plant-based milk for both drinks if I add a second one later?" },
      { speaker: "Barista", line: "Of course. Name for the cup?" },
    ],
  },
  {
    id: "ml",
    title: "Machine Learning",
    subtitle: "Dados, leakage e validação",
    lines: [
      { speaker: "Scientist", line: "Walk me through how you split the dataset — I’m worried about temporal leakage." },
      { speaker: "You", line: "We used a time-based split: train on months one to nine, validate on ten, hold out eleven." },
      { speaker: "Scientist", line: "Good. How are you monitoring drift once the model is in production?" },
      { speaker: "You", line: "We track PSI on the top features weekly and trigger a review if any score crosses the threshold." },
      { speaker: "Scientist", line: "Nice. Let’s document that in the model card before the governance review." },
    ],
  },
  {
    id: "software-arch",
    title: "Arquitetura de software",
    subtitle: "Fronteira de serviço e consistência",
    lines: [
      { speaker: "Architect", line: "Why did you choose an asynchronous boundary between billing and notifications?" },
      { speaker: "You", line: "Billing must stay strongly consistent; notifications can tolerate eventual delivery." },
      { speaker: "Architect", line: "Fair. What happens if the outbox table grows faster than the worker can drain it?" },
      { speaker: "You", line: "We alert on lag and scale consumers horizontally; worst case we pause non-critical emitters." },
      { speaker: "Architect", line: "Good operational story. Capture that in the ADR under ‘failure modes’." },
    ],
  },
  {
    id: "hotel",
    title: "Hotel",
    subtitle: "Check-in e pedidos ao quarto",
    lines: [
      { speaker: "Reception", line: "Welcome to the Riverside — do you have a reservation with us?" },
      { speaker: "You", line: "Yes, under Carvalho, two nights, non-smoking if possible." },
      { speaker: "Reception", line: "Perfect. Breakfast runs from seven to ten; Wi-Fi is complimentary. Would you like a late checkout?" },
      { speaker: "You", line: "Not unless it’s free — could someone bring an extra pillow to room four twelve tonight?" },
      { speaker: "Reception", line: "I’ll note that now. Here are your keys — elevators are to your right." },
    ],
  },
  {
    id: "interview",
    title: "Entrevista",
    subtitle: "Pergunta STAR sobre conflito",
    lines: [
      { speaker: "HR", line: "Tell me about a time you disagreed with a stakeholder and how you resolved it." },
      { speaker: "You", line: "In my last role, product wanted to ship a shortcut that bypassed audit logging." },
      { speaker: "You", line: "I explained the regulatory risk, proposed a phased release with logging enabled, and offered a timeline." },
      { speaker: "HR", line: "What was the outcome?" },
      { speaker: "You", line: "They accepted the phased plan; we shipped on schedule without compliance pushback." },
    ],
  },
  {
    id: "oil-energy",
    title: "Petróleo & energia",
    subtitle: "Curva forward e hedge",
    lines: [
      { speaker: "Trader", line: "We’re seeing strong drawdowns across the book — how do you want to hedge?" },
      { speaker: "You", line: "Shift duration into the belly and keep gamma flat until OPEC prints." },
      { speaker: "Trader", line: "Copy that. What’s your bias if inventories surprise to the downside?" },
      { speaker: "You", line: "I’d lean into calendar spreads rather than outright flat price — basis risk is cleaner there." },
      { speaker: "Trader", line: "Agreed. I’ll leg into the strangle and update you after the rig count." },
    ],
  },
  {
    id: "health",
    title: "Saúde",
    subtitle: "Consulta breve com o médico",
    lines: [
      { speaker: "Doctor", line: "What brings you in today — and how long have you had these symptoms?" },
      { speaker: "You", line: "A persistent cough for about ten days; it’s worse at night and I’ve had a low fever twice." },
      { speaker: "Doctor", line: "Any shortness of breath, chest pain, or recent travel outside the country?" },
      { speaker: "You", line: "No chest pain. I flew to London two weeks ago but felt fine until last weekend." },
      { speaker: "Doctor", line: "Let’s listen to your lungs and run a quick oxygen saturation check." },
    ],
  },
  {
    id: "shopping",
    title: "Compras",
    subtitle: "Troca de tamanho e recibo",
    lines: [
      { speaker: "Clerk", line: "Hi — did you find everything you were looking for?" },
      { speaker: "You", line: "Almost. I bought this jacket yesterday, but I need a medium instead of a small. I have the receipt." },
      { speaker: "Clerk", line: "No problem. Do you want to browse while I check stock, or would you prefer a refund?" },
      { speaker: "You", line: "If you have a medium in navy, I’ll exchange; otherwise a gift card is fine." },
      { speaker: "Clerk", line: "Let me scan this — give me one moment at the terminal." },
    ],
  },
  {
    id: "support",
    title: "Apoio ao cliente",
    subtitle: "Chamada por falha de login",
    lines: [
      { speaker: "Support", line: "Thanks for calling Northwind support — can I start with your account email?" },
      { speaker: "You", line: "It’s ana.silva@example.com. I keep getting ‘invalid credentials’ even after resetting the password." },
      { speaker: "Support", line: "Understood. Are you logging in from the mobile app, the browser, or both?" },
      { speaker: "You", line: "Browser on Chrome — and yes, I cleared cache and tried an incognito window." },
      { speaker: "Support", line: "I see a soft lock on the account from too many attempts; I can remove that now." },
    ],
  },
  {
    id: "smalltalk",
    title: "Small talk",
    subtitle: "Elevador com colega de outra equipa",
    lines: [
      { speaker: "Colleague", line: "Hey — crazy week, huh? Are you heading to the all-hands later?" },
      { speaker: "You", line: "Definitely. I’m curious whether they’ll mention the roadmap shift we heard about in Slack." },
      { speaker: "Colleague", line: "Same here. By the way, how did your demo with finance go yesterday?" },
      { speaker: "You", line: "Better than expected — they asked for a follow-up on metrics, so I’ll send a deck Friday." },
      { speaker: "Colleague", line: "Nice work. Save me a seat if you get there early." },
    ],
  },
];
