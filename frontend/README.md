# 🚗 JMS Automotive — Car Showroom App

Aplicação mobile de showroom de carros de alto desempenho, desenvolvida com **React Native** no frontend e **Node.js + TypeScript** no backend. Projeto fullstack completo com autenticação JWT, painel administrativo, integração com APIs externas e deploy em produção.

---

## 📱 Demonstração

> App mobile com UI glassmorphism, catálogo de veículos premium, sistema de avaliações, favoritos, histórico de visualizações e muito mais.

---

## 🏗️ Estrutura do Repositório

```
jms_automotive/
├── frontend/        # React Native + Expo
└── backend/         # Node.js + TypeScript + Express
```

---

## ✨ Funcionalidades

### 👤 Autenticação
- Cadastro e login com JWT (access token + refresh token)
- Login biométrico (Face ID / Touch ID / Impressão Digital)
- Controle de roles: `user` e `admin`

### 🚗 Catálogo de Veículos
- Listagem com busca, filtros avançados e ordenação
- Detalhes completos de cada veículo
- Galeria de imagens via Unsplash API
- Comparação entre dois veículos lado a lado
- Compartilhamento de veículos

### ⭐ Avaliações
- Sistema de ratings com notas de 1 a 5
- Comentários por veículo
- Edição e exclusão de avaliações próprias
- Distribuição gráfica de notas

### ❤️ Favoritos
- Adicionar e remover favoritos
- Listagem de favoritos do usuário

### 📜 Histórico
- Registro automático de visualizações
- Histórico recente com timestamp
- Estatísticas de marcas mais vistas
- Limpeza de histórico

### 👤 Perfil
- Perfil público com bio, localização e marca favorita
- Foto de perfil e capa
- Configurações de privacidade
- Estatísticas de uso (XP, achievements, nível)

### 🛡️ Painel Admin
- Cadastro, edição e exclusão de veículos
- Listagem e busca de usuários
- Acesso exclusivo para usuários com role `admin`

### 🤖 Chatbot
- Assistente virtual com conhecimento sobre o catálogo
- Sugestões interativas

---

## 🛠️ Stack Tecnológica

### Frontend
| Tecnologia | Uso |
|---|---|
| React Native | Framework mobile |
| Expo | Plataforma de desenvolvimento |
| TypeScript | Tipagem estática |
| Axios | Requisições HTTP |
| AsyncStorage | Persistência local |
| Expo Local Authentication | Biometria |
| Expo Notifications | Notificações push |

### Backend
| Tecnologia | Uso |
|---|---|
| Node.js | Runtime |
| TypeScript | Tipagem estática |
| Express | Framework web |
| MongoDB Atlas | Banco de dados |
| Mongoose | ODM |
| JWT | Autenticação |
| bcryptjs | Hash de senhas |
| Zod | Validação de dados |
| Helmet + CORS | Segurança |
| Morgan | Logging |

### Infraestrutura
| Serviço | Uso |
|---|---|
| MongoDB Atlas | Banco em nuvem |
| Render | Deploy do backend |
| Unsplash API | Imagens dos veículos |

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Expo CLI
- Conta no MongoDB Atlas

---

### Backend

```bash
# Clone o repositório
git clone https://github.com/gaturama/jms_automotive.git
cd jms_automotive/backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais

# Rode em desenvolvimento
npm run dev
```

#### Variáveis de ambiente (`.env`)
```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/showroom
JWT_SECRET=seu_secret_aqui
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=seu_refresh_secret_aqui
JWT_REFRESH_EXPIRES_IN=30d
NODE_ENV=development
PORT=3000
```

#### Scripts disponíveis
```bash
npm run dev          # Servidor em desenvolvimento
npm run build        # Compilar TypeScript
npm start            # Iniciar em produção
npm run seed         # Popular banco com veículos
npm run create:admin # Criar usuário administrador
```

---

### Frontend

```bash
cd jms_automotive/frontend

# Instale as dependências
npm install

# Configure a URL da API
# Em src/services/api.ts, defina o BASE_URL:
# const BASE_URL = 'http://SEU_IP:3000/api'; (desenvolvimento)
# const BASE_URL = 'https://jms-showroom-api.onrender.com/api'; (produção)

# Inicie o app
npx expo start
```

