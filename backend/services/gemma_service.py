import json
import logging
from typing import Optional
import httpx

from config import settings

logger = logging.getLogger(__name__)

GEMMA_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent'

async def analyze_report(
    description: str,
    images: list[str],
    location: dict
) -> Optional[dict]:
    if not settings.GEMMA_API_KEY:
        logger.warning("GEMMA_API_KEY is not set. Skipping AI analysis.")
        return None
        
    prompt = """
    Analyze the following disaster report and images (if provided).
    The description may be in Bengali or English; please translate internally if needed.
    
    Return a JSON object with the following exact fields:
    - damage_level: string, one of 'none', 'minor', 'moderate', 'severe', 'catastrophic'
    - urgency_score: string, one of 'low', 'medium', 'high', 'critical'
    - relief_items: list of strings, chosen from ['food', 'clean_water', 'medicine', 'shelter', 'rescue', 'sanitation']
    - missing_resources: list of strings (e.g. specific tools or items needed)
    - ai_summary: string, an English paragraph summarizing the situation for an admin
    - confidence: float between 0.0 and 1.0 representing your confidence in this assessment
    
    Location context:
    Latitude: {lat}
    Longitude: {lng}
    Address: {address}
    
    Description:
    {desc}
    """
    
    prompt = prompt.format(
        lat=location.get('lat', 'Unknown'),
        lng=location.get('lng', 'Unknown'),
        address=location.get('address', 'Unknown'),
        desc=description
    )
    
    parts = [{"text": prompt}]
    
    for img_base64 in images:
        parts.append({
            "inline_data": {
                "mime_type": "image/jpeg",
                "data": img_base64
            }
        })
        
    payload = {
        "contents": [
            {
                "parts": parts
            }
        ],
        "generationConfig": {
            "temperature": 0.3,
            "responseMimeType": "application/json"
        }
    }
    
    url = GEMMA_API_URL.format(model=settings.GEMMA_MODEL)
    
    try:
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(
                url,
                params={"key": settings.GEMMA_API_KEY},
                json=payload
            )
            response.raise_for_status()
            data = response.json()
            
            text_response = data.get("candidates", [])[0].get("content", {}).get("parts", [])[0].get("text", "{}")
            result = json.loads(text_response)
            return result
    except Exception as e:
        logger.error(f"Failed to analyze report with Gemma: {e}")
        return None
