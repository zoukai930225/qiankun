import { nextTick as tick } from 'vue'

export async function nextFrameTick() {
  await tick()
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
}
