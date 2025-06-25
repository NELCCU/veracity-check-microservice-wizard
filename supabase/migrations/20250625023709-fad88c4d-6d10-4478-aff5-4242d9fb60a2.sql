
-- Agregar la columna google_maps_api_key a la tabla user_settings
ALTER TABLE public.user_settings 
ADD COLUMN google_maps_api_key TEXT;
