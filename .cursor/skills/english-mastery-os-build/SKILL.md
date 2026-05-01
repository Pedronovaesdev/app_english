---
name: english-mastery-os-build
description: Builds English Mastery OS as a local-first FastAPI + SQLite + React (Vite) + Tailwind app with three agent modules (data/SM-2 & weekly cycle, gamification UX, speech/content). Use when implementing or extending English Mastery OS, Speed Up method, SM-2 flashcards, streak, Saturday missions, YouTube shadowing loops, article-to-flashcard import, or weekly study structure.
disable-model-invocation: true
---

# English Mastery OS — build skill

## Instruções do projeto (seguir na ordem abaixo)

Atue como um Engenheiro de Software Senior e Arquiteto de Sistemas. Vamos construir o 'English Mastery OS', uma aplicação local-first para meu aprendizado acelerado de inglês em 6 meses, baseada na filosofia de que 'não é sobre quanto tempo estuda, mas como'.

A aplicação deve ser dividida em 3 módulos principais (Agentes). Use Python (FastAPI) para o backend, SQLite para o banco e React (Vite) + Tailwind para o frontend. Siga estas instruções para cada módulo:

1. Módulo Arquiteto de Dados (Backend & SRN):

Configure o SQLite com uma tabela de flashcards que suporte o algoritmo SM-2 (Anki).

Crie rotas para gerenciar o Streak (fogo) e o log de atividades diárias, garantindo a persistência local.

Implemente a lógica do 'Ciclo Semanal': 15 min de Domingo a Quinta e a 'Aula de Ouro' de 60 min no Sábado.

2. Módulo Mestre de Gamificação (Frontend & UX):

Desenvolva uma dashboard que bloqueie distrações e foque no cronômetro de 15 minutos diários.

Crie componentes de 'Time-box Challenges' para respostas rápidas e uma barra de progresso de XP.

Implemente a interface de 'Missões' de Sábado, dividida em: Warm-up (10min), Active Practice (20min), Games (20min) e Mission (10min).

3. Módulo Tutor de Conversação (Speech & Content):

Crie um player integrado para YouTube que permita fazer 'loops' de 5 segundos para técnica de Shadowing.

Implemente um módulo de 'Active Practice' que exiba diálogos reais e utilize a API de áudio do navegador para gravar minha voz, salvando o arquivo localmente para o check-point semanal.

Adicione um importador de artigos (focado em Machine Learning e Petróleo) que extraia frases desconhecidas e as envie automaticamente para o banco de flashcards.

Diretriz de Execução: Ignore explicações longas. Foque em código limpo, tipado e pronto para rodar localmente. Referencie o arquivo @Roteiro de Estudos - Speed Up Atualizado-1_260501_180931.pdf  para garantir que os tempos de revisão e a estrutura das aulas estejam 100% alinhados com o método.

## Alinhamento com o roteiro PDF

Ficheiro no repositório: `Roteiro de Estudos - Speed Up Atualizado-1_260501_180931.pdf`. Cumprir a diretriz de execução acima: cruzar tempos de revisão e estrutura das aulas com este PDF; em caso de divergência com outra documentação do projeto, prevalece o PDF.
