-- Script para verificar se os triggers e RLS estão aplicados no Supabase

-- 1. Verificar se os triggers existem
SELECT 
    trigger_name,
    event_manipulation,
    event_object_schema,
    event_object_table,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'profiles'
ORDER BY trigger_name;

-- 2. Verificar se RLS está habilitado nas tabelas
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename IN ('profiles', 'listings', 'books', 'categories', 'locations', 'favorites', 'friendships', 'reviews')
ORDER BY tablename;

-- 3. Verificar as políticas RLS existentes
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('profiles', 'listings', 'books', 'categories', 'locations', 'favorites', 'friendships', 'reviews')
ORDER BY tablename, policyname;

-- 4. Verificar se as funções dos triggers existem
SELECT 
    proname as function_name,
    prosrc as function_source
FROM pg_proc 
WHERE proname IN ('validate_user_exists', 'validate_profile_email', 'cleanup_user_data')
ORDER BY proname;

-- 5. Verificar a estrutura da tabela profiles
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- 6. Verificar se há constraints únicas
SELECT 
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints 
WHERE table_name = 'profiles'
ORDER BY constraint_type;
