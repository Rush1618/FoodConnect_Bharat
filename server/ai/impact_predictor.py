import sys
import json
import random

def predict_impact(meals_fed, people_impacted, co2_saved, urgency_avg):
    """
    Simulated AI Prediction Logic for Prototype Showcase
    Calculates Community Velocity Index (CVI)
    """
    # Heuristic: Higher urgency + more meals = Exponential Community Impact
    base_factor = 1.2
    velocity = (meals_fed * 0.1) + (people_impacted * 0.5) + (co2_saved * 2.0)
    
    # Scale by urgency context
    if urgency_avg > 70:
        velocity *= 1.5 # Critical intervention bonus
        
    prediction = {
        "status": "success",
        "community_velocity": round(velocity, 2),
        "forecast_next_30_days": {
            "meals": round(meals_fed * 1.4),
            "co2_saved": round(co2_saved * 1.3, 1),
            "reach_growth": "+18%"
        },
        "ai_recommendation": "Priority Alert: Increase volunteer allocation in Kandivali East sector based on hunger density trends."
    }
    return prediction

if __name__ == "__main__":
    try:
        # Expecting JSON string as first argument
        input_data = json.loads(sys.argv[1])
        
        result = predict_impact(
            input_data.get("meals_fed", 100),
            input_data.get("people_impacted", 50),
            input_data.get("co2_saved", 5.0),
            input_data.get("urgency_avg", 30)
        )
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"status": "error", "message": str(e)}))
