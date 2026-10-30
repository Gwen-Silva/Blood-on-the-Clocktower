# W05: localização PT-BR e atualização segura

Baseline local/remoto verificado antes das alterações: `f25b772fd197122e7249c8f61039b52080da4bb1`. Branch: `release/weekend-2026-10-31`. A localização desta release substitui a parte de idiomas prevista na Task 017, sem declarar a tarefa histórica recuperada. Tasks 008–020 não foram reconstruídas.

## Investigação antes das alterações

O HTML público do W04 servia `assets/index-BMN8PAGN.js`, conferido na investigação. A execução real em Chromium 149.0.7827.55 passou novamente em 360×800, 390×844 e 412×915: resultado do Investigador com nomes primeiro, detalhes imediatos do Espião, várias consultas, Voltar/Back e nenhuma janela posterior à devolução. A interface W04 também já dizia “is about to die”. Não foi reproduzida uma regressão desses fluxos no W04 público; eles foram preservados, sem implementação duplicada.

A PWA W04 registrava sw.js no load, com skipWaiting false e clientsClaim false. Uma instalação nova não interrompe as janelas controladas pelo worker anterior. Não havia identificação de build nem interface para verificar/ativar uma atualização pendente. Isso explica como uma instalação pode continuar mostrando código antigo com janelas abertas. **A versão exata no aparelho do usuário continua desconhecida**, pois não houve acesso ao Android físico. Cache antigo é uma hipótese compatível, não uma constatação sobre esse aparelho.

Para uma regressão específica e verificável, o artefato imutável do Pages do W03 foi recuperado do run 41016127653, cujo SHA é `dab3050c1fc4a45c872175f269eddb33ed1ae0f2`. O teste versionado `e2e/spy-handback.spec.ts` falha nesse artefato nas três larguras, exatamente na expectativa de detalhe imediato após o toque, antes de Continue. O mesmo teste passa no W04 público e na implementação W05. Os rótulos antigos do wizard são aceitos apenas no teste para isolar esse defeito.

## Cobertura completa

**832 entradas de texto por idioma**: as 819 do inventário W04 e 13 novas entradas de versão/atualização. Além disso, 75 identificadores de tipo de linha são metadados internos preservados. Total: 907 folhas em cada idioma. Existem 41 grupos de tradução, com arquivos físicos EN, ES e PT-BR: central, 23 personagens e 17 efeitos. Os três módulos compartilhados nightGuidance, clarity e about também foram considerados por meio dos objetos centrais.

O [inventário trilíngue completo](LOCALIZATION_INVENTORY_W05.json) registra fonte, chave e valor de todas as entradas, inclusive traduções legadas não utilizadas. O teste não aceita fallback como prova: importa os módulos físicos de cada idioma e compara conjuntos de chaves, placeholders, conteúdo não vazio e ausência de travessões. Nomes próprios Grimorium/Trouble Brewing, a palavra Manual e templates só de nomes/pontuação são exceções intencionais à comparação de textos idênticos.

Áreas verificadas: menu e saves; jogadores/assentos; roteiro, personagens e atribuição; revisão; revelação; devolução e recuperação de privacidade; referência pública; cartões; Grimório e efeitos; preparação e informação do Mal/blefes; painel e todas as ações noturnas; resultados privados; dia, nomeações, votação e execução; morte/vitória; histórico e horários; ajuda; diálogos, erros, avisos, estados vazios, controles desabilitados e rótulos acessíveis. A varredura de JSX encontrou apenas o separador neutro de ponto médio. Metadados padrão do HTML e a descrição da PWA também estão em português.

## Preferência e compatibilidade

- Sem preferência válida, o padrão é `pt-BR`, independentemente do idioma do navegador. Valores inválidos não são interpretados como EN/ES.
- EN, ES e PT-BR explícitos usam a mesma chave `grimoire_language`. Não foi criada outra preferência, idioma de partida ou migração.
- O provider não recebe uma nova key por idioma: trocar a língua atualiza os textos sem remontar a preparação ou o GameScreen. A devolução contínua de 1.000 ms também foi testada durante uma troca de idioma.
- document.lang acompanha a preferência. Datas e horários usam pt-BR, en-US ou es-ES; timestamps, nomes anteriores de partidas e dados escritos pelo usuário não são traduzidos nem regravados.
- IDs de personagem/roteiro, chaves de eventos, identidades e formato dos saves permanecem estáveis. Nenhuma regra, contagem de votos, registro ou efeito foi alterado.

## Glossário do projeto

