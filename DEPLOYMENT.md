# Deployment Guide

Deploy your Autonomous Vehicle RL Dashboard to the cloud in minutes.

## Option 1: Railway.app (Recommended) ⭐

Railway.app is the easiest way to deploy Node.js + React apps. Free tier available.

### Quick Deploy Button

Click this button to deploy directly to Railway:

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new?templateId=lJJxBk)

OR follow these steps:

### Step-by-Step Deployment

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub (recommended)
   - Authorize Railway to access your GitHub account

2. **Deploy the Project**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Initialize railway in your project
   cd /home/harsh/project-1
   railway init
   ```

3. **Configure Environment**
   - Railway will detect your Node.js project
   - Set `PORT` environment variable if needed
   - Database not needed (we use state.json)

4. **Deploy**
   ```bash
   railway up
   ```

5. **Access Your Dashboard**
   - Railway will give you a live URL
   - Your dashboard is now accessible worldwide!
   - Simulator must run locally to generate state.json

### Important Note for Railway

⚠️ **The C++ simulator must run locally** because:
- It generates state.json which the backend reads
- The simulator needs a display/graphics hardware
- You can run it on your local machine while dashboard runs on Railway

**Setup:**
```bash
# Terminal 1: Run locally
cd /home/harsh/project-1/autonomus/autonomous-rl-vehicle/simulator
./build/AutonomousVehicleSimulator

# Terminal 2: Push state.json to Railway (optional)
# Or keep simulator running locally and dashboard on Railway
```

---

## Option 2: GitHub Pages + Cloud Backend

Deploy React frontend on GitHub Pages + Node.js on Railway/Heroku.

### Step 1: Deploy Frontend to GitHub Pages

```bash
cd /home/harsh/project-1/rl-dashboard-nextgen/client

# Add GitHub Pages configuration to package.json
npm install --save-dev gh-pages
```

Edit `package.json` and add:
```json
{
  "homepage": "https://hhnaidu.github.io/autonomous-vehicle-rl-training",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

Then deploy:
```bash
npm run deploy
```

Your frontend is now at: `https://hhnaidu.github.io/autonomous-vehicle-rl-training`

### Step 2: Deploy Backend to Railway/Heroku

Same as Option 1, but update `App.js` to point to cloud backend.

---

## Option 3: Heroku (Free Tier Limited)

**Note**: Heroku removed free tier. Use Railway or DigitalOcean instead.

---

## Option 4: DigitalOcean (Affordable)

For persistent hosting with more control:

1. Create DigitalOcean account: https://www.digitalocean.com
2. Create App Platform project
3. Connect GitHub repository
4. Set build command: `npm install`
5. Set start command: `node server.js`
6. Deploy!

Cost: ~$5-12/month

---

## Option 5: Self-Hosted (Your Own Server)

If you have a server or cloud VM:

```bash
# SSH into your server
ssh user@your-server.com

# Clone repository
git clone https://github.com/hhnaidu/autonomous-vehicle-rl-training.git
cd autonomous-vehicle-rl-training/rl-dashboard-nextgen

# Install dependencies
npm install

# Run with PM2 (process manager)
npm install -g pm2
pm2 start server.js --name "rl-dashboard"
pm2 save
pm2 startup

# Simulator must run locally on your machine
```

---

## Comparison Table

| Platform | Cost | Difficulty | Best For |
|----------|------|------------|----------|
| **Railway** | Free tier | ⭐ Easy | Frontend + Backend together |
| **GitHub Pages** | Free | ⭐ Easy | Frontend only |
| **Heroku** | $7+/month | ⭐⭐ Moderate | Backend only |
| **DigitalOcean** | $5+/month | ⭐⭐ Moderate | Full app |
| **AWS** | Variable | ⭐⭐⭐ Complex | Enterprise |
| **Self-Hosted** | Your cost | ⭐⭐⭐ Complex | Full control |

---

## Deployment Checklist

- [ ] Create account on your chosen platform
- [ ] Connect GitHub repository
- [ ] Set environment variables if needed
- [ ] Configure start command: `node server.js`
- [ ] Set PORT to 3000 (or platform default)
- [ ] Deploy and get live URL
- [ ] Test WebSocket connection (F12 → Console)
- [ ] Run simulator locally to generate state.json
- [ ] Share your live dashboard URL!

---

## Monitoring & Debugging

### Check Logs
**Railway:**
```bash
railway logs
```

**Heroku:**
```bash
heroku logs --tail
```

**Self-hosted:**
```bash
pm2 logs
```

### Common Issues

**Dashboard shows "Disconnected"**
- Verify simulator is running locally
- Check state.json exists and is being updated
- Check WebSocket connection in browser console (F12)

**Port already in use**
- Railway/Heroku automatically assign a port
- Check environment variable `PORT`

**Large file sizes**
- Simulator binary (40MB) is normal
- PortableGit folder can be removed before deploy if space is an issue

---

## Environment Variables

If deploying, you might want to set:

```bash
PORT=3000                          # Default port
NODE_ENV=production                # Production mode
STATE_JSON_PATH=./state.json      # Path to state.json
POLLING_INTERVAL=1000             # milliseconds
```

---

## After Deployment

1. **Share your live URL**
   - Send to team members
   - Include in GitHub README
   - Use in portfolio

2. **Update DNS (Optional)**
   - Point custom domain to your deployed app
   - Most platforms support custom domains

3. **Enable HTTPS**
   - All platforms provide free HTTPS
   - WebSocket works with `wss://` protocol

4. **Monitor Performance**
   - Check logs regularly
   - Monitor uptime
   - Check WebSocket connection stats

---

## Cost Summary

- **Railway Free Tier**: $0/month ✅ **RECOMMENDED**
- **GitHub Pages**: $0/month (frontend only)
- **DigitalOcean**: $5/month
- **Heroku**: $7+/month (if available)
- **AWS**: Variable ($1-50+/month)

---

## Need Help?

- Railway Docs: https://docs.railway.app
- Heroku Docs: https://devcenter.heroku.com
- DigitalOcean Docs: https://docs.digitalocean.com
- GitHub Pages: https://pages.github.com

---

**Next Step**: Choose a platform above and deploy! 🚀
