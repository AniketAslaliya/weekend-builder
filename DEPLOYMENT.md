# 🚀 Deployment Guide - Weekend Builder

This guide will help you deploy your Weekend Builder project to a public URL for review and judging.

## 📋 Pre-Deployment Checklist

### ✅ Code Quality
- [x] All TypeScript errors fixed
- [x] Build passes successfully (`npm run build`)
- [x] "Built with Bolt.new" badge added to footer
- [x] All project submission features working
- [x] README updated and concise

### ✅ Environment Setup
- [x] `.env` file created with Supabase credentials
- [x] Supabase database migrations run
- [x] Database tables created (profiles, projects, events, etc.)

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**
   - In Vercel dashboard, go to Project Settings → Environment Variables
   - Add the following:
     ```
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your site will be available at `https://your-project.vercel.app`

### Option 2: Netlify

1. **Push to GitHub** (same as above)

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/Login with GitHub
   - Click "New site from Git"
   - Choose your repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Add Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add the same variables as above

5. **Deploy**
   - Click "Deploy site"
   - Your site will be available at `https://your-site.netlify.app`

## 🔧 Post-Deployment Setup

### 1. Update Supabase Settings
- Go to your Supabase dashboard → Authentication → Settings
- Add your deployment URL to "Site URL"
- Add redirect URLs for authentication:
  ```
  https://your-domain.com/auth
  https://your-domain.com/auth/callback
  ```

### 2. Test All Features
- [ ] Sign up/Sign in works
- [ ] Project submission modal opens
- [ ] Can navigate through all steps
- [ ] Project submission completes successfully
- [ ] Projects appear in the gallery
- [ ] "Built with Bolt.new" badge is visible
- [ ] All pages load without errors

### 3. Performance Check
- [ ] Page load times are reasonable
- [ ] Images load properly
- [ ] No console errors
- [ ] Mobile responsiveness works

## 🐛 Troubleshooting

### Common Issues

**1. Environment Variables Not Loading**
- Ensure variables are set in deployment platform
- Check variable names match exactly
- Redeploy after adding variables

**2. Supabase Connection Issues**
- Verify URL and key are correct
- Check Supabase project is active
- Ensure RLS policies are configured

**3. Build Failures**
- Check for TypeScript errors locally first
- Ensure all dependencies are in package.json
- Check Node.js version compatibility

**4. Authentication Not Working**
- Update Supabase site URL
- Add redirect URLs
- Check browser console for errors

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify Supabase configuration
3. Test locally first with `npm run dev`
4. Check deployment platform logs

## 🎯 Final Submission Checklist

Before submitting your URL for review:

- [ ] **Public URL is accessible**
- [ ] **"Built with Bolt.new" badge visible**
- [ ] **Authentication works (sign up/sign in)**
- [ ] **Project submission works end-to-end**
- [ ] **All pages load without errors**
- [ ] **Mobile responsive design**
- [ ] **No console errors**
- [ ] **README is updated and clear**

## 🏆 Ready for Judging!

Once all checks pass, your project is ready for review and judging. The public URL should demonstrate all the required functionality including the "Built with Bolt.new" badge prominently displayed.

---

**Good luck with your submission! 🚀** 