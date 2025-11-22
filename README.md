🐦 Tuiter Clone API

Bem-vindo ao backend do Twitter Clone. Este projeto é uma API que simula as principais funcionalidades de uma rede social, incluindo postagens, interações e um sistema de administração.

O objetivo foi criar uma aplicação robusta, containerizada e pronta para rodar, focando na lógica dos relacionamentos entre usuários e conteúdo.

🗄️ Estrutura do Banco de Dados (Tabelas e Relações)

1 - Tabela Users
Armazena os dados (nome, email, senha criptografada, biografia e avatar) de quem utiliza a plataforma. Possui uma coluna especial (is_admin) que determina se o usuário tem poder para acessar as rotas de administrador.
Um usuário pode ter vários Posts 
Um usuário pode dar vários Likes

2 - Tabela Posts
Armazena o conteúdo publicado (descrição, imagem e autor).
Diferencial: possui um autorelacionamento que permite republicar (retweet) um post sem duplicar o conteúdo. 
A coluna "type" define se é um TWEET, RETWEET ou QUOTE_TWEET.
A coluna "original_post_id" aponta para o ID do post original dentro da mesma tabela, no caso do post nao ser um TWEET.
Um post pertence a um Usuário
Um post pode ter vários Likes
Um post pode ser "pai" de outros posts

3 - Tabela Likes
Conecta usuários e posts, guardando user_id e post_id.
Um like pertence a um Usuário
Um like pertence a um Post.


🛠️ COMO RODAR O PROJETO
Para facilitar a avaliação, eu já incluí o arquivo .env no projeto com as configurações padrões para o Docker. Mas entendo que, em um cenário real, o correto é ocultar o .env.

Pré-requisitos:
Docker e Docker Compose instalados.

1 - Suba o ambiente: Abra o terminal na pasta do projeto e rode:
docker-compose up -d

2 - Crie as Tabelas (Migrations): Com o Docker rodando, execute:
docker-compose exec app npx sequelize db:migrate

3 - Agora é só testar as rotas!
Abra o Postman
Importe o arquivo "nomedoarquivo" que está na raiz deste projeto.

Configure o Environment:
Crie um novo environment chamado "Tuiter".
Adicione a variável baseUrl com o valor http://localhost:3000
Adicione a variável authToken (deixe o valor em branco, ela será preenchida automaticamente).
Selecione este environment no canto superior direito do Postman.


SOBRE O ENVIO DE EMAILS (Recuperação de Senha)
O sistema possui um fluxo completo de "Esqueci minha senha", que envia um token seguro por e-mail. Utilizei o serviço Mailtrap para simular o envio sem riscos de spam. Como as credenciais são pessoais, o funcionamento é o seguinte:

Se você tiver conta no Mailtrap: Pode colocar suas credenciais no .env para ver o e-mail chegando na sua caixa de entrada virtual.

Se não tiver / não quiser criar:
Ao solicitar a recuperação de senha, o sistema imprime o token diretamente no console. Você pode copiar o token dali e trocar a senha.

FLUXO DE TESTE RECOMENDADO:

Criar Usuário: Comece pela rota POST /user para criar sua conta. (Você pode criar um ADM Direto pelo postman, também)

Login: Execute a rota POST /auth

Rotas Privadas: Agora você pode executar qualquer rota privada, como criar posts ou dar likes

Recuperação de Senha:

Ao executar POST /forgot-password, verifique o console/terminal da aplicação (ou o Mailtrap) para copiar o token gerado.

Cole esse token manualmente no corpo da requisição PUT /reset-password.


ENDPOINTS(Rotas):
Abaixo estão listados todos os endpoints da API.

Legenda de Acesso:

(Público): Qualquer pessoa pode acessar.

(Privado): Precisa enviar o Token JWT no Header Authorization.

(Admin): Precisa ser um usuário com permissão de Administrador.

🏠 Geral
GET / Verifica se a API está online (Health Check). (Público)

🔐 Autenticação e Segurança
POST /auth Recebe e-mail e senha. Retorna o Token JWT se as credenciais estiverem corretas. (Público)

POST /forgot-password Inicia a recuperação de senha enviando um token temporário por e-mail (ou console). (Público)

PUT /reset-password Recebe o token de recuperação e a nova senha para efetuar a troca. (Público)

👤 Usuários
POST /user Cria um novo usuário no sistema. (Público)

GET /user-profile/:id Exibe os dados públicos (nome, bio, avatar) de um usuário específico pelo ID. (Público)

PUT /user Atualiza os dados (nome, bio, avatar, senha) do usuário que está logado. (Privado)

DELETE /user Exclui permanentemente a conta do usuário que está logado. (Privado)

📝 Posts (Tweets)
GET /posts Lista todos os posts (Feed), ordenados do mais recente para o mais antigo. (Público)

GET /posts/:id Exibe os detalhes completos de um post específico. (Público)

POST /posts Cria uma nova postagem. Pode ser um Tweet original ou um Retweet (se enviar o ID original). (Privado)

PUT /posts/:id Edita o conteúdo de uma postagem, desde que você seja o autor. (Privado)

DELETE /posts/:id Remove uma postagem, desde que você seja o autor. (Privado)

❤️ Interações (Likes)
POST /posts/:id/like Adiciona uma curtida ao post especificado. (Privado)

DELETE /posts/:id/like Remove a curtida do post especificado. (Privado)

🛡️ Administração
DELETE /admin/posts/:id Rota de moderação. Permite que um administrador delete qualquer post do sistema, independente de quem seja o autor. (Admin)