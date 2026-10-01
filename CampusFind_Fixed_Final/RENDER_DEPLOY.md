# Deploy CampusFind on Render with MongoDB Atlas

## GitHub

The project is in the `CampusFind_Fixed_Final` folder of the GitHub repository. Connect that repository to the new Render account. Do not upload `backend/.env` when it contains a real password.

## Render Web Service

Use **New + -> Blueprint**, select the GitHub repository, and set the Blueprint file path to `CampusFind_Fixed_Final/render.yaml`.

For a manual Web Service use:

- Root Directory: `CampusFind_Fixed_Final`
- Build Command: `cd backend && npm install`
- Start Command: `cd backend && npm start`
- Health Check Path: `/api/health`

## Environment variables

The local `backend/.env` file is ignored by Git and is not uploaded to Render. Add the variables below in the Render service's **Environment** tab instead. `MONGODB_URI` is required:

```text
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/campusfind?retryWrites=true&w=majority
MONGODB_DB=campusfind
```

Keep the Atlas URI private. Its password must be URL encoded. In MongoDB Atlas Network Access, allow `0.0.0.0/0` because Render uses dynamic outbound IPs. Use a database user with only the required database permissions.

Email notifications are optional. To enable them, also set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and optionally `MAIL_FROM` in Render. Never commit real values for these variables.

`CLIENT_ORIGIN` is optional when Render serves the frontend from this same service. If the frontend is hosted on a separate domain, set it to that exact origin. `FRONTEND_ORIGIN` is also accepted for compatibility.

Save the environment changes in Render and redeploy the service.

## Verify

Open these after deployment:

- `https://YOUR-SERVICE.onrender.com/api/health`
- `https://YOUR-SERVICE.onrender.com/api/status`
- `https://YOUR-SERVICE.onrender.com`

The health response must contain `"mongo": true`. Then create a test report and refresh the page to confirm MongoDB persistence.
