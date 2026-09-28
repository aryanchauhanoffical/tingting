export type Turn = { who: "agent" | "caller"; text: string };

export type FlagCode = "gb" | "in" | "es" | "fr" | "jp" | "de";

export type HeroLang = {
  code: string;
  /** country code for the flag drawn before the greeting */
  flag: FlagCode;
  /** native language name, shown in the headline */
  name: string;
  /** greeting, shown on the sticker */
  hello: string;
  dir?: "rtl";
  script: Turn[];
};

/** Same four-turn call in each language. The hero card replays whichever one is picked. */
export const HERO_LANGS: HeroLang[] = [
  {
    code: "en",
    flag: "gb",
    name: "English",
    hello: "Hello",
    script: [
      { who: "agent", text: "Thanks for calling Northwind. How can I help?" },
      { who: "caller", text: "Hi, I need to reschedule my delivery." },
      { who: "agent", text: "Of course. Order ending 4471. Does Thursday morning work?" },
      { who: "caller", text: "Thursday is perfect, thank you." },
    ],
  },
  {
    code: "hi",
    flag: "in",
    name: "हिन्दी",
    hello: "नमस्ते",
    script: [
      { who: "agent", text: "नॉर्थविंड में कॉल करने के लिए धन्यवाद। मैं आपकी क्या मदद करूँ?" },
      { who: "caller", text: "जी, मुझे अपनी डिलीवरी का समय बदलना है।" },
      { who: "agent", text: "ज़रूर। ऑर्डर 4471 मिल गया। गुरुवार सुबह ठीक रहेगा?" },
      { who: "caller", text: "गुरुवार बिल्कुल ठीक है, धन्यवाद।" },
    ],
  },
  {
    code: "es",
    flag: "es",
    name: "Español",
    hello: "¡Hola!",
    script: [
      { who: "agent", text: "Gracias por llamar a Northwind. ¿En qué puedo ayudarle?" },
      { who: "caller", text: "Hola, necesito cambiar la fecha de mi entrega." },
      { who: "agent", text: "Claro. Pedido terminado en 4471. ¿Le va bien el jueves por la mañana?" },
      { who: "caller", text: "El jueves es perfecto, gracias." },
    ],
  },
  {
    code: "fr",
    flag: "fr",
    name: "Français",
    hello: "Bonjour",
    script: [
      { who: "agent", text: "Merci d'avoir appelé Northwind. Comment puis-je vous aider ?" },
      { who: "caller", text: "Bonjour, je dois reporter ma livraison." },
      { who: "agent", text: "Bien sûr. Commande finissant par 4471. Jeudi matin vous convient ?" },
      { who: "caller", text: "Jeudi, c'est parfait, merci." },
    ],
  },
  {
    code: "ja",
    flag: "jp",
    name: "日本語",
    hello: "こんにちは",
    script: [
      { who: "agent", text: "ノースウィンドにお電話ありがとうございます。ご用件をどうぞ。" },
      { who: "caller", text: "配達の日時を変更したいのですが。" },
      { who: "agent", text: "かしこまりました。末尾4471のご注文ですね。木曜の午前はいかがですか。" },
      { who: "caller", text: "木曜で大丈夫です。ありがとうございます。" },
    ],
  },
  {
    code: "de",
    flag: "de",
    name: "Deutsch",
    hello: "Hallo",
    script: [
      { who: "agent", text: "Danke für Ihren Anruf bei Northwind. Wie kann ich helfen?" },
      { who: "caller", text: "Hallo, ich muss meine Lieferung verschieben." },
      { who: "agent", text: "Natürlich. Bestellung mit Endung 4471. Passt Donnerstagvormittag?" },
      { who: "caller", text: "Donnerstag ist perfekt, danke." },
    ],
  },
];
