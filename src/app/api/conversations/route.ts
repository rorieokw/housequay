import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/conversations - Get user's conversations
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to view conversations' },
        { status: 401 }
      )
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: session.user.id,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        listing: {
          select: {
            id: true,
            title: true,
            images: { take: 1 },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    // Format conversations for response
    const formattedConversations = conversations.map((conv) => {
      const otherParticipant = conv.participants.find(
        (p) => p.userId !== session.user?.id
      )
      const myParticipant = conv.participants.find(
        (p) => p.userId === session.user?.id
      )
      const lastMessage = conv.messages[0]
      const hasUnread = lastMessage && myParticipant?.lastReadAt
        ? new Date(lastMessage.createdAt) > new Date(myParticipant.lastReadAt)
        : lastMessage && !myParticipant?.lastReadAt

      return {
        id: conv.id,
        otherUser: otherParticipant?.user || null,
        lastMessage: lastMessage
          ? {
              content: lastMessage.content,
              createdAt: lastMessage.createdAt,
              isFromMe: lastMessage.senderId === session.user?.id,
            }
          : null,
        listing: conv.listing,
        hasUnread,
        updatedAt: conv.updatedAt,
      }
    })

    return NextResponse.json(formattedConversations)
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    )
  }
}

// POST /api/conversations - Create or get existing conversation
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to start a conversation' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { recipientId, listingId, bookingId, initialMessage } = body

    if (!recipientId) {
      return NextResponse.json(
        { error: 'Recipient ID is required' },
        { status: 400 }
      )
    }

    // Can't message yourself
    if (recipientId === session.user.id) {
      return NextResponse.json(
        { error: 'You cannot message yourself' },
        { status: 400 }
      )
    }

    // Check if conversation already exists between these users
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          {
            participants: {
              some: { userId: session.user.id },
            },
          },
          {
            participants: {
              some: { userId: recipientId },
            },
          },
          // If listingId provided, match on that too
          listingId ? { listingId } : {},
        ],
      },
    })

    if (existingConversation) {
      // If there's an initial message, add it
      if (initialMessage) {
        await prisma.message.create({
          data: {
            content: initialMessage,
            conversationId: existingConversation.id,
            senderId: session.user.id,
            receiverId: recipientId,
          },
        })
        await prisma.conversation.update({
          where: { id: existingConversation.id },
          data: { updatedAt: new Date() },
        })
      }
      return NextResponse.json({ conversationId: existingConversation.id })
    }

    // Create new conversation
    const conversation = await prisma.conversation.create({
      data: {
        listingId: listingId || null,
        bookingId: bookingId || null,
        participants: {
          create: [
            { userId: session.user.id },
            { userId: recipientId },
          ],
        },
      },
    })

    // Add initial message if provided
    if (initialMessage) {
      await prisma.message.create({
        data: {
          content: initialMessage,
          conversationId: conversation.id,
          senderId: session.user.id,
          receiverId: recipientId,
        },
      })
    }

    return NextResponse.json({ conversationId: conversation.id }, { status: 201 })
  } catch (error) {
    console.error('Error creating conversation:', error)
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    )
  }
}
