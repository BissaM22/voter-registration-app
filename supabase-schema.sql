-- Supabase Schema for Voter Registration System
-- Execute this SQL in your Supabase SQL Editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'standard_user' CHECK (role IN ('super_admin', 'standard_user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create voters table
CREATE TABLE IF NOT EXISTS public.voters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    noms TEXT NOT NULL,
    qualite TEXT NOT NULL CHECK (qualite IN ('Candidat', 'Électeur', 'Responsable du bureau de vote', 'Responsable de la commune')),
    genre TEXT NOT NULL CHECK (genre IN ('Homme', 'Femme')),
    commune TEXT NOT NULL,
    adresse TEXT NOT NULL,
    telephone1 TEXT NOT NULL,
    telephone2 TEXT,
    profession TEXT NOT NULL,
    bureau_de_vote TEXT NOT NULL,
    leader TEXT NOT NULL,
    a_vote TEXT NOT NULL DEFAULT 'Non' CHECK (a_vote IN ('Oui', 'Non')),
    observations TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voters ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Voters policies
CREATE POLICY "Super admins can view all voters" ON public.voters
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'super_admin'
        )
    );

CREATE POLICY "Standard users can view own voters" ON public.voters
    FOR SELECT USING (
        created_by = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'super_admin'
        )
    );

CREATE POLICY "Users can insert voters" ON public.voters
    FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Super admins can update all voters" ON public.voters
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'super_admin'
        )
    );

CREATE POLICY "Standard users can update own voters" ON public.voters
    FOR UPDATE USING (
        created_by = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'super_admin'
        )
    );

CREATE POLICY "Super admins can delete all voters" ON public.voters
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'super_admin'
        )
    );

CREATE POLICY "Standard users can delete own voters" ON public.voters
    FOR DELETE USING (
        created_by = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'super_admin'
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_voters_created_by ON public.voters(created_by);
CREATE INDEX IF NOT EXISTS idx_voters_commune ON public.voters(commune);
CREATE INDEX IF NOT EXISTS idx_voters_qualite ON public.voters(qualite);
CREATE INDEX IF NOT EXISTS idx_voters_genre ON public.voters(genre);
CREATE INDEX IF NOT EXISTS idx_voters_a_vote ON public.voters(a_vote);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_voters_updated_at
    BEFORE UPDATE ON public.voters
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Insert a default super admin (replace with your email)
-- INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
-- VALUES (gen_random_uuid(), 'admin@example.com', crypt('your-password', gen_salt('bf')), NOW(), NOW(), NOW());

-- Note: You'll need to create the first super admin user through the Supabase Auth interface
-- or by signing up through the application and then manually updating their role in the profiles table
