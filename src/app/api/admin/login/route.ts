import { NextResponse } from 'next/server';
import { validateAdminCredentials } from '@/lib/auth';
import { signAdminToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (validateAdminCredentials(username, password)) {
      const token = signAdminToken();
      
      // Set HTTP-Only cookie
      cookies().set('adminToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 2, // 2 hours
        path: '/',
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error', error);
    return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
  }
}
