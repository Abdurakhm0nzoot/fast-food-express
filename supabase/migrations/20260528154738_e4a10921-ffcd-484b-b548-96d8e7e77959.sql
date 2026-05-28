CREATE TABLE public.bot_sessions (
  chat_id BIGINT PRIMARY KEY,
  bot TEXT NOT NULL DEFAULT 'customer',
  state JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.bot_sessions TO service_role;

ALTER TABLE public.bot_sessions ENABLE ROW LEVEL SECURITY;

-- No policies: only service_role (server-side) touches this table.
