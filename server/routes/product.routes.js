import express from "express";
import {
    addProduct,
    filterProducts,
    getBestSellers,
    getByCategory,
    getProduct,
    getProducts,
    getTopRated,
    listOfProducts,
    searchProducts,
}
    from "../controllers/product.controllers.js";
import {createProductValidation} from "../validations/productValidation.js"
import {validate} from "../middlewares/validate.middleware.js"

const router = express.Router();
router.get('/', getProducts);

router.get('/product/:id', getProduct);

//applied validation here. 
router.post("/product",  validate(createProductValidation), addProduct);

router.get('/category/:category', getByCategory);

router.get('/filter/topRated', getTopRated);

router.get('/filter/bestSellers', getBestSellers)

router.get('/products/search', searchProducts)

// router.get('/products/:category/sortby/:criteria/:order', sortProducts)

router.get('/products/filterBy', filterProducts)

router.get('/products/:list', listOfProducts)


export default router;