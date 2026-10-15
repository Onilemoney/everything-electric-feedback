# Everything Electric — Panel Building Workshop Evaluation

A static, mobile-friendly, anonymous feedback portal with six rating categories, six optional category-specific comments, and two overall comment fields. Uses actual workshop photographs. The site does not request names, emails, employee IDs, or browser geolocation. No third-party analytics are included.

## Free-tier architecture

- Cloudflare Pages (Git integration) hosts the website and runs the `functions/api/feedback.js` server endpoint on its free tier, subject to Cloudflare's limits and terms.
- Google Sheets stores responses; Google Apps Script receives and validates them. Free Google quotas apply.
- A free `*.pages.dev` address is provided, subject to availability.

## 1. Create the spreadsheet

1. In your Google account, create a new spreadsheet named `Everything Electric - Panel Building Workshop Feedback`.
2. Open **Extensions > Apps Script**. Replace the sample code with `google-apps-script/Code.gs` from this package and save.
3. Choose **Deploy > New deployment > Web app**. Set **Execute as: Me** and **Who has access: Anyone**. Authorise the script and copy the deployed `/exec` URL. This URL is a server endpoint; do not publish it in your HTML.
4. The `Anonymous Feedback` worksheet is automatically created on the first successful submission.

## 2. Publish on Cloudflare Pages

1. Create or sign in to a free Cloudflare account and a GitHub account.
2. Upload this package's contents to a **private or public GitHub repository** (excluding the `google-apps-script` folder if you prefer). The root should contain `index.html`, `assets/`, and `functions/`.
3. In Cloudflare: **Workers & Pages > Create > Pages > Connect to Git**; select your repository.
4. Framework preset: **None**. Build command: **leave blank**. Output directory: **/** (repository root; if Cloudflare requires a directory, use `.`). Save and deploy.
5. In your Pages project, open **Settings > Variables and Secrets** and create `GOOGLE_SCRIPT_URL` with the Apps Script `/exec` URL from step 1. Use an encrypted secret if the interface offers it. Apply to **Production** (and Preview if needed), then **redeploy**.
6. Visit your `*.pages.dev` URL. Fill in all six ratings, submit, and verify that a new row appears in your private spreadsheet. Test mobile and desktop.

Cloudflare changes its dashboard occasionally; look for equivalent Pages Git-deployment and environment-variable options. Do not use a static-only drag-and-drop deployment: the `/api/feedback` function needs to be deployed too.

## Ratings

1. Workshop Setup & Organisation
2. Health, Safety & Housekeeping
3. Equipment & Tools
4. Personnel Professionalism
5. Personnel Technical Competence
6. Workmanship & Finishing Quality

Each accepts 1 (Poor) through 5 (Excellent), or Not observed. Six individual observation boxes and two overall comment boxes are optional.

## Privacy and operational notes

- Google Sheets stores a timestamp plus responses, not names, email addresses or employee IDs. A timestamp can still correlate with a person in small groups. Google/Cloudflare may process normal technical request logs; this is not a guarantee of absolute anonymity.
- Limit Google Sheet access to authorised management. Do not include respondent identifiers in comments.
- For a high-traffic or public-facing deployment, add Cloudflare Turnstile and rate limiting. The current honeypot is only basic bot protection.
- Google Apps Script 'Anyone' deployment makes the endpoint callable by anyone with the URL. The script validates fields, but stronger authentication/anti-spam may be needed. Avoid exposing the script URL publicly.
- Before public launch, confirm the organisation approves the photographs and the exact form wording.
- The form will display an error if the spreadsheet connection is not configured or saving fails; it will never claim success before the backend confirms a successful write.
