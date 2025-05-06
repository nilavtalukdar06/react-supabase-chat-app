# React Supabase Chat App

A real-time chat application built with React, Vite, Supabase, and Tailwind CSS. Users can authenticate with Google and chat instantly in a shared room, leveraging Supabase's real-time features.

## Features

- 🔒 Google OAuth authentication (via Supabase)
- 💬 Real-time group chat (Supabase Realtime Channels)
- 🎨 Modern UI with Tailwind CSS and shadcn/ui components
- ⚡ Fast development with Vite
- 🧑‍💻 React 19, hooks-based architecture <!-- Replace with actual screenshot if available -->

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Supabase project (free tier is sufficient)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/react-supabase-chat-app.git
cd react-supabase-chat-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory and add your Supabase credentials:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

You can find these in your [Supabase project settings](https://app.supabase.com/).

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## Project Structure

- `src/App.jsx` – Handles authentication and main app logic
- `src/Chat.jsx` – Real-time chat UI and logic
- `src/supabase/supabase.js` – Supabase client setup
- `src/components/ui/` – Reusable UI components (Button, Input, Avatar)
- `src/lib/utils.js` – Utility functions
- `src/index.css` – Tailwind CSS and custom styles

## Customization

- Update the chat room name in `src/Chat.jsx` if you want multiple rooms.
- Style the UI further using Tailwind or shadcn/ui components.

## Deployment

To build for production:

```bash
npm run build
```

Then deploy the `dist` folder to your preferred static hosting (Vercel, Netlify, etc).

## License

MIT
