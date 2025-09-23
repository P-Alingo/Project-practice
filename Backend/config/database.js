const { PrismaClient } = require("@prisma/client")
const winston = require("winston")

const prisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "event",
      level: "error",
    },
    {
      emit: "event",
      level: "info",
    },
    {
      emit: "event",
      level: "warn",
    },
  ],
})

// Log database queries in development
if (process.env.NODE_ENV === "development") {
  prisma.$on("query", (e) => {
    winston.info("Database Query:", {
      query: e.query,
      params: e.params,
      duration: `${e.duration}ms`,
    })
  })
}

prisma.$on("error", (e) => {
  winston.error("Database Error:", e)
})

module.exports = prisma
