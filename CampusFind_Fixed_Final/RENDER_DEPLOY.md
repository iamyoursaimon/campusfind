# Deploy CampusFind on Render with MongoDB Atlas

## GitHub

Create a GitHub repository and upload the contents of `CampusFind_Fixed_Final`. Do not upload `backend/.env` when it contains a real password.

## Render Web Service

Use **New + -> Blueprint** and select the GitHub repository. Render reads `render.yaml`.

For a manual Web Service use:

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/api/health`

## Environment variables

Add this in the Render service Environment tab:

```text
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/campusfind?retryWrites=true&w=majority
```

The Atlas password must be URL encoded. In MongoDB Atlas Network Access, allow `0.0.0.0/0` because Render uses dynamic outbound IPs. Use a database user with only the required database permissions.

`FRONTEND_ORIGIN` is optional when Render serves the frontend from this same service. Set it only when the frontend is hosted on a separate domain.

## Verify

Open these after deployment:

- `https://YOUR-SERVICE.onrender.com/api/health`
- `https://YOUR-SERVICE.onrender.com/api/status`
- `https://YOUR-SERVICE.onrender.com`

The health response must contain `"mongo": true`. Then create a test report and refresh the page to confirm MongoDB persistence.
