import {z} from "zod";

export const createStoreBodySchema=z.object({
    name:z.string().trim().min(2,"Store name is required and atleast contain 3 letters"),
    description:z.string().trim().optional()
});


// see again this part !!!
export const updateStoreBodySchema = createStoreBodySchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field is required",
  }
);