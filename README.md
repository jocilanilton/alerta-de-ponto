# Alerta de Ponto — versão inicial

Protótipo de interface PWA para gestão de lembretes de ponto. Esta versão é uma demonstração frontend: dados ficam em memória e não existe autenticação, sincronização entre dispositivos ou envio real de Web Push.

## Requisitos
- Node.js 20+
- npm

## Executar localmente
```bash
npm install
npm run dev
```
Abra a URL apresentada pelo Vite. Para testar instalação PWA em produção, publique em HTTPS.

## Build
```bash
npm run build
npm run preview
```

## O que está incluído
- Dashboard administrativo
- Cadastro, busca, ativação/desativação e exportação CSV de funcionários
- Edição visual da escala padrão: entrada, saída para almoço, retorno e saída
- Seleção de trabalho no sábado/domingo
- Cadastro de férias, folgas, feriados e afastamentos
- Solicitação de permissão de notificações e orientação de instalação
- Manifest PWA e service worker com cache básico
- Layout responsivo para celular e desktop

## Antes de usar com dados reais
1. Criar projeto Supabase e tabelas para perfis, funcionários, escalas, exceções e assinaturas Push.
2. Configurar autenticação e autorização por função (admin/funcionário) com políticas RLS.
3. Criar endpoint de inscrição Web Push e armazenar assinaturas por usuário/dispositivo.
4. Configurar VAPID e um worker/agendador no servidor para calcular os alertas e enviar notificações.
5. Definir fuso horário da empresa (sugestão inicial: `America/Sao_Paulo`) e regras de precedência de férias/folgas/feriados sobre escalas.
6. Criar política de privacidade, retenção de dados e processo de remoção de contas.

## Arquitetura recomendada para produção
- Frontend: React + TypeScript + Vite PWA
- Autenticação e banco: Supabase Auth + PostgreSQL + RLS
- Envio: Web Push (VAPID) via função backend segura
- Agendamento: worker/cron no backend consultando os próximos eventos, com chave idempotente para evitar notificações duplicadas

## Observação
Este app somente lembra os funcionários. Não registra nem comprova marcações oficiais de ponto.
