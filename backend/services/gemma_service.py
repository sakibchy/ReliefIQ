import logging
from typing import Optional

import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold

from config import settings

logger = logging.getLogger(__name__)

# Configure the SDK once at import time
if settings.GEMMA_API_KEY:
    genai.configure(api_key=settings.GEMMA_API_KEY)

_ANALYSIS_PROMPT = """
You are a disaster assessment AI for relief organizations in Bangladesh.

Analyze the disaster report below (description may be in Bengali or English).
Assess the situation based on the description and any images provided.

Respond with ONLY a valid JSON object — no markdown, no explanation — with these exact fields:

{{
  "damage_level": "<none|minor|moderate|severe|catastrophic>",
  "urgency_score": "<low|medium|high|critical>",
  "relief_items": ["<items from: food, clean_water, medicine, shelter, rescue, sanitation>"],
  "missing_resources": ["<specific items or resources urgently needed>"],
  "ai_summary": "<English paragraph summarizing the situation for a relief coordinator>",
  "confidence": <float 0.0 to 1.0>
}}

Location: {address} (lat: {lat}, lng: {lng})

Report description:
{description}
"""


async def analyze_report(
    description: str,
    images: list[str],  # base64-encoded image strings
    location: dict,
) -> Optional[dict]:
    """
    Send a disaster report to Gemma 4 for structured analysis.

    Returns a dict with: damage_level, urgency_score, relief_items,
    missing_resources, ai_summary, confidence — or None on failure.
    """
    if not settings.GEMMA_API_KEY:
        logger.warning("GEMMA_API_KEY not set — skipping AI analysis.")
        return None

    try:
        model = genai.GenerativeModel(model_name=settings.GEMMA_MODEL)

        prompt = _ANALYSIS_PROMPT.format(
            lat=location.get("lat", "unknown"),
            lng=location.get("lng", "unknown"),
            address=location.get("address") or "unknown",
            description=description,
        )

        # Build content parts: text prompt first, then images
        parts: list = [prompt]
        for img_b64 in images:
            if img_b64:
                parts.append({
                    "inline_data": {
                        "mime_type": "image/jpeg",
                        "data": img_b64,
                    }
                })

        response = await model.generate_content_async(
            parts,
            generation_config=genai.GenerationConfig(
                temperature=0.2,
                response_mime_type="application/json",
            ),
            safety_settings={
                HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
                HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
                HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
                HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
            },
        )

        import json
        result: dict = json.loads(response.text)

        # Validate required keys are present
        required_keys = {"damage_level", "urgency_score", "relief_items",
                         "missing_resources", "ai_summary", "confidence"}
        if not required_keys.issubset(result.keys()):
            logger.error(f"Gemma response missing keys: {required_keys - result.keys()}")
            return None

        return result

    except Exception as e:
        logger.error(f"Gemma analysis failed: {e}", exc_info=True)
        return None
