### 🔽 Requisitos

1. Ter o **NodeJs** e o **Yarn** instalado
2. Ter instâncias do **Redis** e **PostgreSQL** em execução
3. Um dispositivo ou emulador **Android** conectado ao computador
4. **Reactotron** rodando na porta 9090 (**Opcional**)

### :rocket: Começando

1. `git clone https://github.com/Jaquespd/mopa.git`
2. `cd mopa`

### :rocket: Preparando o ambiente

1. Abra o Docker e crie os dois banco de dados necessarios, postgres e redis
2. `docker run --name mopa2_redis -p 6379:6379 -d -t redis:alpine`
3. `docker run --name mopa2_PG -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres`
4. Inisialize os bancos de dados
5. `docker start mopa2_redis`
6. `docker start mopa2_PG`

### :rocket: Iniciando com o backend

1. `cd backend`
2. `yarn`
3. `Criar o arquivo .env com base no .env.example`
4. `yarn sequelize db:migrate`
5. `yarn sequelize db:seed:all`
6. `yarn dev`

### 💻 Iniciando com o Front-end

1. `cd frontend`
2. `yarn`
3. `yarn start`

Existe um usuário administrador padrão: admin@mopa.com / 123456

### 📱Iniciando com o Mobile (Apenas Android)

1. `cd mobile`
2. `yarn`
3. `adb reverse tcp:9090 tcp:9090 (Reactotron)`
4. `adb reverse tcp:3333 tcp:3333`
5. `react-native start`
6. `react-native run-android`

### 🧰 Ferramentas utilizadas

- ⚛️ **ReactJs** - Biblioteca Javascript para criar interfaces de usuário.
- ⚛️ **React Native** - Framework para criar apps nativos usando React.
- 💅 **Styled Components** - Biblioteca Javascript pra estilizar componentes.
- 🔁 **Redux** - Biblioteca JavaScript de código aberto para gerenciar o estado do aplicativo.
- 🔂 **Redux Saga** - Biblioteca Javascript que torna os efeitos colaterais do aplicativo mais faceis de gerenciar.
- 📛 **Sentry** - Plataforma para monitoramento de erros e notificação em tempo real.
- 📷 **React-Native-Camera** - Biblioteca React Native para manusear a camera dentro do app mobile.

<hr>
<p align="center"> com 💜 Jaques Delgado </p>
