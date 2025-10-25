-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    cover_url TEXT,
    location TEXT,
    phone TEXT,
    is_provider BOOLEAN DEFAULT FALSE,
    business_name TEXT,
    business_hours TEXT,
    service_areas TEXT[],
    specialties TEXT[],
    push_token TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- User settings table
CREATE TABLE public.user_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    push_notifications BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    booking_reminders BOOLEAN DEFAULT TRUE,
    new_followers BOOLEAN DEFAULT TRUE,
    comments_likes BOOLEAN DEFAULT TRUE,
    promotional_emails BOOLEAN DEFAULT FALSE,
    profile_visibility TEXT DEFAULT 'public' CHECK (profile_visibility IN ('public', 'private')),
    show_location BOOLEAN DEFAULT TRUE,
    message_permissions TEXT DEFAULT 'everyone' CHECK (message_permissions IN ('everyone', 'followers', 'none')),
    language TEXT DEFAULT 'en',
    theme TEXT DEFAULT 'auto' CHECK (theme IN ('light', 'dark', 'auto')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id)
);

-- Pets table
CREATE TABLE public.pets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    species TEXT NOT NULL CHECK (species IN ('dog', 'cat', 'other')),
    breed TEXT,
    age INTEGER CHECK (age >= 0 AND age <= 30),
    weight DECIMAL(5,2) CHECK (weight > 0 AND weight <= 500),
    photo_url TEXT,
    special_needs TEXT,
    vaccination_records TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Transformations table
CREATE TABLE public.transformations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
    before_image_url TEXT NOT NULL,
    after_image_url TEXT NOT NULL,
    description TEXT,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Follows table
CREATE TABLE public.follows (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    follower_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    following_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id)
);

-- Saved transformations table
CREATE TABLE public.saved_transformations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    transformation_id UUID REFERENCES public.transformations(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, transformation_id)
);

-- Likes table
CREATE TABLE public.likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    transformation_id UUID REFERENCES public.transformations(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, transformation_id)
);

-- Comments table
CREATE TABLE public.comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    transformation_id UUID REFERENCES public.transformations(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Blocked users table
CREATE TABLE public.blocked_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    blocker_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    blocked_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(blocker_id, blocked_id),
    CHECK (blocker_id != blocked_id)
);

-- Notifications table
CREATE TABLE public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('like', 'comment', 'follow', 'booking', 'system')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_is_provider ON public.users(is_provider);
CREATE INDEX idx_pets_user_id ON public.pets(user_id);
CREATE INDEX idx_transformations_user_id ON public.transformations(user_id);
CREATE INDEX idx_transformations_pet_id ON public.transformations(pet_id);
CREATE INDEX idx_transformations_created_at ON public.transformations(created_at DESC);
CREATE INDEX idx_follows_follower_id ON public.follows(follower_id);
CREATE INDEX idx_follows_following_id ON public.follows(following_id);
CREATE INDEX idx_saved_transformations_user_id ON public.saved_transformations(user_id);
CREATE INDEX idx_likes_transformation_id ON public.likes(transformation_id);
CREATE INDEX idx_comments_transformation_id ON public.comments(transformation_id);
CREATE INDEX idx_notifications_user_id_read ON public.notifications(user_id, read);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON public.user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON public.pets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transformations_updated_at BEFORE UPDATE ON public.transformations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create functions for maintaining counts
CREATE OR REPLACE FUNCTION update_transformation_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.transformations 
        SET likes_count = likes_count + 1 
        WHERE id = NEW.transformation_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.transformations 
        SET likes_count = likes_count - 1 
        WHERE id = OLD.transformation_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION update_transformation_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.transformations 
        SET comments_count = comments_count + 1 
        WHERE id = NEW.transformation_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.transformations 
        SET comments_count = comments_count - 1 
        WHERE id = OLD.transformation_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Create triggers for count updates
CREATE TRIGGER likes_count_trigger
    AFTER INSERT OR DELETE ON public.likes
    FOR EACH ROW EXECUTE FUNCTION update_transformation_likes_count();

