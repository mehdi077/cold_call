import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  numbers: defineTable({
    name: v.string(),
    site: v.string(),
    category: v.string(),
    phone: v.number(),
    city: v.string(),
    location_link: v.string(),
    status: v.union(
      v.literal("called"),
      v.literal("no answer"),
      v.literal("later"),
      v.literal("none")
    ),
    note: v.optional(v.string()),
  })
  .index("by_status", ["status"]),
});