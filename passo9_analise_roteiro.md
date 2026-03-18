# Respostas das Perguntas (Passo 9)

## 1. Escalabilidade: Como esta arquitetura se comportaria com 1000 usuarios simultaneos?

Ela provavelmente vai funcionar, mas com lentidao em alguns momentos. Como o servidor e unico e o banco e SQLite, quando muita gente tenta usar ao mesmo tempo pode ter fila de requisicoes, principalmente nas operacoes de criar e editar tarefas.

## 2. Disponibilidade: Quais sao os pontos de falha identificados?

Os principais pontos de falha sao:

- API rodando em uma instancia so
- banco local no mesmo servidor
- sem replica e sem balanceador

Se esse servidor cair, o sistema inteiro para.

## 3. Performance: Onde estao os possiveis gargalos do sistema?

Os gargalos mais provaveis sao:

- muitas escritas ao mesmo tempo no SQLite
- aumento da tabela sem muitos indices
- processamento de token (JWT) em alto volume
- logs no console durante carga alta

## 4. Manutencao: Como seria o processo de atualizacao em producao?

Um jeito simples e seguro seria:

1. Testar antes em ambiente de homologacao.
2. Fazer backup do banco.
3. Publicar a nova versao.
4. Testar rapidamente login, health e CRUD.
5. Se der problema, fazer rollback.

## 5. Evolucao: Que mudancas seriam necessarias para suportar multiplas regioes?

Para funcionar bem em multiplas regioes, seria necessario:

- trocar SQLite por um banco mais robusto (ex.: PostgreSQL)
- usar mais de uma instancia da API
- colocar balanceamento de carga
- melhorar monitoramento (logs e metricas)
- planejar replicacao de dados entre regioes
