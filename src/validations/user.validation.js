import {z} from "zod";

export const updateMyProfileBodySchema=z.object({
    name:z.string().nonempty("Name is Required"),
    phone:z.string().length(10,"Phone should be 10 digits long")
});

export const addAddressBodySchema = z.object({
    fullName: z.string().nonempty("Name is Required"),
    phone: z.string().length(10, "Phone number should be 10 digits long"),
    addressLine1: z.string().min(5).max(255),
    addressLine2: z.string().max(255).optional(),
    city: z.string().nonempty("City is required"),
    state: z.string().nonempty("State is required"),
    pincode: z.string().length(6, "Pincode should be 6 digits long"),
    country: z.string().optional(),
    isDefault: z.boolean().optional()
});

export const updateAddressIdSchema=z.object({
    addressId:z.string().regex(/^[0-9a-fA-F]{24}$/)
});

export const deleteAddressIdSchema=z.object({
    addressId:z.string().regex(/^[0-9a-fA-F]{24}$/)
});

export const setDefaultAddressIdSchema=z.object({
    addressId:z.string().regex(/^[0-9a-fA-F]{24}$/)
});