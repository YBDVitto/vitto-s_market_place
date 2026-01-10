import renderProducts from "./renderProducts.js"


const fetchFilteredProducts = async (category) => {
    try {
        const result = await fetch(`https://jjtd4cc3icl3gqbugqmw63m2xq0mxohx.lambda-url.us-east-1.on.aws/shop/filter?category=${category}`, {
            method: 'GET',
        })
        const data = await result.json()
        if(result.ok) {
            renderProducts(data.products)
        }
    } catch (err) {
        console.log(err)
    }
}

export default fetchFilteredProducts