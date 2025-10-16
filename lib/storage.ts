// LocalStorage utility functions for SmartConnect

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: "public" | "organization"
  mobile?: string
  age?: number
  organizationType?: string
  contactPerson?: string
  createdAt: string
}

export interface Event {
  id: string
  title: string
  description: string
  category: string
  location: string
  startDate: string
  endDate: string
  eventType: "online" | "offline"
  organizerId: string
  posterUrl?: string
  contactInfo: {
    name: string
    email: string
    phone: string
  }
  createdAt: string
}

export interface Participant {
  id: string
  userId: string
  eventId: string
  status: "registered" | "attended"
  registeredAt: string
}

export interface Certificate {
  id: string
  userId: string
  eventId: string
  pdfData: string
  generatedAt: string
}

export interface Feedback {
  id: string
  eventId: string
  userId: string
  rating: number
  comment: string
  createdAt: string
}

export interface Discussion {
  id: string
  eventId: string
  userId: string
  message: string
  createdAt: string
}

// Initialize storage
export const initializeStorage = () => {
  if (typeof window === "undefined") return

  if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify([]))
  }
  if (!localStorage.getItem("events")) {
    localStorage.setItem("events", JSON.stringify([]))
  }
  if (!localStorage.getItem("participants")) {
    localStorage.setItem("participants", JSON.stringify([]))
  }
  if (!localStorage.getItem("certificates")) {
    localStorage.setItem("certificates", JSON.stringify([]))
  }
  if (!localStorage.getItem("feedbacks")) {
    localStorage.setItem("feedbacks", JSON.stringify([]))
  }
  if (!localStorage.getItem("discussions")) {
    localStorage.setItem("discussions", JSON.stringify([]))
  }
}

// User operations
export const getUsers = (): User[] => {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("users")
  return data ? JSON.parse(data) : []
}

export const addUser = (user: Omit<User, "id" | "createdAt">): User => {
  const users = getUsers()
  const newUser: User = {
    ...user,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  users.push(newUser)
  localStorage.setItem("users", JSON.stringify(users))
  return newUser
}

export const getUserById = (id: string): User | undefined => {
  return getUsers().find((u) => u.id === id)
}

export const updateUser = (id: string, updates: Partial<User>): User | undefined => {
  const users = getUsers()
  const index = users.findIndex((u) => u.id === id)
  if (index === -1) return undefined
  users[index] = { ...users[index], ...updates }
  localStorage.setItem("users", JSON.stringify(users))
  return users[index]
}

// Event operations
export const getEvents = (): Event[] => {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("events")
  return data ? JSON.parse(data) : []
}

export const addEvent = (event: Omit<Event, "id" | "createdAt">): Event => {
  const events = getEvents()
  const newEvent: Event = {
    ...event,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  events.push(newEvent)
  localStorage.setItem("events", JSON.stringify(events))
  return newEvent
}

export const getEventById = (id: string): Event | undefined => {
  return getEvents().find((e) => e.id === id)
}

export const updateEvent = (id: string, updates: Partial<Event>): Event | undefined => {
  const events = getEvents()
  const index = events.findIndex((e) => e.id === id)
  if (index === -1) return undefined
  events[index] = { ...events[index], ...updates }
  localStorage.setItem("events", JSON.stringify(events))
  return events[index]
}

// Participant operations
export const getParticipants = (): Participant[] => {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("participants")
  return data ? JSON.parse(data) : []
}

export const addParticipant = (participant: Omit<Participant, "id" | "registeredAt">): Participant => {
  const participants = getParticipants()
  const newParticipant: Participant = {
    ...participant,
    id: Date.now().toString(),
    registeredAt: new Date().toISOString(),
  }
  participants.push(newParticipant)
  localStorage.setItem("participants", JSON.stringify(participants))
  return newParticipant
}

export const getParticipantsByEvent = (eventId: string): Participant[] => {
  return getParticipants().filter((p) => p.eventId === eventId)
}

export const getParticipantsByUser = (userId: string): Participant[] => {
  return getParticipants().filter((p) => p.userId === userId)
}

export const updateParticipant = (id: string, updates: Partial<Participant>): Participant | undefined => {
  const participants = getParticipants()
  const index = participants.findIndex((p) => p.id === id)
  if (index === -1) return undefined
  participants[index] = { ...participants[index], ...updates }
  localStorage.setItem("participants", JSON.stringify(participants))
  return participants[index]
}

export const isUserRegistered = (userId: string, eventId: string): boolean => {
  return getParticipants().some((p) => p.userId === userId && p.eventId === eventId)
}

// Certificate operations
export const getCertificates = (): Certificate[] => {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("certificates")
  return data ? JSON.parse(data) : []
}

export const addCertificate = (cert: Omit<Certificate, "id" | "generatedAt">): Certificate => {
  const certificates = getCertificates()
  const newCert: Certificate = {
    ...cert,
    id: Date.now().toString(),
    generatedAt: new Date().toISOString(),
  }
  certificates.push(newCert)
  localStorage.setItem("certificates", JSON.stringify(certificates))
  return newCert
}

export const getCertificatesByUser = (userId: string): Certificate[] => {
  return getCertificates().filter((c) => c.userId === userId)
}

// Feedback operations
export const getFeedbacks = (): Feedback[] => {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("feedbacks")
  return data ? JSON.parse(data) : []
}

export const addFeedback = (feedback: Omit<Feedback, "id" | "createdAt">): Feedback => {
  const feedbacks = getFeedbacks()
  const newFeedback: Feedback = {
    ...feedback,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  feedbacks.push(newFeedback)
  localStorage.setItem("feedbacks", JSON.stringify(feedbacks))
  return newFeedback
}

export const getFeedbacksByEvent = (eventId: string): Feedback[] => {
  return getFeedbacks().filter((f) => f.eventId === eventId)
}

export const getAverageRating = (eventId: string): number => {
  const feedbacks = getFeedbacksByEvent(eventId)
  if (feedbacks.length === 0) return 0
  const sum = feedbacks.reduce((acc, f) => acc + f.rating, 0)
  return sum / feedbacks.length
}

// Discussion operations
export const getDiscussions = (): Discussion[] => {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("discussions")
  return data ? JSON.parse(data) : []
}

export const addDiscussion = (discussion: Omit<Discussion, "id" | "createdAt">): Discussion => {
  const discussions = getDiscussions()
  const newDiscussion: Discussion = {
    ...discussion,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  discussions.push(newDiscussion)
  localStorage.setItem("discussions", JSON.stringify(discussions))
  return newDiscussion
}

export const getDiscussionsByEvent = (eventId: string): Discussion[] => {
  return getDiscussions().filter((d) => d.eventId === eventId)
}

// Session management
export const setCurrentUser = (user: User) => {
  localStorage.setItem("currentUser", JSON.stringify(user))
}

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null
  const data = localStorage.getItem("currentUser")
  return data ? JSON.parse(data) : null
}

export const logout = () => {
  localStorage.removeItem("currentUser")
}
