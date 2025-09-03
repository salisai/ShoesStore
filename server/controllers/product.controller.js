import Products from "../models/product.model.js";
import ApiError from "../utils/ErrorHandler.utils.js"
import asyncHandler from "../utils/AsynHandler.util.js";
import ApiResponse from "../utils/ApiResponse.util.js";


//fetch all projects 
export const getProducts = asyncHandler(async (req, res) => {
    const products = await Products.find();
    
    return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully"));

})

//get a specific product
export const getProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Products.findById(id);
    
    if (!product) {
        return res.status(400).json({ message: "Product doesn't exist." })
    }
    
    return res 
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"))

    
})


//Get products by Category
export const getByCategory = asyncHandler(async (req, res) => {
    const { category } = req.params;
    const products = await Products.find({ category });

    return res
        .status(200)
        .json(new ApiResponse(200, products, "Products by category fetched successfully"));
});



//Get search results
export const searchProducts = asyncHandler(async (req, res) => {
    let query = req.query.q ? req.query.q.trim() : '';

    if (query.length === 0) {
        throw new ApiError(400, "Empty search field");
    }

    if (query.includes('sneakers')) {
        query = query.replace('sneakers', 'sneaker');
    }

    // Normalize keywords
    query = query.replace(/kids|boys|girls/gi, "child");
    query = query.replace(/mens/gi, "men");
    query = query.replace(/womens/gi, "women");
    query = query.replace(/\b(shoe|shoes)\b/gi, ' ').trim();
    query = query.replace(/'/g, '');

    const terms = query.split(/\s+/);
    const searchQuery = {
        $or: [
            ...terms.map(term => ({
                $or: [
                    { title: { $regex: term, $options: "i" } },
                    { brand: { $regex: term, $options: "i" } },
                    { category: { $in: term } }
                ]
            }))
        ]
    };

    const results = await Products.find(searchQuery);

    return res
        .status(200)
        .json(new ApiResponse(200, results, "Search results fetched successfully"));
});


export const filterProducts = asyncHandler(async (req, res) => {
    const { brand, rating, category, price, discount } = req.query;
    const filter = {};

    if (brand) filter.brand = new RegExp(brand, 'i');

    if (rating) {
        const ratingValue = parseFloat(rating);
        if (!isNaN(ratingValue) && ratingValue >= 1 && ratingValue <= 5) {
            filter.rating = { $gte: ratingValue };
        }
    }

    if (category) {
        if (category === "Unisex") filter.category = "adult";
        else if (category === "Kids") filter.category = "child";
        else filter.category = category.toLowerCase();
    }

    if (price) {
        const priceRangeMatch = price.match(/₹(\d+)-₹(\d+)/);
        if (priceRangeMatch) {
            const minPrice = parseFloat(priceRangeMatch[1].replace(',', ''));
            const maxPrice = parseFloat(priceRangeMatch[2].replace(',', ''));
            filter.sellPrice = { $gte: minPrice, $lte: maxPrice };
        } else if (price === "₹3000+") {
            filter.sellPrice = { $gte: 3000 };
        }
    }

    if (discount) {
        const discountMatch = discount.match(/(\d+)%/);
        if (discountMatch) {
            filter.discount = { $gte: parseInt(discountMatch[1], 10) };
        }
    }

    const result = await Products.find(filter);

    if (result.length === 0) {
        throw new ApiError(404, "No products found matching the criteria");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, result, "Filtered products fetched successfully"));
});



export const listOfProducts = asyncHandler(async (req, res) => {
    const { list } = req.params;
    const idArray = list.split(',').map(id => id.trim());

    if (idArray.length === 0) {
        throw new ApiError(400, "No product IDs provided");
    }

    const result = await Products.find({ _id: { $in: idArray } });

    if (result.length === 0) {
        throw new ApiError(404, "Products not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, result, "Products list fetched successfully"));
});
