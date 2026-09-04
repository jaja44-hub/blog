import { initRatingsTable, getPostRating, getUserRating, setUserRating } from "@/lib/ratings";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await initRatingsTable();
    const { slug } = await params;
    
    const rating = await getPostRating(slug);
    
    // Get user identifier from header or cookie
    const userIdentifier = request.headers.get("x-user-id") || 
                          request.cookies.get("user_id")?.value || 
                          "anonymous";
    
    const userRating = await getUserRating(slug, userIdentifier);
    
    return NextResponse.json({
      averageRating: Number(rating.average_rating) || 0,
      totalRatings: Number(rating.total_ratings) || 0,
      userRating
    });
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
    await initRatingsTable();
    const { slug } = await params;
    const body = await request.json();
    const { rating } = body;
    
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }
    
    // Get user identifier from header or cookie
    const userIdentifier = request.headers.get("x-user-id") || 
                          request.cookies.get("user_id")?.value || 
                          "anonymous";
    
    await setUserRating(slug, userIdentifier, rating);
    
    const updatedRating = await getPostRating(slug);
    
    return NextResponse.json({
      averageRating: Number(updatedRating.average_rating) || 0,
      totalRatings: Number(updatedRating.total_ratings) || 0,
      userRating: rating
    });
  } catch (error) {
    console.error("Error setting rating:", error);
    return NextResponse.json(
      { error: "Failed to set rating" },
      { status: 500 }
    );
  }
}