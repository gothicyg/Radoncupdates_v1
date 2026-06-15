import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { error } = await supabaseAdmin
    .from('articles')
    .update({
      status: 'REJECTED'
    })
    .eq('id', id)

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true
  })
}