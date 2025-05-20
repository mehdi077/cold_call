import { query } from "./_generated/server";
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
      return await ctx.db.query("numbers").take(10);
    } else {
      return await ctx.db
        .query("numbers")
        .filter((q) => q.eq(q.field("status"), args.status!))
        .collect();
    }
  },
});