CREATE TRIGGER comments_count_trigger
    AFTER INSERT OR DELETE ON public.comments
    FOR EACH ROW EXECUTE FUNCTION update_transformation_comments_count();

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transformations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_transformations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view public profiles" ON public.users
    FOR SELECT USING (
        id = auth.uid() OR 
        (
            id IN (
                SELECT u.id FROM public.users u
                LEFT JOIN public.user_settings us ON u.id = us.user_id
                WHERE us.profile_visibility = 'public' OR us.profile_visibility IS NULL
            )
        )
    );

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- User settings policies
CREATE POLICY "Users can manage own settings" ON public.user_settings
    FOR ALL USING (auth.uid() = user_id);

-- Pets policies
CREATE POLICY "Users can view pets of public profiles" ON public.pets
    FOR SELECT USING (
        user_id = auth.uid() OR
        user_id IN (
            SELECT u.id FROM public.users u
            LEFT JOIN public.user_settings us ON u.id = us.user_id
            WHERE us.profile_visibility = 'public' OR us.profile_visibility IS NULL
        )
    );

CREATE POLICY "Users can manage own pets" ON public.pets
    FOR ALL USING (auth.uid() = user_id);

-- Transformations policies
CREATE POLICY "Users can view public transformations" ON public.transformations
    FOR SELECT USING (
        user_id = auth.uid() OR
        user_id IN (
            SELECT u.id FROM public.users u
            LEFT JOIN public.user_settings us ON u.id = us.user_id
            WHERE us.profile_visibility = 'public' OR us.profile_visibility IS NULL
        )
    );

CREATE POLICY "Users can manage own transformations" ON public.transformations
    FOR ALL USING (auth.uid() = user_id);

-- Follows policies
CREATE POLICY "Users can view follows" ON public.follows
    FOR SELECT USING (true);

CREATE POLICY "Users can manage own follows" ON public.follows
    FOR ALL USING (auth.uid() = follower_id);

-- Saved transformations policies
CREATE POLICY "Users can manage own saved transformations" ON public.saved_transformations
    FOR ALL USING (auth.uid() = user_id);

-- Likes policies
CREATE POLICY "Users can view likes" ON public.likes
    FOR SELECT USING (true);

CREATE POLICY "Users can manage own likes" ON public.likes
    FOR ALL USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Users can view comments on public transformations" ON public.comments
    FOR SELECT USING (
        transformation_id IN (
            SELECT t.id FROM public.transformations t
            JOIN public.users u ON t.user_id = u.id
            LEFT JOIN public.user_settings us ON u.id = us.user_id
            WHERE us.profile_visibility = 'public' OR us.profile_visibility IS NULL
        )
    );

CREATE POLICY "Users can manage own comments" ON public.comments
    FOR ALL USING (auth.uid() = user_id);

-- Blocked users policies
CREATE POLICY "Users can manage own blocked list" ON public.blocked_users
    FOR ALL USING (auth.uid() = blocker_id);

-- Notifications policies
CREATE POLICY "Users can manage own notifications" ON public.notifications
    FOR ALL USING (auth.uid() = user_id);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
    ('profiles', 'profiles', true),
    ('pets', 'pets', true),
    ('transformations', 'transformations', true);

-- Storage policies
CREATE POLICY "Users can upload profile images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'profiles' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view profile images" ON storage.objects
    FOR SELECT USING (bucket_id = 'profiles');

CREATE POLICY "Users can update own profile images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'profiles' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own profile images" ON storage.objects
    FOR DELETE USING (bucket_id = 'profiles' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload pet images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'pets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view pet images" ON storage.objects
    FOR SELECT USING (bucket_id = 'pets');

CREATE POLICY "Users can update own pet images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'pets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own pet images" ON storage.objects
    FOR DELETE USING (bucket_id = 'pets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload transformation images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'transformations' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view transformation images" ON storage.objects
    FOR SELECT USING (bucket_id = 'transformations');

CREATE POLICY "Users can update own transformation images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'transformations' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own transformation images" ON storage.objects
    FOR DELETE USING (bucket_id = 'transformations' AND auth.uid()::text = (storage.foldername(name))[1]);