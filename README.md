## Reflexão Técnica

### 1. O que aprendi sobre o fluxo e seu funcionamento

Durante o desafio consegui entender melhor, na prática, a importância de um fluxo de CI/CD. Sem esse tipo de processo automatizado, o código ficaria muito mais sujeito a erros tanto no repositório quanto na etapa de deploy. Mesmo que CI/CD não elimine todos os problemas, ele reduz bastante os riscos e permite que o processo de entrega seja melhorado continuamente.

Também passei a entender melhor algumas etapas do pipeline, como checkout do código, execução de containers Docker durante o build e configuração de ambientes como Node e Java. Nos cursos eu já tinha visto essas coisas, mas de forma mais superficial. Nesse desafio precisei ler documentação e entender o motivo de cada etapa existir, o que ajudou muito a consolidar o aprendizado.

### 2. Qual parte foi mais desafiadora e por quê

O maior desafio foi o início do projeto. Nos cursos que fiz, os conteúdos de DevOps normalmente eram ensinados de forma separada, como GitHub Actions, Docker ou Linux. Quando precisei juntar tudo em um único fluxo funcional, percebi que a parte mais difícil era justamente entender por onde começar e como organizar cada etapa.

Outro desafio foi identificar melhorias e aplicar boas práticas. Analisei bastante documentação e também alguns repositórios de referência, como o Collaborator que utilizamos na NEKI. Nesse processo também acabei implementando algumas melhorias por conta própria, como configurar um runner, ajustar armazenamento da máquina e aplicar proteções de branch no GitHub para evitar pushes diretos na branch principal.

### 3. O que eu faria diferente se tivesse mais tempo

Durante o desenvolvimento eu fiz o deploy da aplicação em uma máquina virtual para validar se tudo estava funcionando corretamente. A aplicação rodou bem, mas se tivesse mais tempo eu provavelmente automatizaria melhor essa etapa de deploy para deixar o processo mais completo.

Uma possibilidade seria utilizar uma ferramenta como ArgoCD para gerenciar a atualização das imagens e permitir rollback em caso de erro. Também seria interessante utilizar Kubernetes para trabalhar com múltiplas réplicas e escalabilidade. No entanto, preferi manter a solução mais simples por estar utilizando o plano gratuito do Google Cloud e para evitar custos desnecessários.

### 4. Por que DevOps é importante no contexto da NEKI

DevOps não é apenas um conjunto de ferramentas, mas uma cultura que busca melhorar a forma como software é desenvolvido e entregue. Com processos automatizados de build, teste e deploy, as equipes conseguem reduzir erros, acelerar entregas e ter mais confiança no que está sendo colocado em produção.

No contexto da NEKI isso é importante porque aumenta a confiabilidade do processo de desenvolvimento e reduz riscos durante as entregas. Quanto mais automatizado e bem definido for o fluxo, menor é a chance de falhas humanas afetarem o produto final, o que também contribui para a credibilidade da empresa.
