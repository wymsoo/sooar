# SOOAR

SOOAR is a sports consultation website for student athletes. It combines static marketing and account pages with an Express application for match-video submissions, technical reports, online payments, face-to-face consultation booking, instructor workflows, email notifications, and an AI chat assistant.

## What It Does

- Presents SOOAR services and coach information through static HTML and EJS pages.
- Registers students and instructors and maintains session-based login state.
- Lets students select a technical-report product, choose an instructor, upload match footage, and follow a staged report.
- Lets instructors review orders, write or save report stages, upload commentary videos, and manage consultation availability.
- Supports face-to-face consultation quotas, meeting requests, confirmations, and student meeting views.
- Creates embedded Stripe Checkout sessions and stores wallet and purchase state.
- Uses DeepSeek for the `/deepseek/askDeepSeek` chat endpoint.
- Uses Gmail OAuth2 and Nodemailer for instructor purchase notifications.

## Technology

- Node.js and Express 5
- EJS server-rendered views
- Static HTML, CSS, and browser JavaScript
- Multer for video uploads
- Stripe Checkout for payments
- Google Gmail API and Nodemailer for email
- DeepSeek API for chat
- JSON files for application persistence
- Google App Engine Flexible for deployment

## Repository Layout

| Path | Purpose |
| --- | --- |
| `app.js` | Express entrypoint, middleware, views, static files, and route mounting |
| `routes/` | Authentication, student, instructor, purchase, checkout, mail, display, and AI endpoints |
| `controllers/` | Email and secret-management related controllers |
| `views/` | EJS pages for purchases, reports, videos, meetings, wallet, and checkout |
| `public/` | Static HTML, CSS, JavaScript, and images |
| `aichat/` | DeepSeek client code |
| `middlewares/uploadVid.js` | Multer video upload configuration |
| `users.json` | User profiles, roles, purchases, wallets, and meeting data |
| `allPurchase.json` | Instructor-side order records |
| `meetingRequests.json` | Meeting request records |
| `catalog.json` | Product names, prices, currencies, and product types |
| `uploads/` | Local uploaded match and commentary videos; ignored by Git |
| `app.yaml` | Google App Engine Flexible runtime configuration |
| `cloudbuild.yaml` | Cloud Build deployment command |

## Local Setup

### Requirements

- Node.js 22 or a compatible current Node.js release
- npm
- Credentials for the services used by the feature set you want to run

### Install and configure

```sh
npm install
cp .env.example .env
```

Fill `.env` with the Gmail, DeepSeek, Stripe, Google browser, and session values required by your environment. `.env` is ignored by Git. Never commit credential JSON files or API keys.

Start the server:

```sh
npm start
```

The server listens on `PORT` from `.env`, or `8080` when it is not set. Open `http://localhost:8080/`; the root route redirects to `/display/home`.

## Main Workflows

### Student

1. Register or log in through the authentication pages.
2. Browse technical-report or career-consultation services.
3. Create a purchase, select an instructor, and upload match video sets.
4. Pay through embedded Stripe Checkout or use the wallet flow.
5. View staged report content and instructor commentary videos.
6. Book and review face-to-face consultation meetings.

### Instructor

1. Register as an instructor and configure available meeting times.
2. Review incoming orders and the submitted student footage.
3. Save or complete the three report stages.
4. Upload commentary video and update its status.
5. Review, confirm, and resolve student meeting requests.

### Integrations

- `POST /deepseek/askDeepSeek` sends a question to DeepSeek.
- The mail routes use Gmail OAuth2 to retrieve mail metadata and send purchase notifications.
- Checkout routes create and inspect Stripe sessions. The current implementation does not use a Stripe webhook; payment state is updated through application routes.
- `/runtime-config.js` supplies only browser-safe Google configuration to the legacy Gmail quickstart page. Server secrets remain in `process.env`.

## Configuration

The supported environment variables are documented in `.env.example`:

- `PORT` and `SESSION_SECRET`
- `CLIENT_ID`, `CLIENT_SECRET`, `REDIRECT_URI`, and `REFRESH_TOKEN`
- `DEEPSEEK_KEY`
- `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY`
- `GOOGLE_CLIENT_ID` and `GOOGLE_API_KEY`

The existing local `.env` contains credentials that have previously appeared in source or repository files. Rotate those credentials before using this project in a shared or production environment, especially the Google OAuth values, DeepSeek keys, Stripe keys, and session secret.

## Deployment

`app.yaml` targets Google App Engine Flexible with Node.js 22 and one manually scaled instance. `cloudbuild.yaml` deploys with:

```sh
gcloud app deploy --quiet
```

Provide environment values through the deployment environment or a managed secret store. Do not upload `.env` to source control. The current app writes JSON data and videos to local disk, so production deployment needs durable shared storage and a database before scaling beyond a single instance.

## Data and Security Notes

This repository is a prototype-style file-backed application. Before production use, address the following:

- User passwords are stored in JSON and the current login route does not validate the submitted password.
- Many routes need authentication, role, ownership, and purchase authorization checks.
- JSON read/write persistence is vulnerable to concurrent writes and is not suitable for multiple instances.
- Uploaded files need durable storage, file-type validation, size limits, and authorization on playback routes.
- Stripe payment completion should be verified by a signed webhook rather than a client-triggered status update.
- Sessions use the default in-memory store; use a secure session store and production cookie settings.
- The application should use a centralized error handler, input validation, rate limiting, and audit logging.

The npm test script is currently a placeholder and does not run automated tests.
