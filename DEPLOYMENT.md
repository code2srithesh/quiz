# QuizForge AI - Deployment Guide

Complete guide for deploying QuizForge AI to production environments.

## 🎯 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migration successful
- [ ] API keys for all third-party services
- [ ] SSL certificate ready
- [ ] DNS records prepared
- [ ] Domain registered
- [ ] Backup strategy planned
- [ ] Monitoring tools configured
- [ ] Error tracking setup
- [ ] Analytics configured

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

**Advantages**: Zero-config, automatic CI/CD, edge functions, fastest deployment

#### Steps:

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select project name
   - Click Import

3. **Configure Environment**
   - Go to Settings → Environment Variables
   - Add all variables from `.env.local`:
     ```
     DATABASE_URL
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
     CLERK_SECRET_KEY
     OPENAI_API_KEY
     NEXT_PUBLIC_APP_URL
     ```

4. **Configure Database**
   - External PostgreSQL (e.g., Railway, Render, AWS RDS)
   - Update `DATABASE_URL` with production instance

5. **Deploy**
   - Vercel automatically deploys on push to main
   - Monitor deployment in project dashboard

6. **Run Migrations**
```bash
# Via Vercel CLI
vercel env pull

# Or manually run
npm run db:push
```

---

### Option 2: Docker + Cloud Run (Google Cloud)

**Advantages**: Full control, scalability, cost-effective, container-native

#### Steps:

1. **Build Docker Image**
```bash
docker build -t quizforge-ai:latest .
```

2. **Test Locally**
```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="..." \
  -e OPENAI_API_KEY="..." \
  -e NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="..." \
  -e CLERK_SECRET_KEY="..." \
  quizforge-ai:latest
```

3. **Push to Container Registry**
```bash
# Google Cloud
gcloud auth configure-docker
docker tag quizforge-ai:latest gcr.io/PROJECT_ID/quizforge-ai:latest
docker push gcr.io/PROJECT_ID/quizforge-ai:latest

# Or Docker Hub
docker tag quizforge-ai:latest username/quizforge-ai:latest
docker login
docker push username/quizforge-ai:latest
```

4. **Deploy to Cloud Run**
```bash
gcloud run deploy quizforge-ai \
  --image gcr.io/PROJECT_ID/quizforge-ai:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL="...",OPENAI_API_KEY="..."
```

5. **Custom Domain**
```bash
gcloud run domain-mappings create \
  --service=quizforge-ai \
  --domain=yourdomain.com
```

---

### Option 3: Railway

**Advantages**: Git-based deployment, integrated PostgreSQL, simple setup

#### Steps:

1. **Connect GitHub**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Authorize and select repository

2. **Add PostgreSQL**
   - In project, click "Add Services"
   - Select "Provision PostgreSQL"
   - Database will be created automatically

3. **Configure Environment**
   - Go to Variables
   - Add all environment variables
   - `DATABASE_URL` can be linked to PostgreSQL service

4. **Deploy**
   - Railway auto-deploys on push to main
   - Monitor in dashboard

5. **Custom Domain**
   - Settings → Custom Domain
   - Add your domain
   - Update DNS records

---

### Option 4: Self-Hosted (VPS)

**Advantages**: Maximum control, cost-effective for scale, customizable

#### Steps:

1. **Provision Server**
   - Ubuntu 22.04 LTS recommended
   - Minimum: 2GB RAM, 2 vCPU, 20GB SSD
   - Static IP address
   - SSH access configured

2. **Install Dependencies**
```bash
sudo apt update && sudo apt upgrade
sudo apt install nodejs npm postgresql nginx

# Verify installations
node --version
npm --version
psql --version
```

3. **Clone Repository**
```bash
cd /var/www
sudo git clone <repo-url> quizforge-ai
sudo chown -R $USER:$USER quizforge-ai
cd quizforge-ai
```

4. **Setup Environment**
```bash
cp .env.example .env
nano .env  # Edit with your values
```

5. **Build Application**
```bash
npm install
npm run build
npm run db:push
```

6. **Setup PM2 (Process Manager)**
```bash
npm install -g pm2
pm2 start "npm start" --name quizforge
pm2 startup
pm2 save
```

7. **Configure Nginx Reverse Proxy**
```nginx
# /etc/nginx/sites-available/quizforge
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

8. **Enable Site**
```bash
sudo ln -s /etc/nginx/sites-available/quizforge /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