| Inglês                 | PT-BR adotado                                |
| ---------------------- | -------------------------------------------- |
| Storyteller / Narrator | Narrador                                     |
| Grimoire               | Grimório                                     |
| Townsfolk              | Cidadão                                      |
| Outsider               | Forasteiro                                   |
| Minion                 | Lacaio                                       |
| Demon                  | Demônio                                      |
| Nomination             | Nomeação                                     |
| Voting / Not voting    | Votando / Não votando                        |
| About to die           | Prestes a morrer                             |
| Execution / died       | Execução / morreu, como resultados distintos |
| Ghost vote             | Voto de fantasma                             |
| Drunk / poisoned       | Bêbado / envenenado                          |
| Register as            | Registrar-se como                            |
| Red Herring            | Pista Falsa                                  |

Narrador, Grimório e Diabrete seguem a solicitação explícita. A pesquisa incluiu o [portal de tradução do app oficial](https://translation.botc.app/projects/botc-app/script-tool/pt_BR/), o [anúncio de idiomas do app oficial](https://www.patreon.com/botconline/posts/app-version-3-46-140823563) e [materiais comunitários brasileiros](https://ludopedia.com.br/jogo/blood-on-the-clocktower/anexos/206873). Há variantes em materiais comunitários; esta release usa um glossário coerente do projeto, sem afirmar que todos os nomes escolhidos são uma nomenclatura oficial única. Nunca usa Capeta como nome do Imp. Trouble Brewing é mantido como nome próprio do roteiro; Aldeão é o personagem personalizado Villager, separado do tipo Cidadão.

### Todos os 23 personagens

| Original       | Nome PT-BR estável  | Módulo                                                                  |
| -------------- | ------------------- | ----------------------------------------------------------------------- |
| Imp            | Diabrete            | `src/lib/roles/definition/imp/i18n/pt-BR.ts`                            |
| Baron          | Barão               | `src/lib/roles/definition/trouble-brewing/baron/i18n/pt-BR.ts`          |
| Butler         | Mordomo             | `src/lib/roles/definition/trouble-brewing/butler/i18n/pt-BR.ts`         |
| Chef           | Cozinheiro          | `src/lib/roles/definition/trouble-brewing/chef/i18n/pt-BR.ts`           |
| Drunk          | Bêbado              | `src/lib/roles/definition/trouble-brewing/drunk/i18n/pt-BR.ts`          |
| Empath         | Empata              | `src/lib/roles/definition/trouble-brewing/empath/i18n/pt-BR.ts`         |
| Fortune Teller | Adivinho            | `src/lib/roles/definition/trouble-brewing/fortune-teller/i18n/pt-BR.ts` |
| Investigator   | Investigador        | `src/lib/roles/definition/trouble-brewing/investigator/i18n/pt-BR.ts`   |
| Librarian      | Bibliotecário       | `src/lib/roles/definition/trouble-brewing/librarian/i18n/pt-BR.ts`      |
| Mayor          | Prefeito            | `src/lib/roles/definition/trouble-brewing/mayor/i18n/pt-BR.ts`          |
| Monk           | Monge               | `src/lib/roles/definition/trouble-brewing/monk/i18n/pt-BR.ts`           |
| Poisoner       | Envenenador         | `src/lib/roles/definition/trouble-brewing/poisoner/i18n/pt-BR.ts`       |
| Ravenkeeper    | Guardião dos Corvos | `src/lib/roles/definition/trouble-brewing/ravenkeeper/i18n/pt-BR.ts`    |
| Recluse        | Recluso             | `src/lib/roles/definition/trouble-brewing/recluse/i18n/pt-BR.ts`        |
| Saint          | Santo               | `src/lib/roles/definition/trouble-brewing/saint/i18n/pt-BR.ts`          |
| Scarlet Woman  | Mulher Escarlate    | `src/lib/roles/definition/trouble-brewing/scarlet-woman/i18n/pt-BR.ts`  |
| Slayer         | Caçador             | `src/lib/roles/definition/trouble-brewing/slayer/i18n/pt-BR.ts`         |
| Soldier        | Soldado             | `src/lib/roles/definition/trouble-brewing/soldier/i18n/pt-BR.ts`        |
| Spy            | Espião              | `src/lib/roles/definition/trouble-brewing/spy/i18n/pt-BR.ts`            |
| Undertaker     | Coveiro             | `src/lib/roles/definition/trouble-brewing/undertaker/i18n/pt-BR.ts`     |
| Virgin         | Virgem              | `src/lib/roles/definition/trouble-brewing/virgin/i18n/pt-BR.ts`         |
| Washerwoman    | Lavadeira           | `src/lib/roles/definition/trouble-brewing/washerwoman/i18n/pt-BR.ts`    |
| Villager       | Aldeão              | `src/lib/roles/definition/villager/i18n/pt-BR.ts`                       |

### Todos os 17 efeitos

| Original                 | Nome PT-BR                    | Módulo                                                          |
| ------------------------ | ----------------------------- | --------------------------------------------------------------- |
| Master                   | Mestre                        | `src/lib/effects/definition/butler-master/i18n/pt-BR.ts`        |
| Dead                     | Morto                         | `src/lib/effects/definition/dead/i18n/pt-BR.ts`                 |
| Deflect                  | Desvio                        | `src/lib/effects/definition/deflect/i18n/pt-BR.ts`              |
| Demon Successor          | Sucessor do Demônio           | `src/lib/effects/definition/demon-successor/i18n/pt-BR.ts`      |
| Drunk                    | Bêbado                        | `src/lib/effects/definition/drunk/i18n/pt-BR.ts`                |
| Starpass Pending         | Transferência pendente        | `src/lib/effects/definition/imp-starpass-pending/i18n/pt-BR.ts` |
| Correct Information Ping | Informação: alvo correto      | `src/lib/effects/definition/info-ping/i18n/correct-pt-BR.ts`    |
| Wrong Information Ping   | Informação: alvo de distração | `src/lib/effects/definition/info-ping/i18n/wrong-pt-BR.ts`      |
| Martyrdom                | Martírio                      | `src/lib/effects/definition/martyrdom/i18n/pt-BR.ts`            |
| Misregister              | Registro alternativo          | `src/lib/effects/definition/misregister/i18n/pt-BR.ts`          |
| Role Changed             | Personagem alterado           | `src/lib/effects/definition/pending-role-reveal/i18n/pt-BR.ts`  |
| Poisoned                 | Envenenado                    | `src/lib/effects/definition/poisoned/i18n/pt-BR.ts`             |
| Pure                     | Pureza                        | `src/lib/effects/definition/pure/i18n/pt-BR.ts`                 |
| Red Herring              | Pista Falsa                   | `src/lib/effects/definition/red-herring/i18n/pt-BR.ts`          |
| Safe                     | Protegido                     | `src/lib/effects/definition/safe/i18n/pt-BR.ts`                 |
| Slayer Shot              | Disparo do Caçador            | `src/lib/effects/definition/slayer-bullet/i18n/pt-BR.ts`        |
| Used Dead Vote           | Voto de fantasma usado        | `src/lib/effects/definition/used-dead-vote/i18n/pt-BR.ts`       |

## Ajustes de apresentação

Quantidades unitárias aparecem apenas com o nome. Quantidades maiores que um continuam com multiplicador em modo personalizado; validação de unicidade/composição e sorteio não mudaram. A revisão da preparação e a lista de atribuição compartilham formatRoleQuantity.

EndDayConfirmation apresenta primeiro a confirmação primária e depois Cancelar, nos três idiomas. As proteções existentes contra estado obsoleto, submissão duplicada e falha de save permanecem testadas.

As exceções da primeira noite são explícitas. A inspeção dos cartões realmente renderizados, incluindo Diabrete, não encontrou asterisco isolado. Washerwoman/Librarian/Investigator continuam com nomes primeiro, personagem depois e referência opcional. Os resultados zero e os registros alternativos existentes foram mantidos. A redação distingue nomeação, liderança provisória, execução e morte, incluindo o histórico de execução sem morte.

Foram substituídos contextualmente os 20 literais traduzidos EN/ES que continham travessão. A transformação atingiu apenas valores de tradução, não comentários, documentação ou código. PT-BR e as novas mensagens não usam travessão. Nomes com travessão e texto histórico do usuário são preservados, comprovado em testes de histórico e de preparação no navegador.

O CSS existente já usa 100dvh, fallback 100vh, safe-area-inset e regiões separadas para ferramentas e conteúdo. Foi mantido. A conferência móvel não encontrou overflow horizontal nem controles primários encobertos nas larguras pedidas. Barras físicas de navegação/URL do Android continuam dependendo de confirmação no aparelho.

## Versão e atualização da PWA

Sobre e atualizações fica no menu/preparação, fora de todas as telas de partida e de jogador. Mostra os sete primeiros caracteres do SHA e mantém o SHA completo em data-build-sha para conferência. Vite lê git rev-parse HEAD; em Actions, GITHUB_SHA precisa coincidir com o checkout. O identificador não é uma constante manual de release.

O registro próprio mantém a URL/scope da PWA, usa updateViaCache none e descobre workers aguardando. Verificar atualização não troca o conteúdo ativo. Ativação explícita só pode ser solicitada pelo menu sem preparação em andamento, sem latch de privacidade e sem outra janela do Grimorium. O worker confirma que o solicitante é o único cliente do app antes de skipWaiting. Apenas a janela que pediu a ativação pode recarregar, e ela confere novamente a condição de menu/privacidade. Não há recarga silenciosa de partidas nem chamada de localStorage.clear/unregister.

O teste com perfil persistente serviu o W04 real, manteve um resultado privado aberto durante a instalação W05, fechou os clientes do app, reabriu o perfil e verificou a devolução protegida, o save idêntico e a preferência EN. Uma atualização seguinte simulada foi recusada com outra janela e aceita no menu com uma única janela. É validação em Chromium, não em Android físico.

Referências técnicas: [ciclo de vida dos service workers](https://web.dev/articles/service-worker-lifecycle), [skipWaiting](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting) e [opções de registro/cache](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register). Não se usa ativação automática irrestrita para contornar o cache.

## Verificação e reprodução

- npm ci, npm run tc, npm test, npm run build com base do Pages, Prettier e git diff --check.
- Suíte unitária/integração: **709 testes em 69 arquivos**, incluindo os 683 anteriores e 26 novos para padrão/persistência, troca de idioma sem reset, cobertura física de módulos, placeholders, nomes/descrições, datas, histórico, quantidades, ordem do diálogo, hold contínuo e bloqueios da atualização.
- Chromium 149.0.7827.55: fluxo de cinco jogadores de Noite 1 a Dia 1, votação, execução, save/reload e Noite 2 nas nove combinações de 3 idiomas × 3 tamanhos (360×800, 390×844, 412×915).
- Cartões: todos os 23 personagens renderizados nas mesmas nove combinações, incluindo nomes longos, ausência de travessão e de asterisco isolado.
- Lavadeira, Bibliotecário e Investigador com candidatos, seguidos do Espião: PT-BR nas três larguras; EN/ES em 390×844. O Espião foi consultado com toques, antes de Continuar; duas consultas, Back, ausência de edição/save prematuro e nenhum modal posterior. Bibliotecário zero coberto no fluxo principal.
- Preferências EN/ES/PT-BR conferidas com fechamento/reabertura de perfis persistentes; mudar idioma na preparação preserva o nome e os cinco campos. Nomes com travessão permanecem intactos.
- PWA: upgrade W04→W05, instalação sem interromper tela privada, recuperação protegida e ativação explícita segura com perfil persistente.
- Android físico: **NOT RUN**. Nenhuma alegação de comportamento físico é inferida de jsdom ou emulação.

Teste portátil do defeito do Espião, após instalar as dependências e um Chromium do Playwright:

```sh
npm ci
npx playwright install chromium
VITE_BASE_PATH=/Blood-on-the-Clocktower/ npm run build
npm run test:e2e
```

Em PowerShell, defina VITE_BASE_PATH por `$env:VITE_BASE_PATH='/Blood-on-the-Clocktower/'` antes do build. E2E_BASE_URL permite testar um site já servido; PLAYWRIGHT_CHROMIUM_EXECUTABLE permite usar um Chromium instalado. O teste inicia preview quando não há URL externa. Não faz parte de npm test, que mantém o escopo Vitest existente; o resultado de sua execução é registrado separadamente.

### Inventário de fontes

Cada linha tem o módulo ES e o PT-BR correspondentes, incluindo os nomes correct/wrong de info-ping. Os números incluem metadados de tipo de linha.

| Fonte EN                                                             | Folhas por idioma | PT-BR    |
| -------------------------------------------------------------------- | ----------------: | -------- |
| `src/lib/effects/definition/butler-master/i18n/en.ts`                |                 5 | Completo |
| `src/lib/effects/definition/dead/i18n/en.ts`                         |                 2 | Completo |
| `src/lib/effects/definition/deflect/i18n/en.ts`                      |                 2 | Completo |
| `src/lib/effects/definition/demon-successor/i18n/en.ts`              |                 2 | Completo |
| `src/lib/effects/definition/drunk/i18n/en.ts`                        |                 2 | Completo |
| `src/lib/effects/definition/imp-starpass-pending/i18n/en.ts`         |                 2 | Completo |
| `src/lib/effects/definition/info-ping/i18n/correct-en.ts`            |                 3 | Completo |
| `src/lib/effects/definition/info-ping/i18n/wrong-en.ts`              |                 3 | Completo |
| `src/lib/effects/definition/martyrdom/i18n/en.ts`                    |                 2 | Completo |
| `src/lib/effects/definition/misregister/i18n/en.ts`                  |                13 | Completo |
| `src/lib/effects/definition/pending-role-reveal/i18n/en.ts`          |                 2 | Completo |
| `src/lib/effects/definition/poisoned/i18n/en.ts`                     |                 2 | Completo |
| `src/lib/effects/definition/pure/i18n/en.ts`                         |                 2 | Completo |
| `src/lib/effects/definition/red-herring/i18n/en.ts`                  |                 5 | Completo |
| `src/lib/effects/definition/safe/i18n/en.ts`                         |                 2 | Completo |
| `src/lib/effects/definition/slayer-bullet/i18n/en.ts`                |                 2 | Completo |
| `src/lib/effects/definition/used-dead-vote/i18n/en.ts`               |                 2 | Completo |
| `src/lib/i18n/translations/en.ts`                                    |               514 | Completo |
| `src/lib/roles/definition/imp/i18n/en.ts`                            |                36 | Completo |
| `src/lib/roles/definition/trouble-brewing/baron/i18n/en.ts`          |                14 | Completo |
| `src/lib/roles/definition/trouble-brewing/butler/i18n/en.ts`         |                16 | Completo |
| `src/lib/roles/definition/trouble-brewing/chef/i18n/en.ts`           |                13 | Completo |
| `src/lib/roles/definition/trouble-brewing/drunk/i18n/en.ts`          |                14 | Completo |
| `src/lib/roles/definition/trouble-brewing/empath/i18n/en.ts`         |                13 | Completo |
| `src/lib/roles/definition/trouble-brewing/fortune-teller/i18n/en.ts` |                23 | Completo |
| `src/lib/roles/definition/trouble-brewing/investigator/i18n/en.ts`   |                16 | Completo |
| `src/lib/roles/definition/trouble-brewing/librarian/i18n/en.ts`      |                16 | Completo |
| `src/lib/roles/definition/trouble-brewing/mayor/i18n/en.ts`          |                 9 | Completo |
| `src/lib/roles/definition/trouble-brewing/monk/i18n/en.ts`           |                15 | Completo |
| `src/lib/roles/definition/trouble-brewing/poisoner/i18n/en.ts`       |                17 | Completo |
| `src/lib/roles/definition/trouble-brewing/ravenkeeper/i18n/en.ts`    |                13 | Completo |
| `src/lib/roles/definition/trouble-brewing/recluse/i18n/en.ts`        |                 9 | Completo |
| `src/lib/roles/definition/trouble-brewing/saint/i18n/en.ts`          |                 9 | Completo |
| `src/lib/roles/definition/trouble-brewing/scarlet-woman/i18n/en.ts`  |                13 | Completo |
| `src/lib/roles/definition/trouble-brewing/slayer/i18n/en.ts`         |                13 | Completo |
| `src/lib/roles/definition/trouble-brewing/soldier/i18n/en.ts`        |                11 | Completo |
| `src/lib/roles/definition/trouble-brewing/spy/i18n/en.ts`            |                18 | Completo |
| `src/lib/roles/definition/trouble-brewing/undertaker/i18n/en.ts`     |                14 | Completo |
| `src/lib/roles/definition/trouble-brewing/virgin/i18n/en.ts`         |                13 | Completo |
| `src/lib/roles/definition/trouble-brewing/washerwoman/i18n/en.ts`    |                16 | Completo |
| `src/lib/roles/definition/villager/i18n/en.ts`                       |                 9 | Completo |

## Como conferir sem apagar dados

1. Abra com internet e conclua/devolva qualquer tela privada normalmente. No menu principal, abra Sobre e atualizações e confira a versão.
2. Se houver atualização, conclua ações, feche outras janelas do Grimorium e use Atualizar e reabrir pelo menu. Não há ativação durante a preparação.
3. Se a instalação antiga ainda não tiver Sobre, deixe baixar a atualização, feche todas as janelas do Grimorium, incluindo abas do site e da PWA, e reabra. Se necessário, repita o ciclo após confirmar a conexão. Não apague dados nem desinstale.
4. Compare o SHA curto com o relatório de publicação. Reabra a partida e confira idioma e devolução protegida.

## Limites

A versão do Android físico relatada antes de W05 não pôde ser identificada remotamente. PT-BR usa escolhas documentadas do projeto quando a comunidade tem variantes. Eventos antigos e nomes de partidas não são reescritos. Rotas legadas desativadas continuam traduzidas no inventário. O app mantém seus limites de regras existentes. Não houve mudanças nas regras, nos formatos de save ou recuperação de tarefas perdidas. O relatório final registra SHA publicado, deploy e conferência pública após o push normal.
