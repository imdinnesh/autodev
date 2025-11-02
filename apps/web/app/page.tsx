"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ArrowRight, Github, Code2, Zap } from "lucide-react"

export default function Home() {
  const [email, setEmail] = useState("")
  const [isJoining, setIsJoining] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsJoining(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsJoining(false)
    setEmail("")
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="font-bold text-lg">AutoDev</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm hover:text-accent transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm hover:text-accent transition-colors">
              How It Works
            </a>
            <a href="#testimonials" className="text-sm hover:text-accent transition-colors">
              Testimonials
            </a>
          </div>
          <Button size="sm" variant="default">
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-linear-to-br from-accent/10 via-background to-background" />
          <motion.div
            className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{
              background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)",
            }}
            animate={{
              x: [0, 30, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
          />
          <motion.div
            className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{
              background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
            }}
            animate={{
              x: [0, -30, 0],
              y: [0, -30, 0],
            }}
            transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
          />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="mb-6">
            <span className="text-accent text-sm font-semibold">Welcome to the future of development</span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 text-balance leading-tight"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            Code, Debug, and Evolve — Asynchronously.
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-8 text-balance leading-relaxed"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            AutoDev reads your codebase, understands context, and solves issues while you focus on building.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <Button size="lg" className="gap-2">
              Get Early Access
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Three simple steps to asynchronous development</p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                step: "01",
                title: "Connect your repo",
                description: "Link your GitHub or GitLab repository to AutoDev in seconds.",
                icon: Github,
              },
              {
                step: "02",
                title: "Assign issues or tasks",
                description: "Describe what needs to be fixed or built, and let AutoDev understand your codebase.",
                icon: Zap,
              },
              {
                step: "03",
                title: "Get solutions asynchronously",
                description: "Receive pull requests and solutions while you continue building other features.",
                icon: ArrowRight,
              },
            ].map((item, idx) => {
              const Icon = item.icon
              return (
                <motion.div key={idx} variants={fadeInUp}>
                  <Card className="p-8 h-full hover:shadow-lg transition-shadow">
                    <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <div className="text-sm font-semibold text-accent mb-2">{item.step}</div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border bg-card/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground">Everything you need for autonomous code improvement</p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                title: "Deep code understanding",
                description:
                  "Reads entire repositories and understands complex architectures, dependencies, and patterns.",
              },
              {
                title: "Asynchronous execution",
                description: "Works independently on your issues. No waiting—get solutions delivered automatically.",
              },
              {
                title: "Secure sandboxed environment",
                description: "Your code stays safe. AutoDev runs in isolated environments with no data retention.",
              },
              {
                title: "Seamless GitHub & GitLab integration",
                description: "One-click setup. Creates branches, commits, and pull requests directly to your repos.",
              },
            ].map((feature, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-1 h-1 rounded-full bg-accent mt-2 shrink-0" />
                    <div>
                      <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Loved by developers</h2>
            <p className="text-xl text-muted-foreground">Join early adopters transforming their workflows</p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                quote: "AutoDev reduced our bug fixes by 60%. It understands our codebase better than we do.",
                author: "Alex Chen",
                role: "CTO, TechStartup",
              },
              {
                quote: "We shipped 3 major features while AutoDev handled routine maintenance. Game changer.",
                author: "Sarah Williams",
                role: "Lead Developer, CloudApp",
              },
              {
                quote: "The quality of pull requests is incredible. It feels like having a senior dev on the team.",
                author: "Marcus Johnson",
                role: "Engineering Lead, DataFlow",
              },
            ].map((testimonial, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="p-8 h-full flex flex-col justify-between hover:shadow-lg transition-shadow">
                  <p className="text-lg mb-6 text-muted-foreground italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA / Waitlist */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border bg-linear-to-b from-accent/5 via-background to-background">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Let AutoDev handle your next bug.</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join hundreds of developers already using AutoDev to ship faster.
            </p>

            <form onSubmit={handleJoinWaitlist} className="flex gap-3 mb-6">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
              <Button size="lg" disabled={isJoining} className="whitespace-nowrap">
                {isJoining ? "Joining..." : "Join Waitlist"}
              </Button>
            </form>

            <p className="text-sm text-muted-foreground">No credit card required. Start building smarter today.</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Docs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Social</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Discord
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-accent rounded-lg flex items-center justify-center">
                <Code2 className="w-4 h-4 text-accent-foreground" />
              </div>
              <span className="font-semibold">AutoDev</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 AutoDev. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
