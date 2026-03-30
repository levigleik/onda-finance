# Onda Finance

Aplicação web desenvolvida para o desafio Front-End da Onda Finance, simulando um app bancário com login mockado, dashboard, histórico de transferências, fluxo de transferência em 2 etapas e internacionalização.

## Stack

O projeto utiliza a stack obrigatória do desafio.

Bibliotecas e decisões complementares relevantes:

- `i18next` + `react-i18next` para i18n
- `react-router` em modo DATA para sincronizar idioma com a URL
- `Testing Library` para testes de comportamento da interface

## Como rodar o projeto

### Pré-requisitos

- Bun 1.3+ instalado

### Instalação

```bash
bun install
```

### Desenvolvimento

```bash
bun run dev
```

### Build

```bash
bun run build
```

### Preview da build

```bash
bun run preview
```

### Testes

```bash
bun run test
```

### Testes em modo watch

```bash
bun run test:watch
```

## Decisões técnicas adotadas

- O estado de autenticação, saldo e transferências foi mantido em Zustand com persistência local para simplificar o fluxo mockado do desafio.
- O formulário de transferência foi dividido em 2 etapas para reduzir carga cognitiva e facilitar as validações progressivas.
- As validações foram centralizadas com React Hook Form + Zod para manter regras explícitas e feedback consistente na UI.
- O i18n foi implementado com `i18next` + `react-i18next`, com `pt-BR` e `en-US`, usando lazy loading dos arquivos de tradução.
- O idioma passou a ser controlado pela rota pública `/:lang/...`, mantendo o router como fonte de verdade e sincronizando `i18n.changeLanguage(...)`.
- As formatações de moeda e data passaram a respeitar o idioma ativo da aplicação.
- Os status de transferência foram convertidos para códigos internos neutros, deixando a tradução apenas na camada de interface.
- Foi adicionado um seletor de idioma no navbar, preservando a rota atual ao trocar o locale.
- A cobertura de testes foi atualizada para incluir fluxo principal, redirecionamentos de idioma e compatibilidade com dados persistidos antigos.

## Melhorias futuras

- Integrar login, saldo e transferências com API real usando Axios + React Query.
- Adicionar cobertura para login, guards de rota e paginação com mais cenários de erro.
- Melhorar o code splitting do bundle principal além do lazy loading das traduções.
- Expandir os idiomas suportados e separar traduções em namespaces por domínio.
- Substituir persistência local por um modelo de autenticação seguro com backend.
