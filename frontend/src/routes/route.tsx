import { Button } from '@/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Calendar, ExternalLink, Github, ListOrdered, LogIn, Mail, UserPlus } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="flex min-h-screen flex-col">
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <Mail className="h-5 w-5" />
          <span>EmailSequence</span>
        </div>
        <nav className="flex items-center gap-4">
          <a
            href="https://github.com/LohitNimbagal/email-sequence-tool"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
          </a>
          <Button size="sm" asChild>
            <Link to="/login">
              Login
            </Link>
          </Button>
        </nav>
      </div>
    </header>

    <main className="flex-1">
      <section className="container py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">Email Sequence Platform</h1>
            <p className="mt-4 text-xl text-muted-foreground">Create and schedule email sequences with ease</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* How to use / Demo steps */}
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="mb-6 text-2xl font-semibold">How to Use</h2>

              <div className="space-y-6">
                <div id="register-section" className="flex items-start gap-3 scroll-mt-20">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <UserPlus className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium">1. Register an account</h3>
                    <p className="text-sm text-muted-foreground">Create a new account with your email and password</p>
                  </div>
                </div>

                <div id="login-section" className="flex items-start gap-3 scroll-mt-20">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <LogIn className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium">2. Login to your account</h3>
                    <p className="text-sm text-muted-foreground">
                      Sign in using your credentials to access the dashboard
                    </p>
                  </div>
                </div>

                <div id="create-section" className="flex items-start gap-3 scroll-mt-20">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <ListOrdered className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium">3. Create a sequence</h3>
                    <p className="text-sm text-muted-foreground">
                      Design your email sequence with multiple steps and personalized content
                    </p>
                  </div>
                </div>

                <div id="schedule-section" className="flex items-start gap-3 scroll-mt-20">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium">4. Schedule emails</h3>
                    <p className="text-sm text-muted-foreground">
                      Set up timing and triggers for your email sequence to be sent automatically
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Button className="w-full" asChild>
                  <Link to="/login">
                    Get Started
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer className="border-t py-6">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} EmailSequence. All rights reserved.
        </p>
        <a
          href="https://lohitnimbagal.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
        >
          Created by <span className="font-semibold">Lohit Nimbagal</span>
          <ExternalLink className='w-4 h-4' />
        </a>
      </div>
    </footer>
  </div>
}
