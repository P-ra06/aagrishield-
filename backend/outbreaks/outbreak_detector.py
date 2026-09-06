from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from .models import OutbreakSetting, OutbreakAlert

def check_and_trigger_outbreak(crop_name: str, disease_name: str, village_name: str, district: str) -> Optional[Dict[str, Any]]:
    """
    Evaluates detection clusters within configured timeframe.
    Triggers outbreak alert when threshold is crossed.
    """
    try:
        from detection.models import DetectionRecord
        from alerts.models import Alert
        from accounts.models import User

        setting = OutbreakSetting.objects.first()
        threshold = setting.threshold_cases if setting else 3
        days = setting.timeframe_days if setting else 7

        start_date = datetime.now() - timedelta(days=days)

        # Count cases in same district & disease within window
        matching_cases = DetectionRecord.objects.filter(
            disease_name__iexact=disease_name,
            district__iexact=district,
            created_at__gte=start_date
        )

        case_count = matching_cases.count()
        villages = list(matching_cases.values_list('village_name', flat=True).distinct())

        if village_name not in villages:
            villages.append(village_name)

        if case_count >= threshold:
            risk_level = "CRITICAL" if case_count >= (threshold * 2) else "HIGH"

            outbreak, created = OutbreakAlert.objects.get_or_create(
                disease_name=disease_name,
                district=district,
                status='ACTIVE',
                defaults={
                    'crop_name': crop_name,
                    'focal_village': village_name,
                    'affected_villages': ", ".join(villages),
                    'case_count': case_count,
                    'risk_level': risk_level,
                    'recommended_action': f"Immediate community quarantine of infected rows. Restrict movement of farm equipment between {', '.join(villages[:3])}. Apply prophylactic copper/systemic spray across 5km perimeter."
                }
            )

            if not created:
                outbreak.case_count = case_count
                outbreak.affected_villages = ", ".join(villages)
                outbreak.risk_level = risk_level
                outbreak.save()

            # Broadcast alert to all farmers in affected district
            for u in User.objects.all()[:10]:
                Alert.objects.create(
                    user=u,
                    title=f"🚨 OUTBREAK ALERT: {disease_name} in {district}",
                    alert_type="OUTBREAK",
                    severity="CRITICAL",
                    message=f"Community outbreak identified across {len(villages)} villages ({', '.join(villages[:3])}). {case_count} verified infections detected.",
                    village=village_name
                )

            return {
                "outbreak_id": outbreak.id,
                "disease": disease_name,
                "affected_villages": villages,
                "case_count": case_count,
                "risk_level": risk_level,
                "threshold": threshold
            }
    except Exception as e:
        print(f"[Outbreak Detector Error] {e}")

    return None
