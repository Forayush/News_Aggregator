# Real-Time News Aggregator & Sentiment Analysis Platform

## Folder Structure
- `backend/`: Node.js, Express, Mongoose
- `frontend/`: React
- `nlp-service/`: FastAPI Python microservice

## Setup Instructions

### Backend (Node.js/Express/MongoDB)
1. Navigate to /backend
2. `npm init -y` and `npm install express mongoose cors dotenv`
3. Set your `MONGODB_URI` environment variable pointing to your MongoDB Atlas cluster.
4. Run server: `node server.js`

### NLP Service (Python/FastAPI)
1. Navigate to /nlp-service
2. `pip install fastapi uvicorn textblob pydantic`
3. Run microservice: `python app.py`
*(The backend can send HTTP requests to \`http://localhost:8000/analyze\` when ingesting a new article)*

### Frontend (React / Next.js)
1. Navigate to `/frontend`
2. Run `npm install` to install Next.js, React, and Axios dependencies.
3. Start the development server: `npm run dev`
4. Access the frontend at `http://localhost:3000`

## Integration Plan
- Use a Cron job or Bull queues in Node to periodically scrape sites / read RSS.
- For every new article text, the Node service sends a POST to the FastAPI `/analyze` route.
- Combine the returned sentiment with the article data, and use Mongoose to `save()` or perform an atomic `updateOne` with `upsert: true` ensuring `url` is unique.

## Deployment Guide
1. **MongoDB**: Use MongoDB Atlas (M0 sandbox or an M10 dedicated cluster for production).
2. **Backend Express API**: Deploy on Render, Railway, or Heroku. Ensure you configure IP whitelisting in MongoDB Atlas.
3. **NLP Service**: Deploy on Render or a lightweight AWS EC2 instance.
4. **Frontend**: Deploy on Vercel or Netlify. Call backend via environment variable `NEXT_PUBLIC_API_URL`.
