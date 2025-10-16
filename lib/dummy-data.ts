import type { Event, Feedback, Discussion, User, Participant } from "./storage"

export const initializeDummyData = () => {
  if (typeof window === "undefined") return

  // Check if dummy data already exists
  const events = JSON.parse(localStorage.getItem("events") || "[]")
  if (events.length > 0) return

  // Create dummy organization user
  const dummyOrg: User = {
    id: "org-1",
    name: "Tech Community India",
    email: "tech@community.com",
    password: "password123",
    role: "organization",
    organizationType: "Tech Community",
    contactPerson: "Rajesh Kumar",
    createdAt: new Date().toISOString(),
  }

  const demoPublicUsers: User[] = [
    {
      id: "user-demo-1",
      name: "John Developer",
      email: "john@example.com",
      password: "password123",
      role: "public",
      mobile: "+91-9876543220",
      age: 25,
      createdAt: new Date().toISOString(),
    },
    {
      id: "user-demo-2",
      name: "Sarah Designer",
      email: "sarah@example.com",
      password: "password123",
      role: "public",
      mobile: "+91-9876543221",
      age: 28,
      createdAt: new Date().toISOString(),
    },
    {
      id: "user-demo-3",
      name: "Mike Engineer",
      email: "mike@example.com",
      password: "password123",
      role: "public",
      mobile: "+91-9876543222",
      age: 30,
      createdAt: new Date().toISOString(),
    },
  ]

  // Create dummy events
  const dummyEvents: Event[] = [
    {
      id: "event-1",
      title: "Web Development Bootcamp 2025",
      description:
        "Learn modern web development with React, Next.js, and Tailwind CSS. This comprehensive bootcamp covers frontend and backend development with hands-on projects.",
      category: "Technology",
      location: "Bangalore, India",
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      eventType: "offline",
      organizerId: "org-1",
      posterUrl: "/web-development-bootcamp.jpg",
      contactInfo: {
        name: "Rajesh Kumar",
        email: "rajesh@techcommunity.com",
        phone: "+91-9876543210",
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: "event-2",
      title: "AI & Machine Learning Workshop",
      description:
        "Explore the fundamentals of AI and ML. Learn about neural networks, deep learning, and practical applications using Python and TensorFlow.",
      category: "Technology",
      location: "Online",
      startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      eventType: "online",
      organizerId: "org-1",
      posterUrl: "/ai-machine-learning.jpg",
      contactInfo: {
        name: "Priya Singh",
        email: "priya@techcommunity.com",
        phone: "+91-9876543211",
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: "event-3",
      title: "Cloud Computing Essentials",
      description:
        "Master AWS, Azure, and Google Cloud. Learn about cloud infrastructure, deployment, and best practices for scalable applications.",
      category: "Technology",
      location: "Hyderabad, India",
      startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
      eventType: "offline",
      organizerId: "org-1",
      posterUrl: "/cloud-computing.jpg",
      contactInfo: {
        name: "Amit Patel",
        email: "amit@techcommunity.com",
        phone: "+91-9876543212",
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: "event-4",
      title: "Mobile App Development with Flutter",
      description:
        "Build beautiful cross-platform mobile applications using Flutter. Learn Dart programming and create apps for iOS and Android.",
      category: "Technology",
      location: "Online",
      startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
      eventType: "online",
      organizerId: "org-1",
      posterUrl: "/flutter-mobile-app.jpg",
      contactInfo: {
        name: "Neha Sharma",
        email: "neha@techcommunity.com",
        phone: "+91-9876543213",
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: "event-5",
      title: "DevOps & CI/CD Pipeline Mastery",
      description:
        "Learn Docker, Kubernetes, and CI/CD pipelines. Automate your deployment process and manage containerized applications efficiently.",
      category: "Technology",
      location: "Pune, India",
      startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000).toISOString(),
      eventType: "offline",
      organizerId: "org-1",
      posterUrl: "/devops-cicd.jpg",
      contactInfo: {
        name: "Vikram Singh",
        email: "vikram@techcommunity.com",
        phone: "+91-9876543214",
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: "event-6",
      title: "Data Science & Analytics Bootcamp",
      description:
        "Dive into data science with Python, pandas, and scikit-learn. Learn data visualization, statistical analysis, and predictive modeling.",
      category: "Technology",
      location: "Online",
      startDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
      eventType: "online",
      organizerId: "org-1",
      posterUrl: "/data-science.jpg",
      contactInfo: {
        name: "Ananya Gupta",
        email: "ananya@techcommunity.com",
        phone: "+91-9876543215",
      },
      createdAt: new Date().toISOString(),
    },
  ]

  // Save dummy organization and public users
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  if (!users.find((u: User) => u.id === "org-1")) {
    users.push(dummyOrg)
  }
  demoPublicUsers.forEach((user) => {
    if (!users.find((u: User) => u.id === user.id)) {
      users.push(user)
    }
  })
  localStorage.setItem("users", JSON.stringify(users))

  // Save dummy events
  localStorage.setItem("events", JSON.stringify(dummyEvents))

  const dummyParticipants: Participant[] = [
    {
      id: "participant-1",
      userId: "user-demo-1",
      eventId: "event-1",
      status: "registered",
      registeredAt: new Date().toISOString(),
    },
    {
      id: "participant-2",
      userId: "user-demo-2",
      eventId: "event-2",
      status: "attended",
      registeredAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "participant-3",
      userId: "user-demo-3",
      eventId: "event-3",
      status: "registered",
      registeredAt: new Date().toISOString(),
    },
  ]

  localStorage.setItem("participants", JSON.stringify(dummyParticipants))

  // Create some dummy feedback for events
  const dummyFeedbacks: Feedback[] = [
    {
      id: "feedback-1",
      eventId: "event-1",
      userId: "user-demo-1",
      rating: 5,
      comment: "Excellent bootcamp! Learned a lot about React and Next.js.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "feedback-2",
      eventId: "event-1",
      userId: "user-demo-2",
      rating: 4,
      comment: "Great content, but could use more hands-on projects.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "feedback-3",
      eventId: "event-2",
      userId: "user-demo-3",
      rating: 5,
      comment: "Amazing workshop on AI and ML. Very informative!",
      createdAt: new Date().toISOString(),
    },
  ]

  localStorage.setItem("feedbacks", JSON.stringify(dummyFeedbacks))

  // Create some dummy discussions
  const dummyDiscussions: Discussion[] = [
    {
      id: "discussion-1",
      eventId: "event-1",
      userId: "user-demo-1",
      message: "Looking forward to this bootcamp! Anyone else attending?",
      createdAt: new Date().toISOString(),
    },
    {
      id: "discussion-2",
      eventId: "event-1",
      userId: "user-demo-2",
      message: "Will there be any prerequisites for this bootcamp?",
      createdAt: new Date().toISOString(),
    },
    {
      id: "discussion-3",
      eventId: "event-2",
      userId: "user-demo-3",
      message: "This AI workshop looks amazing! Can't wait to learn more.",
      createdAt: new Date().toISOString(),
    },
  ]

  localStorage.setItem("discussions", JSON.stringify(dummyDiscussions))
}
