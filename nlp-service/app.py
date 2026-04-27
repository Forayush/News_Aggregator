from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from textblob import TextBlob
# Or use transformers pipeline for distilbert-base-uncased-finetuned-sst-2-english

app = FastAPI(title="Sentiment Analysis NLP Service")

class ArticleInput(BaseModel):
    text: str

class SentimentOutput(BaseModel):
    score: float
    magnitude: float
    label: str

@app.post("/analyze", response_model=SentimentOutput)
async def analyze_sentiment(article: ArticleInput):
    if not article.text:
        raise HTTPException(status_code=400, detail="Text is required")
        
    blob = TextBlob(article.text)
    polarity = blob.sentiment.polarity
    subjectivity = blob.sentiment.subjectivity
    
    label = "neutral"
    if polarity > 0.1:
        label = "positive"
    elif polarity < -0.1:
        label = "negative"
        
    return SentimentOutput(
        score=polarity,
        magnitude=subjectivity,
        label=label
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
