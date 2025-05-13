"use server";

import { addReviewToRestaurant } from "@/src/lib/firebase/firestore.js";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore } from "firebase/firestore";

// This is a next.js server action, which is an alpha feature, so
// use with caution.
// https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions
export async function handleReviewFormSubmission(data) {
  if (
    !data.has("restaurantId") ||
    !data.has("text") ||
    !data.has("rating") ||
    !data.has("userId")
  ) {
    console.error("Invalid form data:", Object.fromEntries(data.entries()));
    throw new Error("Missing required form fields.");
  }

  const { app } = await getAuthenticatedAppForUser();
  if (!app) {
    console.error("Failed to authenticate user or retrieve app instance.");
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
