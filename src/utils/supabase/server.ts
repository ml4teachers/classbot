import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies() // `cookies()` muss await verwendet werden, da es ein Promise zurückgibt

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookie = await cookieStore.get(name)
          return cookie?.value || null
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            await cookieStore.set({
              name,
              value,
              httpOnly: options.httpOnly ?? true,
              secure: options.secure ?? true,
              sameSite: options.sameSite ?? 'lax',
              ...options,
            })
          } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
              console.warn(
                `[Supabase Cookies] Failed to set cookie "${name}". This might be due to running in a server component. Error:`,
                error
              )
            }
          }
        },
        async remove(name: string, options: CookieOptions = {}) {
          try {
            await cookieStore.set({
              name,
              value: '',
              httpOnly: options.httpOnly ?? true,
              secure: options.secure ?? true,
              sameSite: options.sameSite ?? 'lax',
              maxAge: -1,
              ...options,
            })
          } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
              console.warn(
                `[Supabase Cookies] Failed to remove cookie "${name}". This might be due to running in a server component. Error:`,
                error
              )
            }
          }
        },
      },
    }
  )
}