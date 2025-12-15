import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/conversations/[id] - Get a single conversation with messages
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to view this conversation' },
        { status: 401 }
      )
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: params.id },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                email: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        listing: {
          select: {
            id: true,
            title: true,
            city: true,
            images: { take: 1 },
            host: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    // Verify user is a participant
    const isParticipant = conversation.participants.some(
      (p) => p.userId === session.user?.id
    )

    if (!isParticipant) {
      return NextResponse.json(
        { error: 'You do not have access to this conversation' },
        { status: 403 }
      )
    }

    // Update lastReadAt for current user
    await prisma.conversationParticipant.updateMany({
      where: {
        conversationId: params.id,
        userId: session.user.id,
      },
      data: {
        lastReadAt: new Date(),
      },
    })

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        conversationId: params.id,
        receiverId: session.user.id,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    })

    // Get the other participant
    const otherParticipant = conversation.participants.find(
      (p) => p.userId !== session.user?.id
    )

    return NextResponse.json({
      id: conversation.id,
      otherUser: otherParticipant?.user || null,
      messages: conversation.messages,
      listing: conversation.listing,
      createdAt: conversation.createdAt,
    })
  } catch (error) {
    console.error('Error fetching conversation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversation' },
      { status: 500 }
    )
  }
}
