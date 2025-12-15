import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// POST /api/conversations/[id]/messages - Send a message
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to send messages' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { content } = body

    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      )
    }

    // Get conversation and verify user is participant
    const conversation = await prisma.conversation.findUnique({
      where: { id: params.id },
      include: {
        participants: true,
      },
    })

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    const isParticipant = conversation.participants.some(
      (p) => p.userId === session.user?.id
    )

    if (!isParticipant) {
      return NextResponse.json(
        { error: 'You do not have access to this conversation' },
        { status: 403 }
      )
    }

    // Find the receiver (the other participant)
    const receiver = conversation.participants.find(
      (p) => p.userId !== session.user?.id
    )

    if (!receiver) {
      return NextResponse.json(
        { error: 'Could not find message recipient' },
        { status: 400 }
      )
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        conversationId: params.id,
        senderId: session.user.id,
        receiverId: receiver.userId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    // Update conversation's updatedAt
    await prisma.conversation.update({
      where: { id: params.id },
      data: { updatedAt: new Date() },
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
