# Paylaşım Planı

Bu layihə Cloudflare Pages-də yerləşdirmək üçün hazırlanıb.

## Cloudflare Pages-də yerləşdirmə addımları

### 1. GitHub-a yüklə
Bu qovluğu yeni bir GitHub reposuna yüklə (GitHub Desktop və ya `git` ilə):

```bash
git init
git add .
git commit -m "ilk versiya"
git branch -M main
git remote add origin https://github.com/SENIN-ISTIFADECI-ADIN/paylasim-plani.git
git push -u origin main
```

### 2. Cloudflare Pages-də layihə yarat
1. Cloudflare Dashboard → **Workers & Pages** → **Create application** → **Pages** tabı
2. **Connect to Git** seç, GitHub reposunu seç
3. Build tənzimləmələri:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. **Save and Deploy** düyməsinə bas

Bir neçə dəqiqə sonra `https://paylasim-plani.pages.dev` (və ya seçdiyin ad) ünvanında sayt aktiv olacaq.

### 3. Worker ilə əlaqə
`src/App.jsx` faylındaki `WORKER_URL` dəyişəni artıq sənin Cloudflare Worker-ə (`cold-meadow-6bb3.rashadhuseyn1993.workers.dev`) işarə edir. Pages saytı artıq claude.ai sandbox-unda olmadığı üçün, brauzerin Content-Security-Policy məhdudiyyəti olmayacaq və Worker-ə fetch sorğuları normal işləyəcək.

### Qeyd
Worker-də `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY` secret-lərinin doğru təyin olunduğunu yoxla (Cloudflare Dashboard → Worker → Settings → Variables and Secrets).

## Lokal işlətmək (development)

.

```bash
npm install
npm run dev
```
