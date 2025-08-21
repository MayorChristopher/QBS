# Deployment Guide

## Prerequisites
1. Supabase project set up with database tables
2. GitHub repository
3. Vercel account

## Database Setup
1. Run the SQL scripts in `/scripts/` folder in your Supabase SQL editor in order
2. Run `database-fix.sql` to fix foreign key relationships
3. Ensure RLS policies are enabled

## Environment Variables
Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deploy to Vercel
1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Post-Deployment
1. Test authentication flow
2. Create admin user by updating role in Supabase
3. Test simulation functionality