  <h3 align="center">Vibeboard - RGB Keyboard Lighting Sharing Platform</h3>

   <div align="center">
     A platform designed for creativity and inspiration, enabling users to design, share, and discover captivating RGB keyboard themes.
    </div>



https://www.loom.com/share/8086ac3357dc47e1b526894c506ca64f?sid=10cde085-1cf0-447d-a405-2f8dcb9fc8f4

## 👉 Get Started

Install dependencies for client and server repos

```
npm install
```

Create your `.env` file with values for each environment variable

```
# Client repo
VITE_BACKEND_API_URL_DEV=<LOCAL_API_URL>
VITE_BACKEND_API_URL=<PROD_API_URL>

VITE_FIREBASE_API_KEY=<FIREBASE_API_KEY>
VITE_FIREBASE_AUTH_DOMAIN=<FIREBASE_AUTH_DOMAIN>
VITE_FIREBASE_PROJECT_ID=<FIREBASE_PROJECT_ID>
VITE_FIREBASE_STORAGE_BUCKET=<FIREBASE_STORAGE_BUCKET>
VITE_FIREBASE_MESSAGING_SENDER_ID=<FIREBASE_MESSAGING_SENDER_ID>
VITE_FIREBASE_APP_ID=<FIREBASE_APP_ID>
VITE_FIREBASE_MEASUREMENT_ID=<FIREBASE_MEASUREMENT_ID>

# Server repo
PORT=<PORT_NUMBER>
DATABASE_URL<DATABASE_URL>
```

Run the development server

```
# Client repo
npm run start

# Server repo
npm run dev
```

When the above command completes you'll be able to view your website at `http://localhost:3000`

## 🥞 Stack

This project uses the following libraries and services:

- FE Framework - [React + Vite](https://vitejs.dev/) with React Router
- BE Frameword - [Node + Express](https://expressjs.com/)
- UI Kit - [Tailwind](https://tailwindcss.com)
- Authentication - [Firebase](https://firebase.google.com/docs/auth)
- Database - [Postgres](https://www.postgresql.org/)

