-- Adds a column to match inbound Telegram/WhatsApp/Viber messages to an existing CRM chat
-- thread (chat_id on Telegram, phone number on WhatsApp, sender id on Viber). Manual chats
-- created from the CRM UI leave this null.
alter table public.custom_chats add column if not exists external_id text;

create unique index if not exists custom_chats_source_external_id_key
  on public.custom_chats(source, external_id)
  where external_id is not null;
