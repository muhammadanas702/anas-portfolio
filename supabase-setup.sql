-- Run once in Supabase: SQL Editor -> New query -> paste -> Run
create table if not exists messages (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 200),
  subject text check (char_length(subject) <= 200),
  message text not null check (char_length(message) between 1 and 5000)
);
create table if not exists visits (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  visitor_id text check (char_length(visitor_id) <= 64),
  path text check (char_length(path) <= 200),
  referrer text check (char_length(referrer) <= 200),
  device text check (char_length(device) <= 20),
  tz text check (char_length(tz) <= 64)
);
alter table messages enable row level security;
alter table visits enable row level security;
create policy "visitors can send messages" on messages for insert to anon with check (true);
create policy "visitors can log a visit" on visits for insert to anon with check (true);
create policy "admin reads messages" on messages for select to authenticated using (true);
create policy "admin deletes messages" on messages for delete to authenticated using (true);
create policy "admin reads visits" on visits for select to authenticated using (true);
