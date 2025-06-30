# Weekend Builder

A platform for weekend hackathons and building festivals where creators can participate in themed events, build amazing projects, and win prizes.

## Features

- 🎯 **Weekend Events** - Themed hackathons every weekend
- 🚀 **Project Showcase** - Share and discover amazing projects
- 🤖 **AI Builder** - AI-powered project generation tools
- 🏆 **Leaderboards** - Compete with builders worldwide
- 👥 **Community** - Connect with fellow creators
- 🎨 **Beautiful UI** - Modern, responsive design

## Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd weekend-builder
npm install
```

### 2. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In your Supabase dashboard, go to Settings > API
3. Copy your Project URL and anon/public key
4. Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup

1. In your Supabase dashboard, go to SQL Editor
2. Run the migration files from `supabase/migrations/` in order:
   - `20250629054723_cool_reef.sql` (Core schema)
   - `20250629175203_calm_poetry.sql` (Events system)
   - `20250629181036_winter_bar.sql` (Profiles)

### 4. Authentication Setup

1. In Supabase dashboard, go to Authentication > Settings
2. Configure your site URL (for local development: `http://localhost:5173`)
3. Enable the authentication providers you want to use:
   - Email/Password (enabled by default)
   - Google OAuth (optional)
   - GitHub OAuth (optional)

For social authentication:
1. Go to Authentication > Settings > Auth Providers
2. Enable and configure Google/GitHub with your OAuth credentials

### 5. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Deployment

### Netlify Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to Netlify:
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variables in Netlify dashboard:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

3. Update Supabase settings:
   - Add your Netlify domain to Site URL in Supabase Auth settings
   - Add redirect URLs for social authentication

## Environment Variables

Required environment variables:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Framer Motion
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **State Management**: React Query
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Navbar, Footer)
│   └── ui/             # Base UI components (Button, Card, etc.)
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
├── pages/              # Page components
└── types/              # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

If you encounter any issues:

1. Check that your Supabase configuration is correct
2. Ensure all environment variables are set
3. Verify your database migrations have run successfully
4. Check the browser console for any errors

For additional help, please open an issue in the repository.