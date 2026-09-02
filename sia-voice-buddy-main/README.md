# SIA: Your Realtime Voice Assistant

Criar SIA — Assistente de IA por Voz em Tempo Real

Quero criar uma aplicação web chamada SIA (Super IA Assistant), um assistente pessoal de inteligência artificial que conversa comigo por voz em tempo real, com uma experiência moderna, fluida e natural, semelhante ao modo de voz dos melhores assistentes de IA atuais.

OBJETIVO PRINCIPAL

O SIA deve permitir que o usuário simplesmente abra a aplicação, toque no botão de voz e comece a conversar naturalmente com a IA.

A experiência deve ser:

Usuário fala → SIA escuta → processa → responde por voz em streaming → usuário pode interromper → SIA para de falar e escuta novamente.

Não quero uma experiência baseada apenas em gravar áudio, enviar, esperar o processamento e depois reproduzir uma resposta. Quero uma experiência de conversação realtime, com baixa latência.

1. TECNOLOGIA

Utilize uma arquitetura moderna e preparada para produção.

Frontend

React

TypeScript

Vite ou Next.js, conforme a arquitetura recomendada pelo Lovable

Tailwind CSS

Componentes modernos e responsivos

WebRTC para comunicação de áudio realtime

Backend

Criar endpoints seguros para iniciar sessões realtime.

A API Key da OpenAI NUNCA deve ficar exposta no frontend.

O frontend deve solicitar ao backend uma sessão/credencial temporária e utilizar essa sessão para estabelecer a conexão realtime.

IA

Utilizar a OpenAI Realtime API para a conversa por voz.

A implementação deve permitir:

entrada de áudio do microfone

saída de áudio da IA

streaming de resposta

detecção automática de fala

Voice Activity Detection

interrupção da resposta quando o usuário começar a falar

conversação contínua

baixa latência

Não implementar a arquitetura como:

STT → texto → LLM → TTS

como fluxo principal.

Priorizar uma conexão realtime baseada em WebRTC.

2. IDENTIDADE DO SIA

Nome:

SIA

Subtítulo:

Super IA Assistant

Personalidade:

O SIA deve parecer um assistente inteligente, amigável, rápido e extremamente competente.

Ele deve conversar de maneira natural, sem respostas excessivamente robóticas.

Personalidade:

inteligente

amigável

objetivo

proativo

natural

profissional quando necessário

descontraído quando a conversa permitir

O SIA deve responder em português brasileiro por padrão.

Se o usuário falar em outro idioma, pode acompanhar o idioma automaticamente.

3. TELA PRINCIPAL

Criar uma interface extremamente limpa e premium.

A tela principal deve ter:

Header

Logo/nome:

SIA

Texto menor:

Super IA Assistant

No lado direito:

indicador de conexão

botão de configurações

avatar/perfil do usuário

4. ÁREA CENTRAL

O elemento principal da interface deve ser uma representação visual do SIA.

Criar um orb/assistente visual animado no centro da tela.

O orb deve reagir ao estado da conversa.

Estado aguardando

Mostrar o SIA parado, com uma animação suave.

Texto:

"Olá! Sou a SIA. Como posso ajudar?"

Estado ouvindo

Quando o microfone estiver ativo:

orb aumenta suavemente

pequenas ondas/partículas aparecem

animação reage ao volume da voz

mostrar:

"Estou ouvindo..."

Estado processando

Mostrar uma animação sutil indicando processamento.

Texto:

"Pensando..."

Estado falando

O orb deve reagir dinamicamente ao áudio produzido pela IA.

Mostrar:

"SIA está falando..."

O efeito deve parecer uma entidade viva conversando, e não apenas um botão de áudio.

5. BOTÃO DE VOZ

Criar um grande botão circular na parte inferior da tela.

Estado inicial:

🎙️

Texto:

"Falar com SIA"

Ao iniciar:

"Estou ouvindo"

Ao falar:

O botão deve mostrar visualmente que o microfone está captando áudio.

O botão deve possuir animações suaves.

6. CONVERSAÇÃO REALTIME

Implementar uma sessão persistente de conversa.

