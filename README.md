# Nexus Office AI V5 — Cloudflare Pages (Free-first)

V5 refresh: expanded office footprint, stacked floors and production annex, vivid high-contrast industrial palette (navy, electric blue, orange, neon lime, magenta), agent selection/floor filters, activity log, task movement, AI meeting endpoint, connection test, clear/copy output.

## Project files
- `index.html` — Three.js frontend; no secret keys in the file.
- `functions/api/meeting.js` — Cloudflare Pages Function at `/api/meeting` that calls Gemini.

## Deploy from an Android phone
1. Extract this ZIP. Upload the **contents inside `nexus-cloudflare`** to a GitHub repository. `index.html` must be at repository root and `functions/api/meeting.js` must keep its path.
2. In Cloudflare Dashboard, choose **Workers & Pages → Create → Pages → Connect to Git** and select that repository.
3. Choose no framework. For a static site, leave the build command empty if allowed. Set the build output directory to `.` (repository root) if requested. Keep `functions/` at the root so Pages detects the function.
4. Deploy. In the Pages project, open **Settings → Variables and Secrets** (wording can vary) and add `GEMINI_API_KEY` as a **Secret**. Paste the Gemini API key as the secret value. Do not add the key to GitHub or HTML.
5. Redeploy if prompted, open the `*.pages.dev` address, tap **Tes koneksi AI**, then enter a task and tap **Jalankan tim**.

## Troubleshooting
- `Backend OFFLINE` or 404: confirm `functions/api/meeting.js` exists in the deployed repository at that exact path, then redeploy.
- `GEMINI_API_KEY belum diatur`: add the variable as a Secret in the Pages project settings and redeploy.
- Gemini quota/model errors: check Google AI Studio's current model access and quota. Free access is not unlimited or guaranteed for every account/model.
- If any screen requests a paid upgrade or payment method, stop rather than confirming a paid plan. Availability and onboarding requirements can vary by account.

## Safety
Never commit API keys. If a key is accidentally published, revoke it and create a new one.
