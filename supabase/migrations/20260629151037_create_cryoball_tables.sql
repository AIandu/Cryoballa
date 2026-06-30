/*
# Create Cryo Ball Unit and Deployment Tracking Tables

1. New Tables
- `units` - Tracks individual Cryo Ball units
  - id (uuid, primary key)
  - serial_number (text, unique) - Unique unit identifier
  - model (text) - Model variant (Military, Civilian, Expedition)
  - status (text) - Current status (Active, Standby, Maintenance, Decommissioned)
  - location (text) - Current storage location
  - assigned_to (text, nullable) - Person or team assigned
  - last_inspection (date) - Last inspection date
  - next_inspection (date) - Next scheduled inspection
  - battery_health (integer) - Battery health percentage
  - deployment_count (integer) - Total number of deployments
  - created_at (timestamp)
  - updated_at (timestamp)

- `deployments` - Tracks each Cryo Ball deployment event
  - id (uuid, primary key)
  - unit_id (uuid, foreign key to units)
  - operator (text) - Person who deployed
  - environment (text) - Deployment environment (Desert, Arctic, Ocean, Combat, etc.)
  - status (text) - Deployment status (Active, Rescued, Recovered, Failed)
  - latitude (real, nullable) - GPS latitude
  - longitude (real, nullable) - GPS longitude
  - started_at (timestamp) - Deployment start time
  - ended_at (timestamp, nullable) - Recovery/rescue time
  - duration_hours (integer, nullable) - Total deployment duration
  - threats_encountered (text, nullable) - JSON array of threats
  - rescue_method (text, nullable) - How the occupant was rescued
  - notes (text, nullable) - Additional notes
  - created_at (timestamp)

2. Security
- Enable RLS on both tables
- Allow anon + authenticated CRUD (single-tenant demo app)
*/

CREATE TABLE IF NOT EXISTS units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_number text UNIQUE NOT NULL,
  model text NOT NULL DEFAULT 'Military',
  status text NOT NULL DEFAULT 'Standby',
  location text,
  assigned_to text,
  last_inspection date,
  next_inspection date,
  battery_health integer DEFAULT 100,
  deployment_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS deployments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  operator text NOT NULL,
  environment text NOT NULL,
  status text NOT NULL DEFAULT 'Active',
  latitude real,
  longitude real,
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  duration_hours integer,
  threats_encountered text,
  rescue_method text,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_units" ON units;
CREATE POLICY "anon_select_units" ON units FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_units" ON units;
CREATE POLICY "anon_insert_units" ON units FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_units" ON units;
CREATE POLICY "anon_update_units" ON units FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_units" ON units;
CREATE POLICY "anon_delete_units" ON units FOR DELETE
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_deployments" ON deployments;
CREATE POLICY "anon_select_deployments" ON deployments FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_deployments" ON deployments;
CREATE POLICY "anon_insert_deployments" ON deployments FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_deployments" ON deployments;
CREATE POLICY "anon_update_deployments" ON deployments FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_deployments" ON deployments;
CREATE POLICY "anon_delete_deployments" ON deployments FOR DELETE
  TO anon, authenticated USING (true);

-- Insert sample data
INSERT INTO units (serial_number, model, status, location, assigned_to, last_inspection, next_inspection, battery_health, deployment_count) VALUES
('CB-2024-001', 'Military', 'Active', 'Forward Operating Base Alpha', 'Sgt. J. Martinez', '2024-01-15', '2024-07-15', 98, 12),
('CB-2024-002', 'Military', 'Active', 'Naval Station Bravo', 'PO2 L. Chen', '2024-02-20', '2024-08-20', 95, 8),
('CB-2024-003', 'Expedition', 'Standby', 'Arctic Research Station', 'Dr. M. Weber', '2024-03-10', '2024-09-10', 100, 3),
('CB-2024-004', 'Civilian', 'Standby', 'Disaster Response HQ', 'Emergency Team Alpha', '2024-01-05', '2024-07-05', 92, 5),
('CB-2024-005', 'Military', 'Maintenance', 'Central Depot', NULL, '2024-04-01', '2024-10-01', 85, 15),
('CB-2024-006', 'Expedition', 'Active', 'Deep Sea Platform Omega', 'Capt. R. Nakamura', '2024-02-28', '2024-08-28', 97, 6),
('CB-2024-007', 'Civilian', 'Standby', 'Mountain Rescue HQ', 'Rescue Team Beta', '2024-03-15', '2024-09-15', 99, 2),
('CB-2024-008', 'Military', 'Standby', 'Air Force Base Charlie', 'Maj. A. Johnson', '2024-04-10', '2024-10-10', 100, 0);

INSERT INTO deployments (unit_id, operator, environment, status, latitude, longitude, started_at, ended_at, duration_hours, threats_encountered, rescue_method) VALUES
((SELECT id FROM units WHERE serial_number = 'CB-2024-001'), 'Sgt. J. Martinez', 'Desert', 'Rescued', 33.45, 44.25, '2024-03-01 08:00:00', '2024-03-01 14:30:00', 6, '["Extreme Heat", "Sandstorm", "Ballistic"]', 'Helicopter Extraction'),
((SELECT id FROM units WHERE serial_number = 'CB-2024-001'), 'Sgt. J. Martinez', 'Combat', 'Rescued', 34.12, 45.33, '2024-04-15 02:30:00', '2024-04-15 08:00:00', 5, '["Ballistic", "Explosive", "Chemical"]', 'Ground Vehicle Recovery'),
((SELECT id FROM units WHERE serial_number = 'CB-2024-002'), 'PO2 L. Chen', 'Ocean', 'Rescued', 28.50, -80.60, '2024-02-20 12:00:00', '2024-02-20 18:45:00', 6, '["Drowning", "Waves", "Exposure"]', 'Coast Guard Vessel'),
((SELECT id FROM units WHERE serial_number = 'CB-2024-003'), 'Dr. M. Weber', 'Arctic', 'Rescued', 71.20, -156.80, '2024-01-25 00:00:00', '2024-01-28 00:00:00', 72, '["Hypothermia", "Ice", "Whiteout"]', 'Icebreaker Ship'),
((SELECT id FROM units WHERE serial_number = 'CB-2024-004'), 'Emergency Team Alpha', 'Earthquake', 'Rescued', 35.68, 139.76, '2024-03-11 05:00:00', '2024-03-11 12:00:00', 7, '["Collapse", "Debris", "Fire"]', 'Urban Search and Rescue'),
((SELECT id FROM units WHERE serial_number = 'CB-2024-006'), 'Capt. R. Nakamura', 'Ocean', 'Active', -15.30, 147.80, '2024-06-28 10:00:00', NULL, NULL, '["Pressure", "Drowning"]', NULL);
