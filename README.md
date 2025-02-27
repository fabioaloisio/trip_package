# 🌎 Viagens Incríveis

Sistema de reserva de pacotes de viagens desenvolvido com Node.js, Express e MySQL.

## 📋 Descrição

Este projeto é uma aplicação web fullstack que permite aos usuários visualizar, reservar e gerenciar pacotes de viagens. O sistema inclui autenticação de usuários, gestão de sessões e integração com banco de dados.

## 🛠️ Tecnologias Utilizadas

### Backend
- Node.js
- Express
- MySQL
- Express Session
- Bcrypt
- CORS
- Dotenv

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla)
- Fetch API

## 🏗️ Estrutura do Projeto

├── backend/
│ ├── src/
│ │ ├── config/ # Configurações (banco de dados, variáveis de ambiente)
│ │ ├── middleware/ # Middlewares do Express
│ │ ├── models/ # Modelos de dados
│ │ ├── routes/ # Rotas da API
│ │ └── app.js # Configuração do Express
│ └── package.json
│
└── frontend/
└── src/
├── js/ # Scripts JavaScript
├── styles/ # Arquivos CSS
├── pages/ # Páginas HTML
└── images/ # Imagens e recursos estáticos

## ⚙️ Requisitos

- Node.js 18.x ou superior
- MySQL 8.x
- Docker (opcional)
- npm ou yarn

## 🚀 Começando

1. Clone o repositório:
```bash
git clone https://github.com/fabioaloisio/trip_package.git
cd trip_package
```

2. Configure o backend:
```bash
cd backend
cp .env.example .env  # Configure suas variáveis de ambiente
npm install
```

3. Configure o banco de dados:
```bash
# No MySQL
CREATE DATABASE backend;
```

4. Inicie o backend:
```bash
npm run dev
```

5. Configure o frontend:
```bash
cd ../frontend
npm install
npm run dev
```

## 📝 Funcionalidades

### Públicas
- Visualização de pacotes de viagens disponíveis
- Registro de usuários
- Login de usuários

### Autenticadas
- Visualização detalhada dos pacotes
- Reserva de pacotes
- Gerenciamento de reservas
- Logout

## 🔒 Autenticação

O sistema utiliza autenticação baseada em sessão com Express Session e MySQL como store. As senhas são hasheadas usando bcrypt antes de serem armazenadas no banco de dados.

## 🗄️ Banco de Dados

### Tabelas Principais

#### users
- id (INT, PK)
- username (VARCHAR)
- email (VARCHAR)
- password (VARCHAR)
- created_at (TIMESTAMP)

#### packages
- id (INT, PK)
- name (VARCHAR)
- destination (VARCHAR)
- description (TEXT)
- image_url (VARCHAR)
- departure_date (DATE)
- duration (INT)
- price (DECIMAL)
- available_seats (INT)
- created_at (TIMESTAMP)

#### bookings
- id (INT, PK)
- user_id (INT, FK)
- package_id (INT, FK)
- quantity (INT)
- total_price (DECIMAL)
- created_at (TIMESTAMP)

## 🔐 Variáveis de Ambiente

```env
# Backend (.env)
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASS=sua_senha
DB_NAME=viagens_incriveis
SESSION_SECRET=seu_secret
```

## 👥 Contribuição

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ✨ Agradecimentos

- [Unsplash](https://unsplash.com) - Pelas imagens utilizadas
- [Express](https://expressjs.com)
- [MySQL](https://www.mysql.com)