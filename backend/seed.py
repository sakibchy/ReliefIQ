import asyncio
import json
import uuid
from datetime import datetime, timezone, timedelta
import random

from sqlalchemy.ext.asyncio import AsyncSession
from models.database import engine, Report, ReportStatus, UrgencyScore, DamageLevel, create_db_and_tables

# Dummy Bangladesh Locations
LOCATIONS = [
    {"lat": 23.8103, "lng": 90.4125, "address": "Dhaka City, Dhaka"},
    {"lat": 22.3569, "lng": 91.7832, "address": "Patenga Coast, Chittagong"},
    {"lat": 24.8949, "lng": 91.8687, "address": "Sylhet Sadar, Sylhet"},
    {"lat": 22.7010, "lng": 90.3535, "address": "Barisal River Port, Barisal"},
    {"lat": 24.3636, "lng": 88.6241, "address": "Rajshahi University Area, Rajshahi"},
    {"lat": 22.8456, "lng": 89.5403, "address": "Khulna City Center, Khulna"},
    {"lat": 25.7439, "lng": 89.2752, "address": "Rangpur Town, Rangpur"},
    {"lat": 24.7570, "lng": 90.4066, "address": "Mymensingh Sadar, Mymensingh"},
    {"lat": 21.4272, "lng": 92.0058, "address": "Cox's Bazar Beach Area, Cox's Bazar"},
    {"lat": 23.1634, "lng": 89.2182, "address": "Jessore Bus Terminal, Jessore"}
]

DESCRIPTIONS = [
    ("Severe flooding has completely submerged the main road. 50+ families stranded on rooftops.", UrgencyScore.critical, DamageLevel.severe),
    ("High winds blew off the tin roofs of several houses. People are seeking shelter in the local school.", UrgencyScore.high, DamageLevel.moderate),
    ("A massive landslide has blocked the highway. Vehicles are stuck and there are reports of injuries.", UrgencyScore.critical, DamageLevel.catastrophic),
    ("Heavy rain caused a wall to collapse, injuring two pedestrians. They need medical attention.", UrgencyScore.medium, DamageLevel.minor),
    ("The local river embankment broke. Water is rushing into the village rapidly.", UrgencyScore.critical, DamageLevel.severe),
    ("Storm surge damaged several fishing boats docked near the coast.", UrgencyScore.low, DamageLevel.minor),
    ("A fire broke out in the slum area after a lightning strike. 20 huts destroyed.", UrgencyScore.high, DamageLevel.severe),
    ("Roads are waterlogged. Commuting is difficult but water hasn't entered houses yet.", UrgencyScore.low, DamageLevel.none),
    ("The local clinic is flooded, destroying medical supplies. Urgent medicine needed.", UrgencyScore.high, DamageLevel.moderate),
    ("Cyclone uprooted dozens of ancient trees, blocking the main town square.", UrgencyScore.medium, DamageLevel.minor)
]

async def seed_database():
    print("Initializing database tables...")
    await create_db_and_tables()
    
    print("Seeding database with realistic disaster reports...")
    
    async with AsyncSession(engine) as session:
        for i in range(15):
            loc = random.choice(LOCATIONS)
            desc, urgency, damage = random.choice(DESCRIPTIONS)
            
            # Randomize timestamps within the last 48 hours
            hours_ago = random.randint(1, 48)
            mins_ago = random.randint(0, 59)
            created_time = datetime.now(timezone.utc) - timedelta(hours=hours_ago, minutes=mins_ago)
            
            # Status based on urgency (critical things might be resolved or under review, but low might be ignored)
            status_choices = [ReportStatus.submitted, ReportStatus.under_review, ReportStatus.aid_dispatched, ReportStatus.resolved]
            status_weights = [0.4, 0.3, 0.2, 0.1]
            status = random.choices(status_choices, weights=status_weights)[0]
            
            # Relief items
            all_items = ["food", "clean_water", "medicine", "shelter", "rescue", "sanitation"]
            needed_items = random.sample(all_items, k=random.randint(1, 3))
            
            # Create dummy report
            report = Report(
                id=uuid.uuid4(),
                description=desc,
                lat=loc["lat"] + random.uniform(-0.01, 0.01), # Add slight variance to map coords
                lng=loc["lng"] + random.uniform(-0.01, 0.01),
                address=loc["address"],
                reporter_name=random.choice(["Rahim", "Karim", "Fatema", "Sumaiya", None]),
                reporter_phone=random.choice(["+8801700000000", "+8801900000000", None]),
                image_urls="[]",
                
                # AI Assessed fields
                damage_level=damage,
                urgency_score=urgency,
                relief_items=json.dumps(needed_items),
                missing_resources=json.dumps(["blankets", "first aid kits"] if random.random() > 0.5 else []),
                ai_summary=f"AI Summary: The area is experiencing {damage.value} damage due to recent events. Immediate {needed_items[0]} is required.",
                confidence=round(random.uniform(0.75, 0.99), 2),
                
                status=status,
                assigned_team="Team Alpha" if status in [ReportStatus.aid_dispatched, ReportStatus.resolved] else None,
                created_at=created_time
            )
            
            session.add(report)
            
        await session.commit()
        print("✅ Successfully seeded 15 disaster reports into the database!")

if __name__ == "__main__":
    asyncio.run(seed_database())
