import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { sendNewMessageEmail } from '@/lib/email'

// POST /api/conversations/[id]/messages - Send a message
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
      where: { id },
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
        conversationId: id,
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
      where: { id },
      data: { updatedAt: new Date() },
    })

    // Send email notification to recipient
    const recipientUser = await prisma.user.findUnique({
      where: { id: receiver.userId },
      select: { name: true, email: true },
    })

    // Get listing title if this conversation is about a listing
    let listingTitle: string | undefined
    if (conversation.listingId) {
      const listing = await prisma.listing.findUnique({
        where: { id: conversation.listingId },
        select: { title: true },
      })
      listingTitle = listing?.title
    }

    if (recipientUser?.email) {
      sendNewMessageEmail({
        recipientName: recipientUser.name || 'User',
        recipientEmail: recipientUser.email,
        senderName: message.sender.name || 'User',
        messagePreview: content.trim(),
        conversationId: id,
        listingTitle,
      }).catch(console.error)
    }

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