Quando o usuário começar uma conversa:

solicitar permissão do microfone

criar sessão realtime através do backend

estabelecer conexão WebRTC

conectar o áudio do microfone

receber áudio da IA

reproduzir o áudio imediatamente

detectar quando o usuário começa a falar

interromper a fala da IA automaticamente

permitir que o usuário continue falando

A interação deve parecer uma conversa humana.

7. INTERRUPÇÃO / BARGE-IN

Essa parte é extremamente importante.

Se a SIA estiver falando:

"Para resolver esse problema você pode..."

e o usuário começar a falar:

"Espera, deixa eu perguntar outra coisa."

A SIA deve:

detectar a voz do usuário

interromper imediatamente o áudio atual

cancelar a resposta em andamento quando necessário

começar a escutar o novo pedido

Não obrigar o usuário a esperar a SIA terminar.

8. TRANSCRIÇÃO

Mostrar opcionalmente a transcrição da conversa.

Criar uma área discreta na interface onde aparecem:

Você

"Como posso automatizar meu atendimento?"

SIA

"Você pode utilizar..."

A transcrição não deve dominar a tela.

O foco principal deve continuar sendo a conversa por voz.

9. HISTÓRICO

Criar um painel lateral acessível por botão.

Nome:

Conversas

Cada conversa deve possuir:

título automático

data

horário

possibilidade de abrir novamente

possibilidade de excluir

Exemplo:

Conversas

Hoje

Criando meu assistente

Automação do atendimento

Ontem

Planejamento

Ideias para projeto

10. NOVA CONVERSA

Adicionar botão:

+ Nova conversa

Ao clicar:

encerrar sessão atual

limpar contexto visual

iniciar uma nova conversa

11. CONFIGURAÇÕES

Criar página/modal de configurações.

Opções:

Voz

Permitir selecionar a voz disponível na API.

Idioma

Português (Brasil)

English

Español

Personalidade

Permitir escolher entre:

Natural

Profissional

Amigável

Objetivo

Áudio

volume

microfone

teste de microfone

teste de áudio

Interface

tema claro

tema escuro

seguir sistema

12. DESIGN

O design deve ser premium, futurista e minimalista.

Não quero uma interface genérica de dashboard SaaS.

Evitar:

excesso de cards

excesso de bordas

excesso de textos

aparência de painel administrativo

cores exageradas

elementos desnecessários

Priorizar:

muito espaço negativo

animações suaves

tipografia moderna

transparências sutis

glassmorphism discreto

iluminação suave

gradientes elegantes

orb central como elemento principal

A aplicação deve parecer um produto de IA premium.

13. RESPONSIVIDADE

A aplicação precisa funcionar perfeitamente em:

desktop

notebook

tablet

celular

No celular:

interface ocupar toda a tela

botão de voz fácil de alcançar

orb central adaptável

histórico virar drawer

configurações virarem modal/drawer

14. ESTADOS DA APLICAÇÃO

Implementar claramente os seguintes estados:

IDLE
LISTENING
PROCESSING
SPEAKING
ERROR
CONNECTING
DISCONNECTED


Cada estado deve possuir uma representação visual própria.

15. INDICADOR DE CONEXÃO

Mostrar discretamente:

🟢 SIA online

ou

🟡 Conectando...

ou

🔴 Desconectado

Não utilizar alertas invasivos.

16. TRATAMENTO DE ERROS

Criar mensagens amigáveis para:

microfone bloqueado

navegador sem suporte

falha de conexão

sessão expirada

erro da API

ausência de internet

Exemplo:

"Não consegui acessar seu microfone. Verifique as permissões do navegador e tente novamente."

17. SEGURANÇA

Nunca colocar:

OPENAI_API_KEY

ou qualquer segredo diretamente no frontend.

Utilizar variáveis de ambiente no backend.

Criar:

.env
OPENAI_API_KEY=...


O frontend deve conversar apenas com o endpoint seguro criado pelo backend.

18. ESTRUTURA DO PROJETO

Organizar o código de forma profissional.

Exemplo:

