# Frontend — Todolist (React + Tailwind CSS)

Interface moderna e responsiva para a API do TodoList, construída com **React**, **Vite** e **Tailwind CSS**.

## Tecnologias

| Camada | Tecnologia |
|--------|------------|
| Framework | React 18 |
| Build tool | Vite |
| Estilização | Tailwind CSS |
| Ícones | Lucide React |
| Requisições | Fetch API (via `services/api.js`) |

## Estrutura

```
frontend/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
├── .gitignore
├── public/
│   └── vite.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── services/
    │   └── api.js
    ├── hooks/
    │   └── useTasks.js
    ├── contexts/
    │   └── ThemeContext.jsx
    ├── utils/
    │   └── dateUtils.js
    └── components/
        ├── TaskForm.jsx
        ├── TaskList.jsx
        ├── TaskItem (dentro de TaskList.jsx)
        ├── FilterBar.jsx
        ├── StatsCards.jsx
        ├── ProgressBar.jsx
        └── Toast.jsx
```

## Como executar

### 1. Instalar dependências

```powershell
cd frontend
npm install
```

> Se o PowerShell bloquear, execute: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` ou use o Prompt de Comando.

### 2. Configurar variáveis de ambiente

Copie o exemplo e ajuste se necessário:

```powershell
Copy-Item .env.example .env
```

O arquivo `.env` deve conter:

```
VITE_API_URL=http://localhost:3333
```

### 3. Rodar o backend

Certifique-se de que o backend está rodando em `http://localhost:3333`:

```powershell
cd ../backend
npm install
npm run dev
```

### 4. Rodar o frontend

```powershell
cd ../frontend
npm run dev
```

A interface abrirá em `http://localhost:5173`.

### 5. Build para produção

```powershell
npm run build
```

O resultado fica em `dist/`.

## Funcionalidades

- ✅ Criar tarefa com título e data limite
- ✅ Listar tarefas com busca em tempo real
- ✅ Filtrar por todas / pendentes / concluídas
- ✅ Marcar como concluída / reabrir
- ✅ Editar título e data
- ✅ Excluir tarefa com confirmação
- ✅ Barra de progresso e cards de estatísticas
- ✅ Tema claro/escuro (salvo no localStorage)
- ✅ Toast notifications para sucesso/erro
- ✅ Design responsivo (mobile-first)
- ✅ Animações e transições suaves

## Integração com o backend

O frontend consome a API Fastify existente:

| Método | Endpoint |
|--------|----------|
| `GET` | `/api/tasks?search=&status=` |
| `POST` | `/api/tasks` |
| `PATCH` | `/api/tasks/:id` |
| `DELETE` | `/api/tasks/:id` |

O proxy do Vite está configurado em `vite.config.js` para redirecionar `/api` para `http://localhost:3333` durante o desenvolvimento.
