-- Schema v3: Add get_habit_statistics RPC

-- Function to get daily habit completion stats for a specific date range
CREATE OR REPLACE FUNCTION get_habit_statistics(p_user_id UUID, p_start_date DATE, p_end_date DATE)
RETURNS TABLE (
    completion_date DATE,
    total_xp BIGINT,
    completion_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        hc.completion_date,
        SUM(hc.xp_earned) as total_xp,
        COUNT(hc.id) as completion_count
    FROM 
        public.habit_completions hc
    WHERE 
        hc.user_id = p_user_id
        AND hc.completion_date >= p_start_date
        AND hc.completion_date <= p_end_date
    GROUP BY 
        hc.completion_date
    ORDER BY 
        hc.completion_date ASC;
END;
$$;
