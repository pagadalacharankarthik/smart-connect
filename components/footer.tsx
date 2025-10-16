export function Footer() {
  return (
    <footer className="bg-background border-t border-border mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-2">SmartConnect</h3>
            <p className="text-sm text-muted-foreground">Connect, Create, and Manage Community Events</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/events" className="hover:text-primary transition">
                  Browse Events
                </a>
              </li>
              <li>
                <a href="/dashboard" className="hover:text-primary transition">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/my-certificates" className="hover:text-primary transition">
                  Certificates
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <p className="text-sm text-muted-foreground">
              Email: support@smartconnect.com
              <br />
              Phone: +1 (555) 123-4567
            </p>
          </div>
        </div>
        <div className="border-t border-border pt-6">
          <p className="text-sm text-muted-foreground text-center">
            Developed by{" "}
            <span className="font-semibold">
              P CHARAN KARTHIK, V MANISH REDDY, B V HITESH, V JAGADEESH, S UDAY KUMAR
            </span>
          </p>
          <p className="text-xs text-muted-foreground text-center mt-2">© 2025 SmartConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
