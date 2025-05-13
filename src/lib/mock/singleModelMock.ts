import { SingleModel } from "@/types/singleModel";

const dummyModel: SingleModel = {
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
};

export const getSingelMockModel = async (): Promise<SingleModel> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(dummyModel)
      }, 300) // Simulate network delay
    })
  }
      
