
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
REVOKE INSERT, UPDATE ON public.orders FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
