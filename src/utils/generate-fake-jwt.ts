import { app } from '@/app'

export function generateFakeJwt(payload: { sub: string }) {
  return app.jwt.sign(payload)
}
