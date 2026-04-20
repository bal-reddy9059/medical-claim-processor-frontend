# Stitch Multi-Agent Claim Processing Pipeline

A React frontend for a medical claim processing workflow. This app interfaces with a backend API to upload PDF claims, run LangGraph-based claim extraction, review results, manage pipeline status, and update system settings.

## Features

- Upload insurance claim PDFs and initialize processing
- Review extracted claim fields and manually update results
- Approve claims and export processed claims as PDF
- Monitor pipeline execution status and logs
- View dashboard summary metrics
- Configure system settings via the backend API
- Check API health and workflow metadata

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- React Router

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create or update `.env` with the backend API base URL:
   ```bash
   VITE_API_BASE_URL=http://127.0.0.1:8000
   ```

3. Start the frontend server:
   ```bash
   npm run dev
   ```

4. Open the application in your browser at the port shown by Vite.

## Deployment to Vercel

### Frontend Deployment
1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Deploy the project:
   ```bash
   vercel
   ```

   Follow the prompts to link your Vercel account, select the project, and deploy.

### Backend Deployment
Deploy your FastAPI backend (claim-processing-langgraph) to Vercel:
1. Go to your backend repo: https://github.com/bal-reddy9059/claim-processing-langgraph.git
2. Connect to Vercel and deploy as a Python project.
3. Note the backend URL (e.g., https://claim-processing-langgraph.vercel.app)

### Connecting Frontend and Backend

1. **Get Your Backend URL**
   Go to your claim-processing-langgraph Vercel project → click Visit to get the URL (e.g., https://claim-processing-langgraph.vercel.app)

2. **Add Environment Variable in Frontend**
   Go to your frontend project on Vercel → Settings → Environment Variables
   Add:
   - Name: `VITE_API_BASE_URL`
   - Value: `https://claim-processing-langgraph.vercel.app` (your backend URL)

3. **Fix CORS in Your Backend**
   In your FastAPI backend, add CORS middleware:
   ```python
   from fastapi.middleware.cors import CORSMiddleware

   app.add_middleware(
       CORSMiddleware,
       allow_origins=[
           "https://stitchmultiagentclaimprocessingpipeline-7w3imtmse.vercel.app",  # deployed frontend
           "http://localhost:3000"  # for local dev
       ],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

4. **Redeploy Frontend**
   After adding the env variable, push a new commit or redeploy from Vercel dashboard.

5. **Test the Connection**
   Open browser DevTools → Network tab → trigger an action in your frontend and verify API calls are hitting your backend URL.

**Quick checklist:**
- ✅ Backend URL copied from Vercel
- ✅ VITE_API_BASE_URL set in frontend env vars
- ✅ CORS configured in backend with frontend domain
- ✅ Frontend redeployed
- ✅ API calls working in browser network tab

## Available Scripts

- `npm run dev` — start the local development server
- `npm run build` — build the production bundle
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint checks

## API Endpoints Used

The frontend integrates with the following backend endpoints:

- `GET /health`
- `GET /api/workflow-info`
- `POST /api/process?claim_id=...` (upload claim PDF)
- `GET /api/claims/summary`
- `GET /api/claims/{claimId}`
- `GET /api/claims/{claimId}/extraction-results`
- `PUT /api/claims/{claimId}/extraction-results`
- `GET /api/claims/{claimId}/document-breakdown`
- `GET /api/claims/{claimId}/history`
- `GET /api/dashboard/metrics`
- `POST /api/claims/{claimId}/approve`
- `POST /api/claims/{claimId}/export`
- `GET /api/pipeline/status/{claimId}`
- `GET /api/pipeline/logs/{claimId}`
- `POST /api/pipeline/pause/{claimId}`
- `POST /api/pipeline/restart/{claimId}`
- `GET /api/settings/configuration`
- `PUT /api/settings/configuration`

## Project Structure

- `src/App.jsx` — routes and page layout
- `src/api/claimApi.js` — backend API wrappers
- `src/components/ClaimDashboard.jsx` — claim upload and summary
- `src/components/ReviewExtractionResults.jsx` — review and edit extraction results
- `src/components/ClaimPrecisionMedicalBillingPipeline.jsx` — pipeline status and controls
- `src/components/AIPipelineStatus.jsx` — API health and workflow metadata
- `src/components/PipelineSettings.jsx` — settings management

## Notes

- The frontend is configured to proxy API requests via Vite to the backend base URL.
- Ensure the backend is running and reachable at `VITE_API_BASE_URL` before using the app.
