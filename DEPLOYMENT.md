## Deployment to Vercel

1. Push your code to GitHub:
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main

2. Import project in Vercel:
   - Go to vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variable:
     DATABASE_URL: "your_vercel_postgres_url"

3. Configure Prisma for production:
   - In package.json scripts:
     "vercel-build": "prisma generate"
   - Vercel will automatically run this during build

4. Your API will be available at:
   https://your-project.vercel.app/api/health
