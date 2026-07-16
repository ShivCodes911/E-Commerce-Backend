import productModel from "../models/product.model.js";

export async function reduceStockForOrder(order){
for (const item of order.items){

    // Loop through each ordered product and decrease its stock in the database.
    const updatedProduct=await productModel.findOneAndUpdate(
    { _id: item.product ,
        stock:{$gte:item.quantity}

        //gte => stock is greater than or equal to the ordered quantity.
    },
    {
        $inc: {
            stock: -item.quantity
        }
        //inc=>increment
    },{
        new:true
    }
);

    if (!updatedProduct) {
            throw new Error(`Insufficient stock for product ${item.product}`);
        }

if(updatedProduct.stock===0){
    updatedProduct.isActive=false
    await updatedProduct.save();
}



  }
};


export async function restoreStockForOrder(order){
    for (const item of order.items) {
    const updatedProduct = await productModel.findOneAndUpdate(
        {
            _id: item.product
        },
        {
            $inc: {
                stock: item.quantity
            },
            $set: {
                isActive: true
            }
        },
        {
            new: true
        }
    );

    if(!updatedProduct){
        throw new Error(`error occured`)
        
    }
}


}