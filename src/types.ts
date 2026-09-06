export type Language = 'en' | 'hi' | 'or';

export interface FarmerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  crops_grown: string[];
  preferred_language: Language;
  role: 'farmer' | 'admin';
  farm_size_acres: number;
  created_at: string;
}

export interface DetectionResult {
  id: string;
  crop: string;
  disease: string;
  confidence: number;
  confidence_percentage: string;
  severity: 'Low' | 'Moderate' | 'High' | 'Severe';
  image_url: string;
  symptoms: string;
  prevention: string[];
  treatment: string[];
  warning_signs: string;
  engine: string;
  created_at: string;
  village?: string;
  district?: string;
}

export interface OutbreakAlert {
  id: string;
  disease: string;
  crop: string;
  district: string;
  focal_village: string;
  affected_villages: string[];
  case_count: number;
  risk_level: 'MODERATE' | 'HIGH' | 'CRITICAL';
  status: 'ACTIVE' | 'MONITORED' | 'CONTAINED';
  recommended_action: string;
  detected_at: string;
}

export interface AlertNotification {
  id: string;
  title: string;
  type: 'OUTBREAK' | 'WEATHER_RISK' | 'DETECTION' | 'ADVISORY';
  severity: 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL';
  message: string;
  village: string;
  is_read: boolean;
  created_at: string;
}

export interface WeatherData {
  district: string;
  latitude: number;
  longitude: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  wind_speed: number;
  weather_code: number;
  source: string;
}

export interface DiseaseRiskData {
  district: string;
  village: string;
  risk_level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  risk_category: string;
  reasons: string[];
  possible_diseases: string[];
  preventive_actions: string[];
  environmental_metrics: {
    temperature_c: number;
    humidity_pct: number;
    rainfall_mm: number;
    wind_speed_kmh: number;
  };
}

export interface DiseaseItem {
  id: number;
  name: string;
  crop: string;
  pathogen: string;
  pathogen_type: string;
  severity: string;
  symptoms: string;
  causes: string;
  prevention: string;
  treatment: string;
  optimal_temp_min: number;
  optimal_temp_max: number;
  critical_humidity_pct: number;
  warning_signs: string;
  image: string;
}

export interface VillageMarker {
  id: number;
  name: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  cases: number;
  risk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  primaryDisease?: string;
}
