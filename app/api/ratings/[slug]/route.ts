import { getPostRating, getUserRating, setUserRating } from "@/lib/ratings";
import { NextRequest, NextResponse } from "next/server";

function getOrCreateUserId(request: NextRequest) {
  return request.cookies.get("rating_user_id")?.value ?? crypto.randomUUID();
}

function withUserCookie(response: NextResponse, request: NextRequest, userId: string) {
  if (!request.cookies.get("rating_user_id")) {
    response.cookies.set("rating_user_id", userId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
      path: "/"
    });
  }
  return response;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const rating = await getPostRating(slug);
    const userIdentifier = getOrCreateUserId(request);
    const userRating = await getUserRating(slug, userIdentifier);
    return withUserCookie(NextResponse.json({
      averageRating: Number(rating.average_rating) || 0,
      totalRatings: Number(rating.total_ratings) || 0,
      userRating
    }), request, userIdentifier);
  } catch (error) {
    console.error("Error fetching rating:", error);
    return NextResponse.json(
      { error: "Failed to fetch rating" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const rating = body?.rating;
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }
    
    const userIdentifier = getOrCreateUserId(request);
    await setUserRating(slug, userIdentifier, rating);
    
    const updatedRating = await getPostRating(slug);
    
    return withUserCookie(NextResponse.json({
      averageRating: Number(updatedRating.average_rating) || 0,
      totalRatings: Number(updatedRating.total_ratings) || 0,
      userRating: rating
    }), request, userIdentifier);
  } catch (error) {
    console.error("Error setting rating:", error);
    return NextResponse.json(
      { error: "Failed to set rating" },
      { status: 500 }
    );
  }
}