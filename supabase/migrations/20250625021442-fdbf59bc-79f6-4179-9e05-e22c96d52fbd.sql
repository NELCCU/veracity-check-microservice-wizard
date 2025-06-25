
-- Crear tabla para verificaciones de direcciones
CREATE TABLE public.address_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  address TEXT NOT NULL,
  formatted_address TEXT,
  status TEXT NOT NULL CHECK (status IN ('valid', 'invalid')),
  confidence_score INTEGER DEFAULT 0,
  location_type TEXT,
  coordinates_lat DECIMAL(10, 8),
  coordinates_lng DECIMAL(11, 8),
  place_id TEXT,
  components JSONB DEFAULT '{}'::jsonb,
  types TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.address_verifications ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para que los usuarios solo vean sus propias verificaciones
CREATE POLICY "Users can view their own address verifications" 
  ON public.address_verifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own address verifications" 
  ON public.address_verifications 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own address verifications" 
  ON public.address_verifications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own address verifications" 
  ON public.address_verifications 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_address_verifications_user_id ON public.address_verifications(user_id);
CREATE INDEX idx_address_verifications_created_at ON public.address_verifications(created_at DESC);
