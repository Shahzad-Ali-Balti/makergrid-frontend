import { Generation } from "@/types/GenerationType"
const GenerationModelData: Generation[] = [{
    id: "12346",
    prompt: "A medieval wizard's tower floating above a cliff.",
    style: "fantasy",
    complexity: "Complex",
},
{
    id: "12346",
    prompt: "A medieval wizard's tower floating above a cliff.",
    style: "fantasy",
    complexity: "Complex",
},{
    id: "12346",
    prompt: "A medieval wizard's tower floating above a cliff.",
    style: "fantasy",
    complexity: "Complex",
},{
    id: "12346",
    prompt: "A medieval wizard's tower floating above a cliff.",
    style: "fantasy",
    complexity: "Complex",
}]

export const getMockGen = async (): Promise<Generation[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(GenerationModelData)
      }, 300) // Simulate network delay
    })
  }
