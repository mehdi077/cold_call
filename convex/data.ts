import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getNumbersByStatus = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("called"),
        v.literal("no answer"),
        v.literal("later"),
        v.literal("none")
      )
    ),
  },
  handler: async (ctx, args) => {
    if (!args.status || args.status === "none") {
      // Filter by status 'none' and take 10 documents
      return await ctx.db
        .query("numbers")
        .filter((q) => q.eq(q.field("status"), "none"))
        .take(10);
    } else {
      return await ctx.db
        .query("numbers")
        .filter((q) => q.eq(q.field("status"), args.status!))
        .collect();
    }
  },
});

export const updateNumberStatus = mutation({
  args: {
    documentId: v.id("numbers"),
    status: v.union(
      v.literal("called"),
      v.literal("no answer"),
      v.literal("later"),
      v.literal("none")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.documentId, { status: args.status });
  },
});