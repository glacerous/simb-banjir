import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - Load checklist items for a user
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ 
      headers: request.headers 
    })
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const checklistItems = await prisma.checklistItem.findMany({
      where: { userId },
    })

    return NextResponse.json(checklistItems)
  } catch (error) {
    console.error('Error loading checklist:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Save/update checklist item
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ 
      headers: request.headers 
    })
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()
    const { itemKey, isCompleted } = body

    if (!itemKey || typeof isCompleted !== 'boolean') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    // Upsert checklist item
    const checklistItem = await prisma.checklistItem.upsert({
      where: {
        itemKey_userId: {
          itemKey,
          userId,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        itemKey,
        isCompleted,
        userId,
      },
    })

    return NextResponse.json(checklistItem)
  } catch (error) {
    console.error('Error saving checklist:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

