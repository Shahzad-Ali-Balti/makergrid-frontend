import { STLExporter } from "three-stdlib"
import * as THREE from "three"

export function downloadSTL(object: THREE.Object3D, filename = "model.stl") {
  const exporter = new STLExporter()
  const stlData = exporter.parse(object, { binary: false })

  const blob = new Blob([stlData], { type: "text/plain" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()

  URL.revokeObjectURL(url)
}

export const getSTLFilename = (prefix = "model") => {
    const randomStr = Math.random().toString(36).substring(2, 8)
    return `${prefix}_${randomStr}.stl`
  }

  export const getGLBFilename = (prefix = "model") => {
    const randomStr = Math.random().toString(36).substring(2, 8)
    return `${prefix}_${randomStr}.glb`
  }

export const downloadGLB = async (glbUrl: string, filename?: string) => {
    try {
      const response = await fetch(glbUrl)
  
      if (!response.ok) {
        throw new Error(`Failed to fetch GLB: ${response.statusText}`)
      }
  
      const blob = await response.blob()
  
      // Use the last segment of the URL if no filename is given
      const defaultName = glbUrl.split('/').pop() || 'model.glb'
      const finalName = filename || defaultName
  
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = finalName
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('❌ GLB download failed:', error)
      alert('Failed to download GLB file.')
    }
  }
  
  