---

## 📡 API Endpoints

### Auth
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/register` | Cadastro de usuário |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh-token` | Renovar token |

### Carros
| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | `/api/cars` | Listar carros (com filtros e paginação) | ❌ |
| GET | `/api/cars/:id` | Detalhes de um carro | ❌ |
| GET | `/api/cars/compare?ids=...` | Comparar carros | ❌ |
| POST | `/api/cars` | Cadastrar carro | Admin |
| PUT | `/api/cars/:id` | Atualizar carro | Admin |
| DELETE | `/api/cars/:id` | Deletar carro | Admin |

### Usuários
| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | `/api/users/me` | Dados do usuário logado | ✅ |
| GET | `/api/users/stats` | Estatísticas do usuário | ✅ |
| PUT | `/api/users/profile` | Atualizar perfil | ✅ |
| PUT | `/api/users/notifications` | Configurar notificações | ✅ |
| GET | `/api/users/list` | Listar usuários | Admin |
| GET | `/api/users/:id/profile` | Perfil público | ❌ |

### Favoritos
| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | `/api/favorites` | Listar favoritos | ✅ |
| POST | `/api/favorites/:carId` | Adicionar favorito | ✅ |
| DELETE | `/api/favorites/:carId` | Remover favorito | ✅ |

### Avaliações
| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | `/api/reviews/car/:carId` | Reviews de um carro | ❌ |
| POST | `/api/reviews/:carId` | Criar review | ✅ |
| PUT | `/api/reviews/:id` | Editar review | ✅ |
| DELETE | `/api/reviews/:id` | Deletar review | ✅ |

### Histórico
| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | `/api/history` | Listar histórico | ✅ |
| POST | `/api/history/:carId` | Registrar visualização | ✅ |
| DELETE | `/api/history` | Limpar histórico | ✅ |

---

## 🗂️ Estrutura do Backend

```
backend/src/
├── config/
│   ├── database.ts       # Conexão MongoDB
│   └── cloudinary.ts     # Config Cloudinary
├── controllers/          # Lógica de negócio
├── middlewares/
│   ├── auth.middleware.ts
│   ├── admin.middleware.ts
│   ├── error.middleware.ts
│   └── upload.middleware.ts
├── models/               # Schemas Mongoose
├── routes/               # Definição de rotas
├── schemas/              # Validação Zod
├── scripts/
│   ├── seed.ts           # Popular banco
│   └── createAdmin.ts    # Criar admin
├── utils/
│   ├── jwt.ts
│   └── apiResponse.ts
├── app.ts
└── server.ts
```

---

## 🗂️ Estrutura do Frontend

```
frontend/src/
├── components/           # Componentes reutilizáveis
├── context/              # Contexts (Auth, Favorites, Ratings...)
├── data/                 # Dados estáticos
├── hooks/                # Custom hooks
├── navigation/           # Configuração de rotas
├── screens/              # Telas do app
├── services/             # Integração com API
├── styles/               # Estilos
├── types/                # Tipagens TypeScript
└── utils/                # Utilitários
```

---

## 🔐 Segurança

- Senhas armazenadas com hash **bcrypt** (salt rounds: 12)
- Autenticação via **JWT** com expiração configurável
- Refresh token para renovação de sessão
- Middleware de autorização por **roles** (`user` / `admin`)
- **Helmet** para headers de segurança HTTP
- **CORS** configurado
- Variáveis sensíveis via `.env` (nunca commitadas)

---

## 🌐 Deploy

- **Backend:** [Render](https://render.com) — `https://jms-showroom-api.onrender.com`
- **Banco:** [MongoDB Atlas](https://www.mongodb.com/atlas)

> ⚠️ O plano gratuito do Render hiberna após 15 minutos de inatividade. A primeira requisição pode levar até 1 minuto para responder.

---

## 👨‍💻 Autor

Desenvolvido por **Gabriel** — projeto fullstack para portfólio.

[![GitHub](https://img.shields.io/badge/GitHub-gaturama-181717?style=flat&logo=github)](https://github.com/gaturama)

---

## 📄 Licença

Este projeto está sob a licença MIT.