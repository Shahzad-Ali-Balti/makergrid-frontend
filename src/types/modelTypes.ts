export interface Model {
  id: string
  title: string
  description?: string
  thumbnailUrl?: string
  downloads:string
  category: 'Architecture' | 'Characters' | 'Props' | 'Vehicles' | 'Nature' | string
  printReady: boolean
  fileFormat: 'STL' | 'OBJ' | 'FBX' | string
  price: number
  featured: boolean
  views: number
  userId: string
  creatorName:string
  createdAt:string
}