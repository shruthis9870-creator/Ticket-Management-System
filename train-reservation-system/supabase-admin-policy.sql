grant insert on public.trains to anon, authenticated;

drop policy if exists "Demo users can add trains" on public.trains;

create policy "Demo users can add trains"
    on public.trains for insert to anon, authenticated
    with check (true);