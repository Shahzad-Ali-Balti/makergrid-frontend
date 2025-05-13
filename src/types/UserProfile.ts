export interface UserProfile  {
    id: number,
    username: string,
    email?:string
    displayName: string,
    bio?: string,
    creatorLevel: string,
    joinedAt: string, // ISO date string
    avatar?:string
}

export interface UserModels { 
    id:number
    title?:string
    thumbnailUrl?:string
    fileFormat?:string
    price:number
    views:number
    modelUrl: string
    userId: string
    downloads: number
    printReady: boolean
    featured: boolean
    category: string | null
    tags: string[] | null;
    description: string | null
    createdAt: string
}

export type Badge = {
    id: string;
    name: string;
    description: string;
    iconName: string;
  };
  