src/
├── components/
│   ├── SIAOrb
│   ├── VoiceButton
│   ├── Conversation
│   ├── ConversationHistory
│   ├── Settings
│   └── ConnectionStatus
│
├── hooks/
│   ├── useRealtimeVoice
│   ├── useMicrophone
│   └── useConversation
│
├── services/
│   └── realtime
│
├── pages/
│   ├── Home
│   └── Settings
│
└── types/


Adaptar essa estrutura se necessário, mantendo boa separação de responsabilidades.

19. COMPONENTE SIA ORB

Criar um componente reutilizável:

<SIAOrb state="idle" />
<SIAOrb state="listening" />
<SIAOrb state="processing" />
<SIAOrb state="speaking" />


O componente deve mudar sua animação conforme o estado.

Durante:

LISTENING

o orb reage ao volume do microfone.

Durante:

SPEAKING

o orb reage ao áudio da SIA.

Utilizar Web Audio API quando necessário para obter amplitude/frequência e criar uma visualização orgânica.

20. EXPERIÊNCIA DE PRIMEIRO ACESSO

Ao abrir pela primeira vez:

Mostrar:

SIA

Super IA Assistant

"Converse comigo por voz em tempo real."

Botão:

Começar conversa

Ao clicar:

solicitar acesso ao microfone e iniciar a primeira sessão.

21. PROMPT DO ASSISTENTE

Criar uma configuração central para a personalidade do SIA.

Exemplo conceitual:

"Você é SIA, um assistente de inteligência artificial avançado. Você conversa naturalmente com o usuário em tempo real. Seja inteligente, útil, objetivo e amigável. Responda em português brasileiro por padrão. Evite respostas excessivamente longas durante conversas por voz. Priorize respostas naturais e fáceis de ouvir. Se o usuário interromper sua fala, pare imediatamente e escute o novo pedido."

Deixar esse prompt facilmente editável posteriormente.

22. PREPARAR PARA FUTURAS FUNÇÕES

A arquitetura deve permitir futuramente adicionar:

busca na internet

calendário

e-mail

WhatsApp

automações

agentes

ferramentas externas

memória de longo prazo

documentos

RAG

visão através de câmera

execução de comandos

integração com APIs

múltiplos agentes

Criar uma arquitetura preparada para tool calling.

23. BANCO DE DADOS

Preparar estrutura para armazenar:

users

id
email
name
created_at


conversations

id
user_id
title
created_at
updated_at


messages

id
conversation_id
role
content
created_at


Não é necessário implementar autenticação complexa inicialmente, mas estruturar o projeto para isso.

24. PERFORMANCE

Priorizar baixa latência.

Evitar:

requisições desnecessárias

renderizações excessivas

processamento de áudio pesado no servidor

esperar respostas completas antes de reproduzir áudio

O objetivo é que a resposta da SIA comece a aparecer/falar o mais rápido possível.

25. RESULTADO ESPERADO

Quero receber um MVP funcional, não apenas uma interface visual.

A aplicação precisa realmente:

acessar o microfone

estabelecer conexão realtime

enviar minha voz

receber a resposta da IA

reproduzir a resposta por voz

permitir interrupções

manter a conversa

mostrar estados de escuta/processamento/fala

possuir histórico

possuir configurações básicas

Se alguma integração externa exigir uma chave/API que não esteja disponível, deixar a implementação pronta e indicar claramente onde configurar a variável de ambiente.

Antes de finalizar, testar o fluxo completo:

Abrir → permitir microfone → falar → SIA responder por voz → interromper SIA → falar novamente → SIA responder novamente.

O resultado final deve parecer um produto real de assistente de voz, e não um protótipo genérico.

Nome oficial do produto:

SIA

Super IA Assistant


Dica importante: no Lovable, eu mandaria esse prompt primeiro para construir o MVP completo. Depois, em uma segunda mensagem, pediria para ele fazer o polish visual e otimização da experiência — isso costuma funcionar melhor do que tentar detalhar absolutamente tudo em um único ciclo.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://sia-voice-buddy.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1058f925-7bb8-4865-9abd-46456d67bcdc).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
