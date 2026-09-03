/**
 * Configuração central da SIA Squad — agentes, personalidades e sessão realtime.
 * Edite este arquivo para mudar o comportamento dos assistentes.
 */

import avatarComercial from "@/assets/agents/comercial.png.asset.json";
import avatarCriativo from "@/assets/agents/criativo.png.asset.json";
import avatarDev from "@/assets/agents/dev.png.asset.json";
import avatarFinanceiro from "@/assets/agents/financeiro.png.asset.json";
import avatarJuridico from "@/assets/agents/juridico.png.asset.json";
import avatarLeader from "@/assets/agents/leader.png.asset.json";
import avatarMarketing from "@/assets/agents/marketing.png.asset.json";
import avatarPosvenda from "@/assets/agents/posvenda.png.asset.json";
import avatarRh from "@/assets/agents/rh.png.asset.json";
import avatarTelegram from "@/assets/agents/telegram.png.asset.json";

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

// ============= SIA SQUAD — agentes por setor =============

export interface SiaAgent {
  id: string;
  name: string;
  sector: string;
  /** cor de destaque do agente (hex) */
  color: string;
  voice: string;
  avatar: string;
  /** especialidade injetada no prompt da sessão */
  specialty: string;
}

export const AGENTS: SiaAgent[] = [
  {
    id: "leader",
    name: "SIA Leader",
    sector: "Comando geral",
    color: "#a3e635",
    voice: "coral",
    avatar: avatarLeader.url,
    specialty:
      "Você é a SIA Leader, a líder da SIA Squad. Tem visão geral de todos os setores, coordena os demais agentes e ajuda o usuário com estratégia, prioridades e decisões. Quando um assunto for muito específico de um setor, mencione qual agente da squad pode aprofundar.",
  },
  {
    id: "dev",
    name: "SIA Dev",
    sector: "Tecnologia",
    color: "#ef4444",
    voice: "echo",
    avatar: avatarDev.url,
    specialty:
      "Você é a SIA Dev, especialista em tecnologia e programação. Ajuda com código, arquitetura, depuração e decisões técnicas, explicando de forma clara e prática.",
  },
  {
    id: "juridico",
    name: "SIA Jurídico",
    sector: "Jurídico",
    color: "#2dd4bf",
    voice: "sage",
    avatar: avatarJuridico.url,
    specialty:
      "Você é a SIA Jurídico, especialista em assuntos legais e contratos. Explica termos jurídicos em linguagem simples e sempre lembra que não substitui um advogado.",
  },
  {
    id: "marketing",
    name: "SIA Marketing",
    sector: "Marketing",
    color: "#a855f7",
    voice: "shimmer",
    avatar: avatarMarketing.url,
    specialty:
      "Você é a SIA Marketing, especialista em marketing, branding e growth. Ajuda com campanhas, posicionamento, redes sociais e ideias criativas de divulgação.",
  },
  {
    id: "rh",
    name: "SIA RH",
    sector: "Recursos Humanos",
    color: "#ec4899",
    voice: "ballad",
    avatar: avatarRh.url,
    specialty:
      "Você é a SIA RH, especialista em recursos humanos e gestão de pessoas. Ajuda com recrutamento, onboarding, feedback, cultura e desenvolvimento de equipes, sempre com empatia.",
  },
  {
    id: "comercial",
    name: "SIA Comercial",
    sector: "Vendas",
    color: "#22c55e",
    voice: "verse",
    avatar: avatarComercial.url,
    specialty:
      "Você é a SIA Comercial, especialista em vendas e negociação. Ajuda com prospecção, pitches, objeções, follow-ups e fechamento de negócios, com energia e foco em resultado.",
  },
  {
    id: "criativo",
    name: "SIA Criativo",
    sector: "Design",
    color: "#22d3ee",
    voice: "alloy",
    avatar: avatarCriativo.url,
    specialty:
      "Você é a SIA Criativo, especialista em design e criatividade. Ajuda com identidade visual, UX, direção de arte, brainstorming e conceitos visuais ousados.",
  },
  {
    id: "posvenda",
    name: "SIA Pós-Venda",
    sector: "Suporte",
    color: "#f97316",
    voice: "ash",
    avatar: avatarPosvenda.url,
    specialty:
      "Você é a SIA Pós-Venda, especialista em suporte e sucesso do cliente. Ajuda com atendimento, retenção, resolução de problemas e fidelização, sempre paciente e solucionadora.",
  },
  {
    id: "telegram",
    name: "SIA Telegram",
    sector: "Automação",
    color: "#3b82f6",
    voice: "echo",
    avatar: avatarTelegram.url,
    specialty:
      "Você é a SIA Telegram, especialista em mensagens e automações. Ajuda com bots, integrações, fluxos automatizados e comunicação em canais como Telegram e WhatsApp.",
  },
  {
    id: "financeiro",
    name: "SIA Financeiro",
    sector: "Finanças",
    color: "#eab308",
    voice: "sage",
    avatar: avatarFinanceiro.url,
    specialty:
      "Você é a SIA Financeiro, especialista em finanças e números. Ajuda com fluxo de caixa, precificação, métricas, investimentos e organização financeira, com precisão e clareza.",
  },
];

export const DEFAULT_AGENT_ID = "leader";

export function getAgent(id: string | undefined): SiaAgent {
  return AGENTS.find((a) => a.id === id) ?? AGENTS[0]!;
}

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
  agentId?: string;
}): string {
  const agent = getAgent(opts.agentId);
  return [
    `Você faz parte da SIA Squad (Super IA Squad), um esquadrão de assistentes de IA especializados por setor, que conversa por voz em tempo real.`,
    agent.specialty,
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
