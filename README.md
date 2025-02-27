# FILM!

#### Проект FILM представляет из себя онлайн-сервис бронирования билетов в кинотеатр.
#### Технические особенности: просмотр списка фильмов, ознакомление с конкретным фильмом и его сеансами, просмотр карты мест в зале, выбор интересующих мест и оформление заказа.
#### Используемый стек: `HTML`, `SCSS`, `JavaScript`, `TypeScript`, `React`, `Jest`, `Node`, `Nest`, `PostgreSQL`, `Docker`.

## Установка

### Postgres

Установите СУБД PostgreSQL и запустить её (можно воспользоваться запуском СУБД в Docker). Подключившись от лица супер-пользователя postgres создайте отдельного пользователя.
Используйте заготовки запросов для заполнения СУБД тестовыми данными фильмов и заказов, эти файлы находятся в проекте:
`backend/test/prac.init.sql` — создаёт БД и таблицы;
`backend/test/prac.films.sql` — заполняет таблицу фильмами;
`backend/test/prac.shedules.sql` — заполняет таблицу расписанием сеансов.

### Бэкенд

Перейдите в папку с исходным кодом бэкенда

`cd backend`

Установите зависимости:

`npm install`

Создайте `.env` файл из примера `.env.example`.

СУБД должна быть установлена и запущена.

Запустите бэкенд:

`npm start:dev`

#### Приложение доступно на http://localhost:3000/

### Фронтенд

Перейдите в папку с исходным кодом фронтенд

`cd frontend`

Создайте `.env` файл из примера `.env.example`.

Установите зависимости

`npm install`

Запустите фронтенд:

`npm run dev`

#### Приложение доступно на http://localhost:5173/

## Запуск в Docker (СУБД PostgreSQL)

`backend/`
Создайте `.env` файл из примера `.env.example`

`frontend/`
Создайте `.env` файл из примера `.env.example`

Установите зависимости в `FILM-REACT-NEST/backend/`, `FILM-REACT-NEST/frontend/`

`npm install`

Запускаем Docker-compose через команду:

`docker compose up -d --build`

Через PGAdmin (http://localhost:8080/) авторизуйтесь, используя (email, password из `.env`).
Создайте сервер и настройте его Connection (Host, Maintenance database, Username, Password из `.env ` по маршруту `FILM-REACT-NEST/backend/`).
После наполните базу данными из директории проекта:
`backend/test/prac.init.sql` — создаёт БД и таблицы;
`backend/test/prac.films.sql` — заполняет таблицу фильмами;
`backend/test/prac.shedules.sql` — заполняет таблицу расписанием сеансов.

Настроен удаленный сервер, прикреплено доменное имя https://romtomgreat.nomorepartiesco.ru

**_Проект выполнен в рамках практической работы учебного курса Яндекс.Практикум._**