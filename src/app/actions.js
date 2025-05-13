"use server";

import { addReviewToRestaurant } from "@/src/lib/firebase/firestore.js";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore } from "firebase/firestore";

// This is a next.js server action, which is an alpha feature, so
// use with caution.
// https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions
export async function handleReviewFormSubmission(data) {
  const { app } = await getAuthenticatedAppForUser();
  if (!app) {
    throw new Error("No authenticated app instance");
  }
  const db = getFirestore(app);

  try {
    await addReviewToRestaurant(db, data.get("restaurantId"), {
      text: data.get("text"),
      rating: data.get("rating"),
      userId: data.get("userId"),
    });
  } catch (error) {
    console.error("Error adding review:", error);
    throw new Error("Failed to add review to the restaurant.");
  }
}
