import crypto from "crypto"

// Codeforces API authentication helpers
export const generateRandomString = (length = 6): string => {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length)
}

export const generateCodeforcesApiSignature = (
  methodName: string,
  randomString: string,
  secret: string,
  additionalParams: Record<string, string> = {},
): string => {
  // Create the string to hash in the format required by Codeforces API
  const paramsString = Object.entries({
    apiKey: process.env.CODEFORCES_API_KEY || "",
    time: Math.floor(Date.now() / 1000).toString(),
    ...additionalParams,
  })
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}=${value}`)
    .join("&")

  const stringToHash = `${randomString}/${methodName}?${paramsString}#${secret}`

  // Generate SHA512 hash
  return crypto.createHash("sha512").update(stringToHash).digest("hex")
}

// Date formatting helpers
export const formatDate = (dateString: string | number): string => {
  const date = new Date(dateString)
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const calculateTimeRemaining = (startTime: string | number): string => {
  const now = new Date()
  const start = new Date(startTime)
  const diff = start.getTime() - now.getTime()

  if (diff <= 0) return "Started"

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  return `${days}d ${hours}h ${minutes}m`
}

