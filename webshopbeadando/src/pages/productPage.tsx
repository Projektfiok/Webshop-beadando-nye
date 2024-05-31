import React, { useState, useEffect } from 'react';
import '../components/css/productPage.css';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '../components/searchProducts';

const PRODUCTPAGE = () => {
    const [productData, setProductData] = useState<any>(null);
    const { productId } = useParams<{ productId: string }>();

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                if (productId) {
                    const data = await getProduct(productId);
                    document.title = data.name;
                    setProductData(data);
                }
            } catch (error) {
                document.title = 'Unknown product';
            }
        };

        fetchProductData();
    }, [productId]);

    return (
        <main className='main-container'>
            { productData ? 
            (
                <div className='product-data'>
                    <h1>{productData.name}</h1>
                    <img src={productData.image}/>
                    <p>{productData.description}</p>
                    <p>Price: {productData.price}</p>
                    <p>Rating: {productData.rating}/5</p>
                    <p>In Stock: {productData.stock} units</p>
                    <div className='categories'>
                        <h2>Categories</h2>
                        <ul>
                            {productData.categories?.map((category: any) => (
                                <li key={category}>
                                    
                                    <Link to={'/products/categories?id=' + category}>
                                        <img src={productData.image} alt="" />
                                        {category}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : (
                <main className='main container'>
                    <p>This product does not exist</p>
                    <p>Click <Link to="/">here</Link> to return Home</p>
                </main>
            ) }
        </main>
    );
}

export default PRODUCTPAGE;