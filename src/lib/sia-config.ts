/**
 * Configuração central da personalidade e da sessão realtime da SIA.
 * Edite este arquivo para mudar o comportamento do assistente.
 */

export const SIA_MODEL = "gpt-realtime";

export type Personality = "natural" | "profissional" | "amigavel" | "objetivo";
export type LanguageCode = "pt-BR" | "en-US" | "es-ES";

export const VOICES = [
  { id: "alloy", label: "Alloy" },
  { id: "ash", label: "Ash" },
  { id: "ballad", label: "Ballad" },
  { id: "coral", label: "Coral" },
  { id: "echo", label: "Echo" },
  { id: "sage", label: "Sage" },
  { id: "shimmer", label: "Shimmer" },
  { id: "verse", label: "Verse" },
] as const;

export const LANGUAGES: { id: LanguageCode; label: string }[] = [
  { id: "pt-BR", label: "Português (Brasil)" },
  { id: "en-US", label: "English" },
  { id: "es-ES", label: "Español" },
];

export const PERSONALITIES: { id: Personality; label: string; hint: string }[] = [
  { id: "natural", label: "Natural", hint: "Conversa fluida e humana" },
  { id: "profissional", label: "Profissional", hint: "Tom formal e preciso" },
  { id: "amigavel", label: "Amigável", hint: "Leve e descontraída" },
  { id: "objetivo", label: "Objetivo", hint: "Respostas curtas e diretas" },
];

const PERSONALITY_PROMPT: Record<Personality, string> = {
  natural: "Fale de forma natural e humana, com ritmo de conversa real.",
  profissional: "Mantenha um tom profissional, preciso e confiável.",
  amigavel: "Seja calorosa, descontraída e próxima, com bom humor leve.",
  objetivo: "Seja extremamente objetiva: respostas curtas e diretas ao ponto.",
};

const LANGUAGE_PROMPT: Record<LanguageCode, string> = {
  "pt-BR": "Responda em português brasileiro por padrão.",
  "en-US": "Answer in English by default.",
  "es-ES": "Responde en español por defecto.",
};

export function buildInstructions(opts: {
  personality: Personality;
  language: LanguageCode;
}): string {
  return [
    "Você é a SIA (Super IA Assistant), uma assistente de inteligência artificial avançada que conversa por voz em tempo real.",
    "Seja inteligente, útil, objetiva e amigável.",
    LANGUAGE_PROMPT[opts.language],
    "Se o usuário falar em outro idioma, acompanhe o idioma dele automaticamente.",
    "Evite respostas excessivamente longas durante conversas por voz. Priorize respostas naturais e fáceis de ouvir.",
    "Se o usuário interromper sua fala, pare imediatamente e escute o novo pedido.",
    PERSONALITY_PROMPT[opts.personality],
    "Nunca leia marcações, listas numeradas longas ou código em voz alta sem necessidade.",
  ].join(" ");
}

/**
 * Ferramentas (tool calling) — pronto para expansão futura:
 * busca na web, calendário, e-mail, automações, RAG, etc.
 */
export const SIA_TOOLS: unknown[] = [];
