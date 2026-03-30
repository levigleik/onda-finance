# Onda Finance

Aplicação web desenvolvida para o desafio Front-End da Onda Finance, simulando um app bancário simples com foco em organização de código, boa experiência de uso e validação de fluxos críticos.

## Link para acessar

Publicação em produção: pendente de deploy.

## Stack

- React + TypeScript
- Vite
- Tailwind CSS + CVA
- shadcn/ui + Radix
- React Router
- React Query
- Zustand
- React Hook Form + Zod
- Axios
- Vitest + Testing Library

## Funcionalidades implementadas

- Login mock com validação de e-mail e senha
- Persistência de sessão com Zustand `persist`
- Dashboard com saldo atual e últimas transferências
- Listagem completa de transferências com paginação
- Fluxo de transferência em 2 etapas
- Validação de nome, e-mail, CPF, valor, saldo disponível e data futura
- Atualização imediata do saldo em tela após transferir
- Transferências com status `concluida` ou `agendada`
- Persistência local de saldo e transferências
- Testes automatizados do fluxo de transferência

## Rotas principais

- `/login`: autenticação mock
- `/`: dashboard
- `/transactions`: histórico completo de transferências

## Como rodar o projeto

### Pré-requisitos

- Bun 1.3+ instalado

### Instalação

```bash
bun install
```

### Ambiente de desenvolvimento

```bash
bun run dev
```

### Build de produção

```bash
bun run build
```

### Preview local da build

```bash
bun run preview
```

### Rodar testes

```bash
bun run test
```

### Rodar testes em modo watch

```bash
bun run test:watch
```

## Fluxo implementado

### Login

- O login é mockado e não depende de API externa.
- Após autenticar, o usuário é persistido localmente e redirecionado para o dashboard.

### Dashboard

- Exibe o saldo atual.
- Mostra as 3 transferências mais recentes.
- Permite navegar para a listagem completa.

### Transferência

- O fluxo é dividido em duas etapas:
  1. dados do destinatário
  2. valor, data e revisão
- O remetente é preenchido a partir da sessão autenticada.
- O saldo é validado durante o preenchimento e novamente no submit.
- Transferências agendadas também debitam o saldo imediatamente no estado atual da aplicação.

## Testes implementados

A suíte de testes cobre o fluxo principal de transferência com Vitest + Testing Library:

- bloqueio de avanço com destinatário inválido
- transferência imediata com sucesso
- prevenção de envio quando o saldo cai antes do submit
- transferência agendada com débito imediato
- atualização do dashboard após transferência bem-sucedida

## Decisões técnicas adotadas

- Zustand foi usado para sessão, saldo e transferências por ser simples, direto e adequado para estado local persistido.
- React Hook Form + Zod foi escolhido para manter o formulário performático e com regras de validação explícitas.
- O fluxo de transferência foi separado em 2 etapas para reduzir carga cognitiva e melhorar UX.
- React Router foi organizado com guards de acesso para rotas autenticadas e rotas de convidado.
- shadcn/ui + Radix foram usados para construir a interface sobre primitives acessíveis e reutilizáveis.
- React Query e Axios já estão preparados no projeto para a futura integração com backend real, embora o desafio atual use dados mockados/local-first.
- Vitest foi configurado com Testing Library para validar comportamento real da interface, não apenas funções isoladas.

## Segurança

Esta etapa não precisava ser implementada no código, mas abaixo está a estratégia recomendada para proteger a aplicação em um cenário real.

### Como proteger contra engenharia reversa

- Nunca embutir segredos, tokens privados, regras críticas de negócio ou credenciais no front-end.
- Mover autorização, cálculo sensível e validações críticas para o backend.
- Entregar builds minificadas e publicar sourcemaps apenas em ambientes privados de observabilidade.
- Usar autenticação baseada em sessão segura ou tokens curtos com renovação controlada no servidor.
- Aplicar rate limiting, auditoria e monitoramento para detectar abuso automatizado.

### Como proteger contra vazamento de dados

- Evitar armazenar dados sensíveis em `localStorage`; preferir cookies `HttpOnly`, `Secure` e `SameSite` quando houver backend real.
- Trafegar dados apenas por HTTPS.
- Minimizar o volume de dados expostos ao cliente com princípios de menor privilégio.
- Mascarar dados pessoais em logs e ferramentas de observabilidade.
- Implementar políticas de expiração de sessão, revogação de tokens e logout global.
- Aplicar CSP, proteção contra XSS e validação/sanitização de payloads no backend.

## Melhorias futuras

- Publicar a aplicação e adicionar o link de produção no README
- Integrar login, saldo e transferências com API real usando Axios + React Query
- Adicionar testes para login, guards de rota e paginação
- Cobrir estados de erro, loading remoto e retries com dados vindos do servidor
- Substituir persistência local por modelo seguro de autenticação com backend
- Melhorar observabilidade e métricas de uso

## Observações

- O projeto usa `bun.lock`, então Bun é o gerenciador recomendado.
- O build atual funciona normalmente, mas o Vite exibe um aviso de chunk grande em produção, o que pode ser endereçado com code splitting em uma próxima iteração.
