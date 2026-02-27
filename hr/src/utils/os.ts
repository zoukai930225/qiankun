export type OSName = 'windows' | 'macos' | 'ios' | 'android' | 'linux' | 'chromeos' | 'unknown'

export function getOS(): OSName {
  let os: OSName = 'unknown'
  if (typeof navigator !== 'undefined') {
    const nav: any = navigator as any
    const platform = nav.userAgentData?.platform || navigator.platform || ''
    const ua = navigator.userAgent || ''
    const p = String(platform).toLowerCase()
    const u = String(ua).toLowerCase()

    // 优先使用 UA-CH
    if (nav.userAgentData?.platform) {
      const v = nav.userAgentData.platform.toLowerCase()
      if (v.includes('windows')) os = 'windows'
      else if (v.includes('mac')) os = 'macos'
      else if (v.includes('ios')) os = 'ios'
      else if (v.includes('android')) os = 'android'
      else if (v.includes('chrome os')) os = 'chromeos'
      else if (v.includes('linux')) os = 'linux'
    }

    if (os === 'unknown') {
      if (/cros/.test(u)) os = 'chromeos'
      else if (/android/.test(u)) os = 'android'
      else {
        const isIOS =
          /iphone|ipad|ipod/.test(u) || (p === 'macintel' && (navigator as any).maxTouchPoints > 1)
        if (isIOS) os = 'ios'
        else if (/win/.test(p) || /windows/.test(u)) os = 'windows'
        else if (/mac/.test(p) || /mac os x/.test(u)) os = 'macos'
        else if (/linux/.test(p) || /linux/.test(u)) os = 'linux'
      }
    }
  }

  const icon =
    os === 'windows'
      ? '🪟'
      : os === 'macos'
        ? '🍎'
        : os === 'linux'
          ? '🐧'
          : os === 'android'
            ? '🤖'
            : os === 'ios'
              ? '📱'
              : os === 'chromeos'
                ? '🧪'
                : '💻'
  console.log(
    '%c OS %c ' + icon + ' ' + os,
    'background:#0064ff;color:#fff;border-radius:4px 0 0 4px;padding:2px 6px;font-weight:600',
    'background:#f0f6ff;color:#0064ff;border-radius:0 4px 4px 0;padding:2px 6px'
  )

  return os
}

export function isWindows() {
  return getOS() === 'windows'
}

export function isMac() {
  return getOS() === 'macos'
}

export function isIOS() {
  return getOS() === 'ios'
}

export function isAndroid() {
  return getOS() === 'android'
}

export function isChromeOS() {
  return getOS() === 'chromeos'
}

export function isLinux() {
  return getOS() === 'linux'
}
