import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { BoatSizeCategory } from '@prisma/client'

// Map form boat size values to Prisma enum
const boatSizeCategoryMap: Record<string, BoatSizeCategory> = {
  small: 'SMALL',
  medium: 'MEDIUM',
  large: 'LARGE',
  xlarge: 'XLARGE',
  yacht: 'SUPERYACHT',
}

// GET /api/listings - Fetch all active listings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const boatSize = searchParams.get('boatSize')

    const where: Record<string, unknown> = {
      status: 'ACTIVE',
      isActive: true,
    }

    if (city) {
      where.city = { contains: city, mode: 'insensitive' }
    }

    if (minPrice || maxPrice) {
      where.pricePerNight = {}
      if (minPrice) (where.pricePerNight as Record<string, number>).gte = parseFloat(minPrice)
      if (maxPrice) (where.pricePerNight as Record<string, number>).lte = parseFloat(maxPrice)
    }

    if (boatSize && boatSizeCategoryMap[boatSize]) {
      where.maxBoatLengthCategory = boatSizeCategoryMap[boatSize]
    }

    const listings = await prisma.listing.findMany({
      where,
      include: {
        host: {
          select: {
            id: true,
            name: true,
            image: true,
            isSuperhost: true,
            responseRate: true,
            responseTime: true,
          },
        },
        images: {
          orderBy: { order: 'asc' },
          take: 5,
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(listings)
  } catch (error) {
    console.error('Error fetching listings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    )
  }
}

// POST /api/listings - Create a new listing
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to create a listing' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      address,
      city,
      latitude,
      longitude,
      maxBoatLength,
      boatSize,
      depth,
      width,
      pricePerNight,
      minimumStay,
      instantBook,
      amenities,
      images,
    } = body

    // Validation
    if (!title || !description || !address || !city) {
      return NextResponse.json(
        { error: 'Title, description, address, and city are required' },
        { status: 400 }
      )
    }

    if (!maxBoatLength || !boatSize || !depth || !width) {
      return NextResponse.json(
        { error: 'Boat specifications are required' },
        { status: 400 }
      )
    }

    if (!pricePerNight) {
      return NextResponse.json(
        { error: 'Price is required' },
        { status: 400 }
      )
    }

    // Map amenities to feature flags
    const amenityList = amenities || []
    const features = {
      hasPower: amenityList.includes('power'),
      hasWater: amenityList.includes('water'),
      hasWifi: amenityList.includes('wifi'),
      hasSecurity: amenityList.includes('security'),
      hasLighting: amenityList.includes('lighting'),
      hasFuel: amenityList.includes('fuel'),
      hasShowers: amenityList.includes('showers'),
      hasParking: amenityList.includes('parking'),
    }

    // Create the listing
    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        address,
        city,
        state: 'NSW', // Default for now
        latitude: latitude || -33.8688, // Default to Sydney if not provided
        longitude: longitude || 151.2093,
        maxBoatLength: parseFloat(maxBoatLength),
        maxBoatLengthCategory: boatSizeCategoryMap[boatSize] || 'MEDIUM',
        depth: parseFloat(depth),
        width: parseFloat(width),
        pricePerNight: parseFloat(pricePerNight),
        minimumStay: parseInt(minimumStay) || 1,
        instantBook: instantBook || false,
        amenities: amenityList,
        ...features,
        status: 'ACTIVE', // Auto-approve for now
        hostId: session.user.id,
        images: images?.length ? {
          create: images.map((img: { url: string; publicId: string }, index: number) => ({
            url: img.url,
            publicId: img.publicId,
            order: index,
          })),
        } : undefined,
      },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        images: true,
      },
    })

    // Update user to be a host
    await prisma.user.update({
      where: { id: session.user.id },
      data: { isHost: true, role: 'HOST' },
    })

    return NextResponse.json(listing, { status: 201 })
  } catch (error) {
    console.error('Error creating listing:', error)
    return NextResponse.json(
      { error: 'Failed to create listing' },
      { status: 500 }
    )
  }
}
