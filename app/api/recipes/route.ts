import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// This function handles GET requests to /api/recipes
export async function GET() {
    const supabase = await createClient()

    try {
        // First, get the authenticated user
        const { data: { user } } = await supabase.auth.getUser();

        // If no user is found, return an unauthorized error
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // If a user is found, fetch all recipes that belong to that user
        const { data, error } = await supabase
            .from('recipes')
            .select('*')
            .eq('user_id', user.id);

        // If there was an error fetching the recipes, return a server error
        if (error) {
            console.error('Error fetching recipes:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Otherwise, return the recipes as a JSON response
        return NextResponse.json(data);

    } catch (e) {
        console.error('An unexpected error occurred:', e);
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
}