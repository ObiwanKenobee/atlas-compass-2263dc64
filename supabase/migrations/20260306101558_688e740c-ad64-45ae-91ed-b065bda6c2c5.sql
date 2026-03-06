-- Dashboard metrics table (public read)
CREATE TABLE public.dashboard_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_key TEXT NOT NULL UNIQUE,
  metric_value NUMERIC NOT NULL,
  metric_unit TEXT,
  change_percent NUMERIC,
  metadata JSONB DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.dashboard_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dashboard metrics are publicly readable"
  ON public.dashboard_metrics FOR SELECT USING (true);

-- Ecosystem metrics table
CREATE TABLE public.ecosystem_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  month TEXT NOT NULL,
  hectares NUMERIC DEFAULT 0,
  carbon NUMERIC DEFAULT 0,
  projects INTEGER DEFAULT 0,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ecosystem_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ecosystem metrics are publicly readable"
  ON public.ecosystem_metrics FOR SELECT USING (true);

-- Strategic alerts table
CREATE TABLE public.strategic_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('contract', 'partnership', 'ecosystem', 'transaction')),
  title TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.strategic_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Strategic alerts are publicly readable"
  ON public.strategic_alerts FOR SELECT USING (true);

-- Seed dashboard_metrics
INSERT INTO public.dashboard_metrics (metric_key, metric_value, metric_unit, change_percent, metadata) VALUES
  ('arr', 14.2, 'M', 34, '{"trend": [3.2,4.1,5.0,5.8,6.9,7.8,8.5,9.4,10.2,11.5,12.8,14.2], "months": ["Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb"]}'),
  ('nrr', 127, '%', 8, '{"benchmark": 120}'),
  ('customer_growth', 48, '% QoQ', 12, '{"totalCustomers": 342, "trend": [180,195,210,228,245,260,278,290,305,318,330,342]}'),
  ('cash_runway', 28, 'months', null, '{"burnRate": 1.8, "cashOnHand": 50.4}'),
  ('activation_rate', 73, '%', 5, '{"target": 80}'),
  ('engagement_score', 8.2, '/10', 8, '{"max": 10}'),
  ('hectares_analyzed', 2.4, 'M', 18, '{}'),
  ('carbon_verified', 847, 'K tons', 24, '{}'),
  ('projects_validated', 1284, '', 31, '{}'),
  ('assets_traded', 89.2, 'M', 42, '{}'),
  ('time_to_value', 12, 'days', -18, '{"target": 10}'),
  ('deployment_velocity', 3.2, '/week', 14, '{}'),
  ('completion_rate', 94, '%', 3, '{}');

-- Seed ecosystem trend data
INSERT INTO public.ecosystem_metrics (month, hectares, carbon, projects) VALUES
  ('Sep', 1.2, 420, 680),
  ('Oct', 1.5, 520, 790),
  ('Nov', 1.7, 610, 890),
  ('Dec', 1.9, 690, 980),
  ('Jan', 2.1, 760, 1100),
  ('Feb', 2.4, 847, 1284);

-- Seed strategic alerts
INSERT INTO public.strategic_alerts (alert_type, title, value, created_at) VALUES
  ('contract', 'Enterprise contract signed — Nordic Climate Fund', '$2.8M ARR', now() - interval '2 hours'),
  ('partnership', 'Government partnership initiated — Kenya Ministry of Environment', '12 restoration sites', now() - interval '6 hours'),
  ('ecosystem', 'Milestone: 2M hectares of verified restoration reached', '+340K this quarter', now() - interval '1 day'),
  ('transaction', 'Large transaction executed — regenerative carbon credits', '$4.1M settled', now() - interval '1 day'),
  ('contract', 'Agricultural cooperative onboarded — Brazilian Cerrado Alliance', '180K hectares', now() - interval '2 days'),
  ('ecosystem', 'Carbon sequestration verification passed audit — Southeast Asia bloc', '142K tons verified', now() - interval '3 days');