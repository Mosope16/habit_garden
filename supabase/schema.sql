-- Supabase Schema for Habit Garden

-- Create custom types if needed
-- DROP TYPE IF EXISTS plant_stage;
-- CREATE TYPE plant_stage AS ENUM ('seed', 'sprout', 'plant', 'flower', 'tree');

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    display_name TEXT,
    avatar_url TEXT,
    xp INTEGER DEFAULT 0 NOT NULL,
    level INTEGER DEFAULT 1 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);


-- 2. Garden Table
CREATE TABLE IF NOT EXISTS public.garden (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
    level INTEGER DEFAULT 1 NOT NULL,
    experience INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.garden ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own garden" 
    ON public.garden FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own garden" 
    ON public.garden FOR UPDATE 
    USING (auth.uid() = user_id);


-- 3. Garden Plants Table
CREATE TABLE IF NOT EXISTS public.garden_plants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    garden_id UUID REFERENCES public.garden(id) ON DELETE CASCADE NOT NULL,
    plant_type TEXT NOT NULL,
    growth_stage TEXT NOT NULL DEFAULT 'seed',
    position JSONB NOT NULL DEFAULT '{"x": 0, "y": 0}'::jsonb,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.garden_plants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own garden plants" 
    ON public.garden_plants FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.garden 
            WHERE garden.id = garden_plants.garden_id 
            AND garden.user_id = auth.uid()
        )
    );


-- 4. Habits Table
CREATE TABLE IF NOT EXISTS public.habits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    frequency TEXT DEFAULT 'daily' NOT NULL,
    xp_reward INTEGER DEFAULT 10 NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own habits" 
    ON public.habits FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own habits" 
    ON public.habits FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits" 
    ON public.habits FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habits" 
    ON public.habits FOR DELETE 
    USING (auth.uid() = user_id);


-- 5. Habit Completions Table
CREATE TABLE IF NOT EXISTS public.habit_completions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    completion_date DATE DEFAULT CURRENT_DATE NOT NULL,
    xp_earned INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Constraint to ensure one completion per habit per day
    UNIQUE(habit_id, completion_date)
);

ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own habit completions" 
    ON public.habit_completions FOR SELECT 
    USING (auth.uid() = user_id);


-- Create indexes for performance
CREATE INDEX idx_habit_completions_habit_date ON public.habit_completions(habit_id, completion_date);
CREATE INDEX idx_habit_completions_user_date ON public.habit_completions(user_id, completion_date);


-- 6. RPC Function for Completing Habits (Atomic Transaction)
CREATE OR REPLACE FUNCTION complete_habit(p_habit_id UUID)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with elevated privileges to update profiles securely
AS $$
DECLARE
    v_user_id UUID;
    v_xp_reward INTEGER;
    v_is_active BOOLEAN;
    v_current_xp INTEGER;
    v_new_xp INTEGER;
    v_new_level INTEGER;
    v_completion_id UUID;
BEGIN
    -- Get the authenticated user
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Verify habit exists, belongs to user, and is active, lock the row
    SELECT xp_reward, is_active INTO v_xp_reward, v_is_active
    FROM public.habits
    WHERE id = p_habit_id AND user_id = v_user_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Habit not found or does not belong to user';
    END IF;

    IF NOT v_is_active THEN
        RAISE EXCEPTION 'Habit is not active';
    END IF;

    -- Insert completion (this will fail if constraint habit_id + completion_date already exists)
    BEGIN
        INSERT INTO public.habit_completions (habit_id, user_id, completion_date, xp_earned)
        VALUES (p_habit_id, v_user_id, CURRENT_DATE, v_xp_reward)
        RETURNING id INTO v_completion_id;
    EXCEPTION WHEN unique_violation THEN
        RAISE EXCEPTION 'Habit already completed today';
    END;

    -- Update Profile XP and Level
    SELECT xp INTO v_current_xp FROM public.profiles WHERE id = v_user_id FOR UPDATE;
    
    v_new_xp := v_current_xp + v_xp_reward;
    -- Level formula: floor(sqrt(xp / 100)) + 1
    v_new_level := FLOOR(SQRT(v_new_xp / 100)) + 1;

    UPDATE public.profiles 
    SET xp = v_new_xp, level = v_new_level
    WHERE id = v_user_id;
    
    -- Update Garden Experience and Level to keep them synced
    UPDATE public.garden
    SET experience = v_new_xp, level = v_new_level
    WHERE user_id = v_user_id;

    -- Return updated state
    RETURN json_build_object(
        'completion_id', v_completion_id,
        'xp_earned', v_xp_reward,
        'total_xp', v_new_xp,
        'level', v_new_level
    );
END;
$$;


-- 7. Trigger to Create Profile and Garden on Signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (new.id, split_part(new.email, '@', 1));
  
  INSERT INTO public.garden (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
