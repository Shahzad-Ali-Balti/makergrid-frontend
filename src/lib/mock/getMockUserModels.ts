import { UserModels } from "@/types/UserProfile";

const dummyUserModels: UserModels[] = [{
        id:123,
        modelUrl: "https://threejs.org/examples/models/stl/ascii/slotted_disk.stl",
        fileFormat: "stl",
        title: "Futuristic Hover Car STL Model",
        userId: "1",
        views: 1240,
        downloads: 345,
        printReady: false,
        featured: true,
        category: "Sci-Fi Vehicles",
        tags: ["hover car", "futuristic", "vehicle", "3D print"],
        description: "A detailed STL model of a futuristic hover car, optimized for 3D printing. Features aerodynamic curves, engine details, and a sleek sci-fi design.",
        price: 2499, // $24.99
        createdAt: "2025-04-26T10:30:00Z",
},{
  id:123,
  modelUrl: "https://threejs.org/examples/models/stl/ascii/slotted_disk.stl",
  fileFormat: "stl",
  title: "Futuristic Hover Car STL Model",
  userId: "1",
  views: 1240,
  downloads: 345,
  printReady: false,
  featured: true,
  category: "Sci-Fi Vehicles",
  tags: ["hover car", "futuristic", "vehicle", "3D print"],
  description: "A detailed STL model of a futuristic hover car, optimized for 3D printing. Features aerodynamic curves, engine details, and a sleek sci-fi design.",
  price: 2499, // $24.99
  createdAt: "2025-04-26T10:30:00Z",
},{
  id:123,
  modelUrl: "https://threejs.org/examples/models/stl/ascii/slotted_disk.stl",
  fileFormat: "stl",
  title: "Futuristic Hover Car STL Model",
  userId: "1",
  views: 1240,
  downloads: 345,
  printReady: false,
  featured: true,
  category: "Sci-Fi Vehicles",
  tags: ["hover car", "futuristic", "vehicle", "3D print"],
  description: "A detailed STL model of a futuristic hover car, optimized for 3D printing. Features aerodynamic curves, engine details, and a sleek sci-fi design.",
  price: 2499, // $24.99
  createdAt: "2025-04-26T10:30:00Z",
},{
  id:123,
  modelUrl: "https://threejs.org/examples/models/stl/ascii/slotted_disk.stl",
  fileFormat: "stl",
  title: "Futuristic Hover Car STL Model",
  userId: "1",
  views: 1240,
  downloads: 345,
  printReady: false,
  featured: true,
  category: "Sci-Fi Vehicles",
  tags: ["hover car", "futuristic", "vehicle", "3D print"],
  description: "A detailed STL model of a futuristic hover car, optimized for 3D printing. Features aerodynamic curves, engine details, and a sleek sci-fi design.",
  price: 2499, // $24.99
  createdAt: "2025-04-26T10:30:00Z",
},{
  id:123,
  modelUrl: "https://threejs.org/examples/models/stl/ascii/slotted_disk.stl",
  fileFormat: "stl",
  title: "Futuristic Hover Car STL Model",
  userId: "1",
  views: 1240,
  downloads: 345,
  printReady: false,
  featured: true,
  category: "Sci-Fi Vehicles",
  tags: ["hover car", "futuristic", "vehicle", "3D print"],
  description: "A detailed STL model of a futuristic hover car, optimized for 3D printing. Features aerodynamic curves, engine details, and a sleek sci-fi design.",
  price: 2499, // $24.99
  createdAt: "2025-04-26T10:30:00Z",
},{
  id:123,
  modelUrl: "https://threejs.org/examples/models/stl/ascii/slotted_disk.stl",
  fileFormat: "stl",
  title: "Futuristic Hover Car STL Model",
  userId: "1",
  views: 1240,
  downloads: 345,
  printReady: false,
  featured: true,
  category: "Sci-Fi Vehicles",
  tags: ["hover car", "futuristic", "vehicle", "3D print"],
  description: "A detailed STL model of a futuristic hover car, optimized for 3D printing. Features aerodynamic curves, engine details, and a sleek sci-fi design.",
  price: 2499, // $24.99
  createdAt: "2025-04-26T10:30:00Z",
}];

export const getMockModels = async (): Promise<UserModels[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(dummyUserModels)
      }, 300) // Simulate network delay
    })
  }
      
