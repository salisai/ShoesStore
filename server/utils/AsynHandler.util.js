const asyncHandler = (requestHandler) => (req, res, next) => {
    return (req, res, next) => {
        requestHandler(req, res, next).catch((err)=>next(error))
    }
}

export {asyncHandler}