9. **SSL Certificate (Let's Encrypt)**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

10. **Auto-renewal**
```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

---

## 🗄️ Database Setup (Production)

### Option A: Managed PostgreSQL (Recommended)

#### Railway PostgreSQL
1. Automatic backups
2. One-click replica
3. Integrated monitoring
4. Built-in SSL

#### AWS RDS
1. Automatic backups (35-day retention)
2. Multi-AZ deployment
3. Enhanced monitoring
4. Automated failover

#### Google Cloud SQL
1. Automated backups
2. Geo-redundancy
3. Cloud SQL Auth
4. Performance insights

#### Render Database
1. One-click PostgreSQL
2. Automatic backups
3. Point-in-time restore
4. Replication

### Option B: Self-Hosted PostgreSQL

```bash
# Installation
sudo apt install postgresql postgresql-contrib

# Create user and database
sudo -u postgres psql
CREATE USER quizforge WITH PASSWORD 'secure_password';
CREATE DATABASE quizforge_prod OWNER quizforge;
ALTER ROLE quizforge SET client_encoding TO 'utf8';
GRANT ALL PRIVILEGES ON DATABASE quizforge_prod TO quizforge;
\q

# Backup configuration
pg_dump -U quizforge quizforge_prod > backup.sql
```

---

## 🔐 Security Hardening

### SSL/TLS Certificate
```bash
# Let's Encrypt (Free)
certbot certonly --standalone -d yourdomain.com

# Or use managed services
# AWS Certificate Manager
# GCP Managed Certificates
# Azure App Service Certificates
```

### Environment Variables Security
```bash
# Never commit .env to Git
echo ".env.local" >> .gitignore

# Use secrets management
# Vercel: Environment Variables dashboard
# Railway: Variables panel
# Cloud Run: Secret Manager
# Self-hosted: systemd user service environment
```

### Database Security
```bash
# Connection string with SSL
DATABASE_URL="postgresql://user:password@host:5432/db?sslmode=require"

# Firewall rules
# - Allow only app server IP
# - Restrict ports (5432)

# Regular backups
# - Automated backups
# - Test restoration
# - Off-site backups
```

### Application Security
```bash
# Headers
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000

# CORS
ALLOWED_ORIGINS=https://yourdomain.com

# Rate limiting
# Implement on reverse proxy or app level
```

---

## 📊 Monitoring & Observability

### Error Tracking
```typescript
// Sentry
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

// In API routes
try {
  // code
} catch (error) {
  Sentry.captureException(error);
}
```

### Performance Monitoring
```typescript
// New Relic
import newrelic from 'newrelic';

// Or Datadog
import { datadogRum } from '@datadog/browser-rum';
```

### Logging
```typescript
// Cloud Logging (Google Cloud)
// CloudWatch (AWS)
// Application Insights (Azure)

// Or self-hosted
// ELK Stack (Elasticsearch, Logstash, Kibana)
// Grafana Loki
```

### Uptime Monitoring
- UptimeRobot
- Pingdom
- AWS CloudWatch
- Datadog Synthetics

---

## 📈 Performance Tuning

### Database Optimization
```sql
-- Add indexes
CREATE INDEX idx_user_clerk_id ON users(clerkId);
CREATE INDEX idx_document_user_id ON documents(userId);
CREATE INDEX idx_quiz_user_id ON quizzes(userId);
CREATE INDEX idx_quiz_attempt_quiz_id ON quiz_attempts(quizId);

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM quizzes WHERE userId = $1;
```

### API Optimization
```typescript
// Enable compression
npm install compression

import compression from 'compression';
app.use(compression());
```

### CDN Configuration
```
// Serve static assets from CDN
- Cloudflare
- AWS CloudFront
- Google Cloud CDN
- Fastly

// Cache headers
Cache-Control: public, max-age=31536000, immutable
```

---

## 🔄 Continuous Deployment

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: npx vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

### GitLab CI/CD
```yaml
stages:
  - build
  - test
  - deploy

deploy:
  stage: deploy
  script:
    - npm run build
    - npm run db:push
    - pm2 restart quizforge
```

---

## 🆘 Backup & Recovery

### Database Backup Strategy
```bash
# Daily automated backups
0 2 * * * pg_dump -U quizforge quizforge_prod > /backups/daily_$(date +\%Y\%m\%d).sql

# Weekly full backup
0 3 * * 0 pg_basebackup -D /backups/weekly_$(date +\%Y\%m\%d) -Ft -z

# Monthly off-site backup
0 4 1 * * aws s3 cp /backups/weekly_$(date +\%Y\%m\%d).tar.gz s3://backups/
```

### Recovery Procedure
```bash
# From backup
createdb quizforge_prod_restore
psql quizforge_prod_restore < backup.sql

# Point-in-time recovery (PITR)
# Use pg_restore with specific timestamp
```

---

## 🎪 Load Testing

### Before Production
```bash
# Install k6
brew install k6

# Create test script
# load-test.js

import http from 'k6/http';
import { check } from 'k6';

export default function() {
  let response = http.get('https://yourdomain.com');
  check(response, {
    'status is 200': (r) => r.status === 200,
  });
}

# Run test
k6 run --vus 100 --duration 30s load-test.js
```

---

## ✅ Post-Deployment

1. **Verify**
   - [ ] Landing page loads
   - [ ] Login/signup works
   - [ ] PDF upload functional
   - [ ] Quiz generation works
   - [ ] Results display correctly
   - [ ] Analytics page loads
   - [ ] No console errors
   - [ ] Performance acceptable

2. **Monitor**
   - [ ] Error tracking active
   - [ ] Performance monitoring working
   - [ ] Uptime monitoring running
   - [ ] Alerts configured

3. **Document**
   - [ ] Deployment notes recorded
   - [ ] Access credentials secured
   - [ ] Emergency contacts listed
   - [ ] Runbook created

4. **Communicate**
   - [ ] Team notified
   - [ ] Status page updated
   - [ ] Users informed
   - [ ] Support team briefed

---

## 🚨 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Check connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL

# Verify firewall rules
# Restart service
```

**High Memory Usage**
```bash
# Check Node process
node --max-old-space-size=4096 ./node_modules/.bin/next start

# Review memory leaks
# Optimize queries
```

**Slow API Responses**
```bash
# Check database queries
# Analyze with EXPLAIN
# Add indexes
# Enable caching
```

**SSL Certificate Issues**
```bash
# Check certificate
openssl s_client -connect yourdomain.com:443

# Renew certificate
certbot renew --force-renewal
```

---

## 📞 Support & Resources

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Deployment**: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- **PostgreSQL**: [postgresql.org/docs](https://postgresql.org/docs)
- **Docker**: [docker.com/docs](https://docker.com/docs)
- **Nginx**: [nginx.org/en/docs](https://nginx.org/en/docs)

---

**Last Updated**: January 2024
