
uso dos registros usando google sheets:
https://script.google.com/macros/s/AKfycbwmaU2Wf69_J8OGTZ6l8inxn2dCsm0CWsvgYmbghfgd2KyyyVgFa30j7TzID6XYUKjuTg/exec
sheet usada: kinob-registrar
https://docs.google.com/spreadsheets/d/1rld2bjxSADeCLxmdsewXuO7Pxg43KabhLLkkYTUaHAU/edit?gid=0#gid=0

backend 

./kinob/backend/
├── models/               # Modelos do MongoDB
│   └── Log.js            # Modelo para os logs
├── routes/               # Rotas da API
│   └── logRoutes.js      # Rotas para manipular logs
├── app.js                # Arquivo principal do servidor
├── package.json          # Metadados e dependências do projeto
└── .env                  # Variáveis de ambiente (opcional)


6. Variáveis de Ambiente (Opcional)
Crie um arquivo .env na raiz do backend para armazenar variáveis sensíveis, como a URI do MongoDB:

Copy
1
2
MONGODB_URI=mongodb+srv://andrenox:m$4dm1n$@defaultnosql.w3fpt.mongodb.net/?retryWrites=true&w=majority&appName=defaultnosql
PORT=3000
Certifique-se de adicionar o .env ao .gitignore para evitar expor informações sensíveis.

