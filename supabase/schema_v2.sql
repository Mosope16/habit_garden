-- 8. RPC Function for calculating user streak
CREATE OR REPLACE FUNCTION get_user_streak(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_streak INTEGER := 0;
    v_date DATE;
    v_target_date DATE := CURRENT_DATE;
BEGIN
    FOR v_date IN
        SELECT DISTINCT completion_date 
        FROM public.habit_completions 
        WHERE user_id = p_user_id 
        ORDER BY completion_date DESC
    LOOP
        IF v_date = v_target_date THEN
            v_streak := v_streak + 1;
            v_target_date := v_target_date - 1;
        ELSIF v_streak = 0 AND v_date = v_target_date - 1 THEN
            -- Didn't complete any habit today yet, but did yesterday. Streak is still active.
            v_streak := v_streak + 1;
            v_target_date := v_date - 1;
        ELSE
            -- Missed a day, streak broken
            EXIT;
        END IF;
    END LOOP;
    
    RETURN v_streak;
END;
$$;
