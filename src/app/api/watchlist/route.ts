import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

// This function handles adding a new stock to the watchlist
export async function POST(request: Request) {
  const { userId, getToken } = await auth();
  const { symbol } = await request.json();

  if (!userId) return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  if (!symbol) return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });

  const supabaseAccessToken = await getToken({ template: 'supabase' });
  if (!supabaseAccessToken) return NextResponse.json({ error: 'Supabase token not found' }, { status: 500 });

  const authenticatedSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${supabaseAccessToken}` } } }
  );

  const { error } = await authenticatedSupabase
    .from('watchlist')
    .insert({ user_id: userId, symbol: symbol.toUpperCase() });

  if (error) {
    if (error.code === '23505') { // Handles duplicate symbol error
      return NextResponse.json({ message: `${symbol} is already in your watchlist.` }, { status: 200 });
    }
    console.error("Watchlist POST Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: `Added ${symbol} to watchlist.` }, { status: 201 });
}


// =============================================
//          NEW: DELETE FUNCTIONALITY
// =============================================
// This function handles removing a stock from the watchlist
export async function DELETE(request: Request) {
  const { userId, getToken } = await auth();
  const { symbol } = await request.json();

  if (!userId) return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  if (!symbol) return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });

  const supabaseAccessToken = await getToken({ template: 'supabase' });
  if (!supabaseAccessToken) return NextResponse.json({ error: 'Supabase token not found' }, { status: 500 });

  const authenticatedSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${supabaseAccessToken}` } } }
  );

  // Match the row on both user_id AND symbol to delete it
  const { error } = await authenticatedSupabase
    .from('watchlist')
    .delete()
    .eq('user_id', userId)
    .eq('symbol', symbol);

  if (error) {
    console.error("Watchlist DELETE Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: `Removed ${symbol} from watchlist.` }, { status: 200 });
}