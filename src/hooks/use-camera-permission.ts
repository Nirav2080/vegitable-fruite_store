import { useCallback, useEffect, useState } from 'react'

export type CameraPermissionState = 'prompt' | 'granted' | 'denied' | 'unsupported'
export type CameraFacingMode = 'environment' | 'user'

interface UseCameraPermissionResult {
  permission: CameraPermissionState
  isRequesting: boolean
  error: string | null
  requestPermission: (facingMode?: CameraFacingMode) => Promise<boolean>
  checkPermission: () => Promise<CameraPermissionState>
  reportError: (error: unknown) => void
  clearError: () => void
}

function getCameraErrorMessage(error: unknown): string {
  const name = error instanceof DOMException ? error.name : ''

  if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
    return "Camera access was denied. Click 'Allow Camera' to open the browser permission popup."
  }
  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
    return 'No camera was found on this device.'
  }
  if (name === 'NotReadableError' || name === 'TrackStartError') {
    return 'Camera is already in use by another application.'
  }
  return 'Unable to access camera. Please check camera permissions.'
}

function mapPermissionState(state: PermissionState): CameraPermissionState {
  if (state === 'granted') return 'granted'
  if (state === 'denied') return 'denied'
  return 'prompt'
}

export const useCameraPermission = (): UseCameraPermissionResult => {
  const [permission, setPermission] = useState<CameraPermissionState>('prompt')
  const [isRequesting, setIsRequesting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkPermission = useCallback(async (): Promise<CameraPermissionState> => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setPermission('unsupported')
      return 'unsupported'
    }

    try {
      const result = await navigator.permissions.query({
        name: 'camera' as PermissionName,
      })
      const state = mapPermissionState(result.state)
      setPermission(state)
      return state
    } catch {
      setPermission('prompt')
      return 'prompt'
    }
  }, [])

  const requestPermission = useCallback(async (facingMode: CameraFacingMode = 'environment'): Promise<boolean> => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setPermission('unsupported')
      setError('Camera is not supported on this device or browser.')
      return false
    }

    setIsRequesting(true)
    setError(null)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facingMode } },
        audio: false,
      })

      stream.getTracks().forEach((track) => track.stop())

      setPermission('granted')
      return true
    } catch (err) {
      const name = err instanceof DOMException ? err.name : ''

      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setPermission('denied')
      }

      setError(getCameraErrorMessage(err))
      return false
    } finally {
      setIsRequesting(false)
    }
  }, [])

  const reportError = useCallback((mediaError: unknown) => {
    const name = mediaError instanceof DOMException ? mediaError.name : ''
    if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
      setPermission('denied')
    }
    setError(getCameraErrorMessage(mediaError))
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  useEffect(() => {
    let permissionStatus: PermissionStatus | null = null

    const handleChange = () => {
      if (!permissionStatus) return
      setPermission(mapPermissionState(permissionStatus.state))
    }

    const init = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setPermission('unsupported')
        return
      }

      try {
        permissionStatus = await navigator.permissions.query({
          name: 'camera' as PermissionName,
        })
        setPermission(mapPermissionState(permissionStatus.state))
        permissionStatus.addEventListener('change', handleChange)
      } catch {
        setPermission('prompt')
      }
    }

    void init()

    return () => {
      permissionStatus?.removeEventListener('change', handleChange)
    }
  }, [])

  return {
    permission,
    isRequesting,
    error,
    requestPermission,
    checkPermission,
    reportError,
    clearError,
  }
}
