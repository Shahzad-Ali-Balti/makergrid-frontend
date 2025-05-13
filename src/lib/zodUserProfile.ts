import { z } from "zod";

// User schema
export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  displayName: z.string().nullable(),
  bio: z.string().nullable(),
  creatorLevel: z.string(),
  joinedAt: z.string(), // ISO date string
});

// Single Model schema
export const ModelSchema = z.object({
  id: z.string(),
  title: z.string(),
  thumbnailUrl: z.string().nullable(),
  fileFormat: z.enum(["stl", "obj", "gltf"]),
  views: z.number(),
  downloads: z.number(),
  price: z.number(), // In cents
  createdAt: z.string(), // ISO date string
  featured: z.boolean(),
});

// Badge schema
export const BadgeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  iconName: z.string(), // e.g., "ri-award-line"
});

// Full array schemas
export const UserModelsSchema = z.array(ModelSchema);
export const UserBadgesSchema = z.array(BadgeSchema);
export const AllBadgesSchema = z.array(BadgeSchema);

export const ProfilePageDataSchema = z.object({
    user: UserSchema,
    userModels: UserModelsSchema,
    userBadges: UserBadgesSchema,
    allBadges: AllBadgesSchema,
  });
  
