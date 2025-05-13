import {UserProfile} from "@/types/UserProfile"


const mockUser:UserProfile={
    id: 2,
    bio:"Goku Here",
    email: "shahzadalibalti216@gmail.com",
    username: "Goku",
    avatar:"/assets/MakerGrid_Blue_Background",
    displayName:"GOKU",
    creatorLevel: "Master Modeler",
    joinedAt: "24 April", // ISO date string
}
export const getMockUser = async (): Promise<UserProfile> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockUser)
      }, 300) // Simulate network delay
    })
  }