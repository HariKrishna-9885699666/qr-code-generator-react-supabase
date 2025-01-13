# qr-code-generator-react-supabase

A system for managing users with QR codes, built with React, Supabase, and Vite.

## Features

- User management with QR code generation
- Search and filter users
- Bulk user addition
- User detail view with QR code scan tracking

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account

## Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/your-username/qr-code-generator-react-supabase.git
cd qr-code-generator-react-supabase
```

### 2. Install dependencies

Using npm:

```sh
npm install
```

Or using yarn:

```sh
yarn install
```

### 3. Set up Supabase

#### Initialize Supabase

```sh
supabase init
```

#### Start Supabase

```sh
supabase start
```

#### Create a new migration

```sh
supabase migration new migration_name
```

#### Log in to Supabase

```sh
supabase login
```

#### Link your project to Supabase

```sh
supabase link
```

#### Push the database schema

```sh
supabase db push
```

### 4. Configure environment variables

Create a `.env` file in the root directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 5. Run the development server

Using npm:

```sh
npm run dev
```

Or using yarn:

```sh
yarn dev
```

Open your browser and navigate to `http://localhost:3000`.

## Building for Production

Using npm:

```sh
npm run build
```

Or using yarn:

```sh
yarn build
```

## Deployment

Follow the deployment instructions for your chosen hosting provider.

## License

This project is licensed under the MIT License.
