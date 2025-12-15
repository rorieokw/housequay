'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Message {
  id: string
  content: string
  createdAt: string
  sender: {
    id: string
    name: string
    image: string | null
  }
}

interface ConversationDetail {
  id: string
  otherUser: {
    id: string
    name: string
    image: string | null
    email: string
  } | null
  messages: Message[]
  listing: {
    id: string
    title: string
    city: string
    images: Array<{ url: string }>
    host: {
      id: string
      name: string
    }
  } | null
}

export default function ConversationPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [conversation, setConversation] = useState<ConversationDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=/messages/${id}`)
    }
  }, [status, router, id])

  useEffect(() => {
    if (session) {
      fetchConversation()
    }
  }, [session, id])

  useEffect(() => {
    scrollToBottom()
  }, [conversation?.messages])

  const fetchConversation = async () => {
    try {
      const response = await fetch(`/api/conversations/${id}`)
      if (response.ok) {
        const data = await response.json()
        setConversation(data)
      } else if (response.status === 404) {
        router.push('/messages')
      }
    } catch (error) {
      console.error('Failed to fetch conversation:', error)
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    try {
      const response = await fetch(`/api/conversations/${id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage }),
      })

      if (response.ok) {
        const message = await response.json()
        setConversation((prev) =>
          prev
            ? {
                ...prev,
                messages: [...prev.messages, message],
              }
            : null
        )
        setNewMessage('')
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setSending(false)
    }
  }

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit' })
  }

  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-AU', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
    }
  }

  const shouldShowDateSeparator = (currentMsg: Message, prevMsg?: Message) => {
    if (!prevMsg) return true
    const currentDate = new Date(currentMsg.createdAt).toDateString()
    const prevDate = new Date(prevMsg.createdAt).toDateString()
    return currentDate !== prevDate
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      </div>
    )
  }

  if (!session || !conversation) {
    return null
  }

  return (
    <div className="min-h-screen bg-[var(--muted)] flex flex-col">
      {/* Header */}
      <div className="bg-[var(--background)] border-b border-[var(--border)] sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/messages"
              className="p-2 -ml-2 hover:bg-[var(--muted)] rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>

            <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center overflow-hidden flex-shrink-0">
              {conversation.otherUser?.image ? (
                <Image
                  src={conversation.otherUser.image}
                  alt={conversation.otherUser.name || 'User'}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              ) : (
                <span className="text-white font-medium">
                  {conversation.otherUser?.name?.[0]?.toUpperCase() || '?'}
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="font-semibold truncate">
                {conversation.otherUser?.name || 'Unknown User'}
              </h1>
              {conversation.listing && (
                <Link
                  href={`/jetty/${conversation.listing.id}`}
                  className="text-sm text-[var(--primary)] hover:underline truncate block"
                >
                  {conversation.listing.title}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Listing Context (if exists) */}
      {conversation.listing && (
        <div className="bg-[var(--background)] border-b border-[var(--border)]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Link
              href={`/jetty/${conversation.listing.id}`}
              className="flex items-center gap-3 hover:bg-[var(--muted)] -mx-3 px-3 py-2 rounded-lg transition-colors"
            >
              <div className="w-16 h-12 rounded-lg overflow-hidden bg-[var(--muted)] flex-shrink-0">
                {conversation.listing.images[0] ? (
                  <Image
                    src={conversation.listing.images[0].url}
                    alt={conversation.listing.title}
                    width={64}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-[var(--muted)]" />
                )}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{conversation.listing.title}</p>
                <p className="text-xs text-[var(--foreground)]/60">{conversation.listing.city}</p>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {conversation.messages.length === 0 ? (
            <div className="text-center py-8 text-[var(--foreground)]/60">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {conversation.messages.map((message, index) => {
                const isFromMe = message.sender.id === session.user?.id
                const prevMessage = conversation.messages[index - 1]
                const showDateSeparator = shouldShowDateSeparator(message, prevMessage)

                return (
                  <div key={message.id}>
                    {showDateSeparator && (
                      <div className="flex items-center justify-center my-4">
                        <span className="text-xs text-[var(--foreground)]/60 bg-[var(--muted)] px-3 py-1 rounded-full">
                          {formatMessageDate(message.createdAt)}
                        </span>
                      </div>
                    )}
                    <div className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[75%] ${
                          isFromMe
                            ? 'bg-[var(--primary)] text-white'
                            : 'bg-[var(--background)] border border-[var(--border)]'
                        } rounded-2xl px-4 py-2`}
                      >
                        <p className="whitespace-pre-wrap break-words">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isFromMe ? 'text-white/70' : 'text-[var(--foreground)]/60'
                          }`}
                        >
                          {formatMessageTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-[var(--background)] border-t border-[var(--border)] sticky bottom-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <form onSubmit={handleSend} className="flex items-end gap-3">
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend(e)
                  }
                }}
                placeholder="Type a message..."
                rows={1}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="p-3 bg-[var(--primary)] text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {sending ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
