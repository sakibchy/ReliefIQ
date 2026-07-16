import json
from datetime import datetime
from weasyprint import HTML
from models.database import Report

_HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>ReliefIQ Disaster Report</title>
    <style>
        body { font-family: Helvetica, Arial, sans-serif; color: #333; line-height: 1.5; padding: 20px; }
        .header { border-bottom: 2px solid #ef4444; padding-bottom: 10px; margin-bottom: 20px; }
        .title { font-size: 24px; font-weight: bold; color: #111; }
        .meta { font-size: 12px; color: #666; margin-top: 5px; }
        .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; color: white; text-transform: uppercase; }
        .critical { background-color: #ef4444; }
        .high { background-color: #f97316; }
        .medium { background-color: #eab308; }
        .low { background-color: #22c55e; }
        .section { margin-bottom: 20px; }
        .section-title { font-size: 16px; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th, .data-table td { padding: 8px; text-align: left; border-bottom: 1px solid #eee; }
        .data-table th { width: 30%; color: #555; }
        .ai-summary { background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">ReliefIQ Official Disaster Report</div>
        <div class="meta">Generated: {generated_date} | Report ID: {report_id}</div>
    </div>

    <div class="section">
        <table class="data-table">
            <tr>
                <th>Urgency Score</th>
                <td><span class="badge {urgency_class}">{urgency_score}</span></td>
            </tr>
            <tr>
                <th>Status</th>
                <td>{status}</td>
            </tr>
            <tr>
                <th>Date Submitted</th>
                <td>{submitted_date}</td>
            </tr>
            <tr>
                <th>Location</th>
                <td>{location}</td>
            </tr>
            <tr>
                <th>Damage Level</th>
                <td>{damage_level}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Reporter Description</div>
        <p>{description}</p>
    </div>

    <div class="section">
        <div class="section-title">AI Assessment & Recommendations</div>
        <div class="ai-summary">
            <p><strong>Summary:</strong> {ai_summary}</p>
            <p><strong>Relief Items Needed:</strong> {relief_items}</p>
            <p><strong>Missing Resources:</strong> {missing_resources}</p>
            <p><small>AI Confidence Score: {confidence}%</small></p>
        </div>
    </div>
</body>
</html>
"""

def generate_report_pdf(report: Report) -> bytes:
    """Generate a PDF byte string from a Report object using WeasyPrint."""
    
    # Parse JSON fields safely
    relief_items = "None specified"
    missing_resources = "None specified"
    
    try:
        items_list = json.loads(report.relief_items)
        if items_list:
            relief_items = ", ".join(items_list).replace("_", " ").title()
    except Exception:
        pass
        
    try:
        missing_list = json.loads(report.missing_resources)
        if missing_list:
            missing_resources = ", ".join(missing_list).replace("_", " ").title()
    except Exception:
        pass

    html_content = _HTML_TEMPLATE.format(
        generated_date=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        report_id=str(report.id),
        urgency_class=report.urgency_score or "low",
        urgency_score=(report.urgency_score or "Unknown").upper(),
        status=(report.status or "submitted").upper().replace("_", " "),
        submitted_date=report.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        location=report.address or f"Lat: {report.lat}, Lng: {report.lng}",
        damage_level=(report.damage_level or "Unknown").title(),
        description=report.description or "No description provided.",
        ai_summary=report.ai_summary or "No AI summary available.",
        relief_items=relief_items,
        missing_resources=missing_resources,
        confidence=int((report.confidence or 0) * 100)
    )

    # Convert HTML to PDF bytes
    pdf_bytes = HTML(string=html_content).write_pdf()
    return pdf_bytes
