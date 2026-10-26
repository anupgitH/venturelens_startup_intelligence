import json
from google import genai
from app.config import settings

def demo_report(idea: dict) -> dict:
    # Transparent fallback so the project runs without an API key.
    score = 55
    if len(idea["description"]) > 250:
        score += 5
    if idea["target_audience"].strip():
        score += 5
    score = min(score, 65)
    return {
        "score": score,
        "verdict": "Promising hypothesis — validate with customers",
        "summary": "Demo-mode report. Add GEMINI_API_KEY to generate a tailored AI analysis. This is not a market-research result.",
        "problem_statement": "Interview potential customers to verify the frequency, urgency and current cost of the problem.",
        "target_customers": [idea["target_audience"], "A narrow early-adopter segment to be identified through interviews"],
        "market_hypotheses": [
            "Estimate the reachable market from a defined geography and customer segment.",
            "Validate willingness to pay using interviews, landing-page tests or pre-orders."
        ],
        "competitors_to_research": [
            {"name": "Direct alternatives", "positioning": "Find products solving the same core problem", "differentiation": "Compare workflow, price, trust and distribution"},
            {"name": "Manual workaround", "positioning": "Spreadsheets, messaging or existing processes", "differentiation": "Test whether the proposed solution is measurably easier"}
        ],
        "swot": {
            "strengths": ["Clear focus can help test one customer problem quickly"],
            "weaknesses": ["Customer demand and willingness to pay are not yet proven"],
            "opportunities": ["Interview a focused customer segment and test an MVP"],
            "threats": ["Existing solutions, acquisition costs and low retention"]
        },
        "risks": [
            {"risk": "Insufficient demand", "severity": "High", "mitigation": "Conduct 15–20 customer interviews before building"},
            {"risk": "Weak differentiation", "severity": "Medium", "mitigation": "Compare at least five alternatives and test a specific advantage"},
            {"risk": "Unclear unit economics", "severity": "Medium", "mitigation": "Estimate acquisition cost, gross margin and retention"}
        ],
        "monetization": ["Test a subscription, one-time fee or usage-based model with target customers"],
        "mvp_roadmap": [
            {"week": "Week 1", "goal": "Interview customers and validate the problem", "deliverables": ["Interview guide", "Problem evidence log"]},
            {"week": "Week 2", "goal": "Prototype the core workflow", "deliverables": ["Clickable prototype", "Five usability tests"]},
            {"week": "Week 3", "goal": "Build the smallest useful product", "deliverables": ["One core user journey", "Basic analytics"]},
            {"week": "Week 4", "goal": "Run a small pilot", "deliverables": ["Feedback summary", "Continue / revise / stop decision"]}
        ],
        "next_steps": ["Define one customer segment", "Interview 15–20 potential customers", "Compare existing alternatives", "Test willingness to pay"],
        "assumptions": ["No live market database was queried", "Competitor and market hypotheses require independent verification"],
        "mode": "demo"
    }

def generate_report(idea: dict) -> dict:
    if not settings.gemini_api_key:
        return demo_report(idea)

    prompt = f'''
You are a careful startup discovery analyst. Analyze the following idea for educational decision support.
Never fabricate market sizes, citations, competitor facts, or current statistics. If evidence is not supplied, label statements as hypotheses and suggest how to verify them. Be balanced and specific. Score is an estimate, not a probability of success.
Return ONLY valid JSON with keys:
score (integer 0-100), verdict (string), summary (string), problem_statement (string),
target_customers (array of strings), market_hypotheses (array of strings),
competitors_to_research (array of objects with name, positioning, differentiation),
swot (object with strengths, weaknesses, opportunities, threats arrays),
risks (array of objects with risk, severity [Low/Medium/High], mitigation),
monetization (array of strings),
mvp_roadmap (array of objects with week, goal, deliverables array),
next_steps (array of strings), assumptions (array of strings), mode ("gemini").
Score dimensions: problem clarity 20%, customer specificity 20%, differentiation 20%, feasibility 20%, monetization 20%. Explain score factors in summary or next_steps. Avoid presenting this as investment advice.
Idea:
Name: {idea['idea_name']}
Industry: {idea['industry']}
Target audience: {idea['target_audience']}
Budget: {idea['budget']}
Geography: {idea['geography']}
Description: {idea['description']}
'''
    client = genai.Client(api_key=settings.gemini_api_key)
    response = client.models.generate_content(
        model=settings.gemini_model,
        contents=prompt,
        config={"response_mime_type": "application/json", "temperature": 0.3}
    )
    raw = response.text or ""
    report = json.loads(raw)
    score = int(report.get("score", 0))
    report["score"] = max(0, min(100, score))
    report["mode"] = "gemini"
    return report
