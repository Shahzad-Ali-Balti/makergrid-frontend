import { Badge } from "@/types/UserProfile";

const dummyUserBadge: Badge[] = [
    {
      id: "123",
      name: "Pro Creator",
      description: "Awarded for uploading your first model",
      iconName: "ri-star-line",
    },
    {
      id: "124",
      name: "Top Seller",
      description: "Awarded for selling 100 models",
      iconName: "ri-money-dollar-circle-line",
    }
  ];
  

export const getMockUserBadge = async (): Promise<Badge[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(dummyUserBadge)
      }, 300) // Simulate network delay
    })
  }
      
