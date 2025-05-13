export type SingleModel = {
    modelUrl: string;
    fileFormat: 'stl' | 'obj' | 'gltf';
    title: string;
    userId: string;
    views: number;
    downloads: number;
    printReady: boolean;
    featured: boolean;
    category: string | null;
    tags: string[] | null;
    description: string | null;
    price: number; // in cents
    createdAt: string; // ISO string (or Date if you prefer)
  };
  