'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Conversation {
  id: string
  otherUser: {
    id: string
    name: string
    image: string | null
  } | null
  lastMessage: {
    content: string
    createdAt: string
    isFromMe: boolean
  } | null
  listing: {
    id: string
    title: string
    images: Array<{ url: string }>
  } | null
  hasUnread: boolean
  updatedAt: string
}

export default function MessagesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/messages')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchConversations()
    }
  }, [session])

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations')
      if (response.ok) {
        const data = await response.json()
        setConversations(data)
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return date.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit' })
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-AU', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-[var(--muted)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>

        {conversations.length === 0 ? (
          <div className="bg-[var(--background)] rounded-xl p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--muted)] flex items-center justify-center">
              <svg className="w-8 h-8 text-[var(--foreground)]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">No messages yet</h3>
            <p className="text-[var(--foreground)]/60 mb-4">
              When you contact a host or receive inquiries about your listings, your messages will appear here.
            </p>
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Browse Jetties
            </Link>
          </div>
        ) : (
          <div className="bg-[var(--background)] rounded-xl overflow-hidden divide-y divide-[var(--border)]">
            {conversations.map((conversation) => (
              <Link
                key={conversation.id}
                href={`/messages/${conversation.id}`}
                className={`flex items-center gap-4 p-4 hover:bg-[var(--muted)] transition-colors ${
                  conversation.hasUnread ? 'bg-blue-50' : ''
                }`}
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-[var(--primary)] flex items-center justify-center overflow-hidden flex-shrink-0">
                  {conversation.otherUser?.image ? (
                    <Image
                      src={conversation.otherUser.image}
                      alt={conversation.otherUser.name || 'User'}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-white text-lg font-medium">
                      {conversation.otherUser?.name?.[0]?.toUpperCase() || '?'}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`font-medium truncate ${conversation.hasUnread ? 'text-[var(--foreground)]' : 'text-[var(--foreground)]/80'}`}>
                      {conversation.otherUser?.name || 'Unknown User'}
                    </h3>
                    <span className="text-xs text-[var(--foreground)]/60 flex-shrink-0">
                      {conversation.lastMessage ? formatTime(conversation.lastMessage.createdAt) : ''}
                    </span>
                  </div>
                  {conversation.listing && (
                    <p className="text-xs text-[var(--primary)] truncate">
                      {conversation.listing.title}
                    </p>
                  )}
                  {conversation.lastMessage && (
                    <p className={`text-sm truncate ${conversation.hasUnread ? 'text-[var(--foreground)] font-medium' : 'text-[var(--foreground)]/60'}`}>
                      {conversation.lastMessage.isFromMe ? 'You: ' : ''}
                      {conversation.lastMessage.content}
                    </p>
                  )}
                </div>

                {/* Unread indicator */}
                {conversation.hasUnread && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary)] flex-shrink-0"></div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
