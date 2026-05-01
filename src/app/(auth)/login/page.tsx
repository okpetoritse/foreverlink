import Link from 'next/link';
import { signIn } from '@/auth'; // Imports the engine

export default function LoginPage() {
  return (
    <main 
      className="flex min-h-screen items-center justify-center p-6 relative bg-cover bg-center"
      style={{ backgroundImage: "url('/hero-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-[#0A192F]/85 z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/15 blur-[100px] rounded-full z-0 pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md bg-[#0A192F]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-[#D4AF37] mb-2">Welcome Back</h1>
          <p className="text-[#F5F5DC]/70 text-sm">Sign in to access your family's time vaults and legacy tree.</p>
        </div>

        <div className="space-y-4">
          {/* Google Login Form */}
          <form
            action={async () => {
              "use server"
              await signIn("google", { redirectTo: "/dashboard" })
            }}
          >
            <button type="submit" className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-medium py-3 rounded-lg hover:bg-gray-200 transition-colors shadow-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </form>

          {/* Facebook Login Form */}
          <form
            action={async () => {
              "use server"
              await signIn("facebook", { redirectTo: "/dashboard" })
            }}
          >
            <button type="submit" className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white font-medium py-3 rounded-lg hover:bg-[#1865CE] transition-colors shadow-sm">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continue with Facebook
            </button>
          </form>
        </div>

        <div className="mt-8 text-center text-sm text-[#F5F5DC]/40">
          By continuing, you agree to our Legacy Preservation Terms.
        </div>
        
        <div className="mt-6 text-center">
          <Link href="/" className="text-[#D4AF37] hover:text-white transition-colors text-sm font-medium">
            ← Back to the vault
          </Link>
        </div>
      </div>
    </main>
  );
}