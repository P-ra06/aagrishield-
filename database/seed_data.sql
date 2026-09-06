-- AgriShield Database Seed Data
-- Initial realistic agricultural dataset for SIH evaluation

-- 1. Villages
INSERT INTO villages (name, district, state, latitude, longitude, pincode) VALUES
('Balarampur', 'Balasore', 'Odisha', 21.5034, 86.9248, '756001'),
('Remuna', 'Balasore', 'Odisha', 21.5298, 86.8711, '756019'),
('Soro', 'Balasore', 'Odisha', 21.2858, 86.6904, '756045'),
('Athagarh', 'Cuttack', 'Odisha', 20.5284, 85.7827, '754029'),
('Pipili', 'Puri', 'Odisha', 20.1171, 85.8315, '752104'),
('Baramati', 'Pune', 'Maharashtra', 18.1517, 74.5772, '413102'),
('Niphad', 'Nashik', 'Maharashtra', 20.0768, 74.1086, '422303'),
('Karnal Rural', 'Karnal', 'Haryana', 29.6857, 76.9905, '132001');

-- 2. Crops
INSERT INTO crops (name, scientific_name, category) VALUES
('Potato', 'Solanum tuberosum', 'Vegetable'),
('Tomato', 'Solanum lycopersicum', 'Vegetable'),
('Rice', 'Oryza sativa', 'Cereal'),
('Wheat', 'Triticum aestivum', 'Cereal'),
('Corn (Maize)', 'Zea mays', 'Cereal'),
('Cotton', 'Gossypium hirsutum', 'Cash Crop'),
('Apple', 'Malus domestica', 'Fruit'),
('Grape', 'Vitis vinifera', 'Fruit');

-- 3. Detailed Diseases Knowledge Base
INSERT INTO diseases (crop_id, name, pathogen, pathogen_type, symptoms, causes, prevention, treatment, severity, optimal_temp_min, optimal_temp_max, critical_humidity_pct, warning_signs) VALUES
(1, 'Late Blight', 'Phytophthora infestans', 'Fungal/Oomycete',
 'Water-soaked irregular spots on leaves quickly turning dark brown to purplish-black. White downy mildew on underside during damp mornings. Tubers show shallow sunken brown rot.',
 'Persistent cool wet conditions (temp 10-20°C, RH >85%) combined with persistent leaf wetness.',
 'Plant certified resistant seeds; practice wide row spacing; avoid late afternoon overhead irrigation; implement crop rotation.',
 'Spray Metalaxyl 8% + Mancozeb 64% WP at 2.5 g/L or Cymoxanil 8% + Mancozeb 64% at 2 g/L. Rogue out severely blighted plants immediately.',
 'Severe', 12.0, 22.0, 85.0,
 'Rapid canopy blackening within 48 hours of rain or dense morning fog.'),

(1, 'Early Blight', 'Alternaria solani', 'Fungal',
 'Brownish-black circular spots with concentric target-board rings on older foliage, turning yellow around edges and drying out.',
 'Warm temperatures (24-30°C) with alternating wet and dry periods; poor soil nitrogen/potassium.',
 'Rotate crops with non-solanaceous species; destroy crop residues after harvest; apply organic mulch.',
 'Foliar application of Mancozeb 75% WP (2 g/L) or Chlorothalonil 75% WP (2 g/L). In advanced stages, use Azoxystrobin 23% SC.',
 'Moderate', 22.0, 30.0, 75.0,
 'Lower leaves turning yellow and dying off progressively up the plant.'),

(2, 'Yellow Leaf Curl Virus', 'Tomato yellow leaf curl virus (TYLCV)', 'Viral',
 'Upward rolling and cupping of leaflet margins, severe stunting of apical shoots, marked yellowing between veins, abortion of flower buds.',
 'Transmitted by the silverleaf whitefly (Bemisia tabaci) in dry, warm conditions.',
 'Set up 15-20 yellow sticky traps per acre; grow border barrier crops like maize/sorghum; use insect-proof nursery nets (40 mesh).',
 'Spray systemic insecticide Thiamethoxam 25% WG (0.3 g/L) or Acetamiprid 20% SP (0.4 g/L) to manage vector whiteflies. No chemical cure for virus once infected.',
 'High', 25.0, 35.0, 50.0,
 'Clustered pale upward curled foliage and numerous tiny whiteflies fluttering under leaves.'),

(2, 'Late Blight', 'Phytophthora infestans', 'Fungal',
 'Large greasy water-soaked spots on leaves and petioles; brown firm leathery lesions on green fruit; rapid vine collapse.',
 'Cloudy, overcast weather with high humidity (>90%) and temperatures between 15-22°C.',
 'Keep distance from potato plots; stake and trellis plants for optimal airflow; avoid wetting leaves.',
 'Apply Dimethomorph 50% WP (1 g/L) + Mancozeb (2 g/L) or Fenamidone + Mancozeb (2.5 g/L).',
 'High', 15.0, 22.0, 90.0,
 'Rapid wilting and brown oily blotches on stems and unripe fruits.'),

(3, 'Leaf Blast', 'Magnaporthe oryzae', 'Fungal',
 'Diamond or spindle-shaped lesions with grayish centers and brown reddish margins. Lesions enlarge and coalesce causing entire leaf blading to dry.',
 'High relative humidity (>90%), dew, high nitrogen application, temperatures between 20-28°C.',
 'Avoid excessive split urea applications; seed treatment with Tricyclazole at 2 g/kg; maintain 5cm water level.',
 'Foliar spray of Tricyclazole 75% WP (0.6 g/L) or Kasugamycin 3% SL (2 ml/L) at boot leaf emergence.',
 'Severe', 20.0, 28.0, 90.0,
 'Spindle-shaped spots on leaves accompanied by neck blast (blackening of panicle node).'),

(4, 'Yellow Rust (Stripe Rust)', 'Puccinia striiformis', 'Fungal',
 'Bright yellow powdery pustules arranged in parallel linear stripes along leaf veins; fingers turn yellow upon touching leaves.',
 'Cool humid weather (10-18°C) with persistent winter morning dews.',
 'Sow resistant varieties (e.g., HD 2967, DBW 187); avoid late sowing; maintain optimum spacing.',
 'Spray Propiconazole 25% EC (1 ml/L) or Tebuconazole 25.9% EC (1 ml/L) upon detecting initial stripes.',
 'High', 10.0, 18.0, 80.0,
 'Linear yellow stripes spreading rapidly across wheat fields in January-February.');
