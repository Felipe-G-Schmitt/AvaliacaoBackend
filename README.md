# Aplicação MVC de gerenciamento de produtos com pedidos e categorias

API REST construída com Node.js, Express e Sequelize que permite o gerenciamento de:

- Usuários (`user`)
- Produtos (`product`)
- Categorias (`category`)
- Pedidos (`order`) com associação N-N a produtos via `prodOrder`

A autenticação é feita via JWT e o banco de dados utilizado é MySQL.

---

## Tecnologias Utilizadas

- Node.js
- Express
- Sequelize
- MySQL
- Bcrypt (criptografia de senhas)
- JWT (JSON Web Token)
- Swagger (documentação da API)

---

## Estrutura de Pastas

/config
  - database.js

/controllers
  - userController.js
  - productController.js
  - categoryController.js
  - orderController.js

/models
  - user.js
  - product.js
  - category.js
  - order.js
  - prodOrder.js

/routes
  - userRoutes.js
  - productRoutes.js
  - categoryRoutes.js
  - loginRoutes.js
  - registerRoutes.js
  - orderRoutes.js

/middlewares
  - authMiddle.js
  - loginMiddle.js
  - registerMiddle.js

/errors
  - conflict.js
  - email-validate.js
  - errorMiddle.js
  - not-found.js
  - token-validate.js
  - missing-values.js

/docs
  - swagger.js

server.js

---

## Lógica Principal

### User
**Campos:**
- `id`
- `nome`
- `email`
- `senha` (criptografada com bcrypt)

### Product
**Campos:**
- `id`
- `nome`
- `price`
- `categoryId`

### Category
**Campos:**
- `id`
- `nome`

### Order
**Campos:**
- `id`
- `userId` (relacionamento com usuário)
- `createdAt`, `updatedAt`

### prodorder
Tabela associativa entre `order` e `product` com o campo:
- `id`
- `quantity`
- `orderId`
- `productId`
- `createdAt`, `updatedAt`

---

## Funcionalidades

- Cadastro, autenticação e gerenciamento de usuários.
- Criação e gerenciamento de produtos.
- Organização de produtos por categorias.
- Criação de pedidos com vários produtos.
- Proteção de rotas com autenticação JWT.
- Operações CRUD completas para todas as entidades.
- Documentação interativa com Swagger.

---

## Banco de Dados

- Conexão via Sequelize com MySQL.
- Relacionamentos definidos entre as tabelas.
- Uso de `sync({ force: true })` em ambiente de desenvolvimento para recriar tabelas.

---

## Como Executar o Projeto

**1. Clone o repositório**
git clone git@github.com:Felipe-G-Schmitt/AvaliacaoBackend.git

**2. Instale as dependências**
npm install

**3. Configure o banco de dados em /config/database.js**

**4. Execute o projeto**
npm start

## Autenticação
As rotas protegidas exigem o envio de um token JWT no cabeçalho

Authorization: Bearer <token>

## Rotas

| Método | Rota                 | Descrição                 | Autenticação |
| ------ | -------------------- | ------------------------- | ------------ |
| POST   | /register            | Cadastro de usuário       | ❌            |
| POST   | /login               | Login e geração de token  | ❌            |
| GET    | /api/user            | Listar todos os usuários  | ✅            |
| GET    | /api/user/\:id       | Obter usuário por ID      | ✅            |
| PUT    | /api/user/\:id       | Atualizar usuário         | ✅            |
| DELETE | /api/user/\:id       | Deletar usuário           | ✅            |
| POST   | /api/product         | Criar produto             | ✅            |
| GET    | /api/product         | Listar todos os produtos  | ✅            |
| GET    | /api/product/\:id    | Obter produto por ID      | ✅            |
| PUT    | /api/product/\:id    | Atualizar produto         | ✅            |
| DELETE | /api/product/\:id    | Deletar produto           | ✅            |
| POST   | /api/category        | Criar categoria           | ✅            |
| GET    | /api/category        | Listar categorias         | ✅            |
| PUT    | /api/category/\:id   | Atualizar categoria       | ✅            |
| DELETE | /api/category/\:id   | Deletar categoria         | ✅            |
| POST   | /api/order           | Criar pedido com produtos | ✅            |
| GET    | /api/order           | Listar pedidos            | ✅            |
| GET    | /api/order/\:id      | Obter pedido por ID       | ✅            |
| DELETE | /api/order/\:id      | Cancelar pedido           | ✅            |

## Documentação Swagger
http://localhost:3000/api-docs
