import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { cookies } from 'next/headers';

function isAuthenticated() {
  const cookieStore = cookies();
  const token = cookieStore.get('adminToken');
  return !!token?.value;
}

export async function POST(request: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, isApproved } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('photos')
      .update({ is_approved: isApproved })
      .eq('id', id);

    if (error) {
      console.error('Update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, isApproved });
  } catch (error) {
    console.error('Toggle status error', error);
    return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
  }
}
