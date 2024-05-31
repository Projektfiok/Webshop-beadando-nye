import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { searchProducts } from '../components/searchProducts';
import { createRequestURL } from '../components/searchProducts';
import '../components/css/searchPage.css';

const SEARCHPAGE = () => {

  const { params } = useParams<{ params: string }>();
  useEffect(() => {
    const get = async () => {
        try {
            if (params) {
              console.log("params: " + params);
                const data = await searchProducts(params);
                setProducts(data);
            }
        } catch (error) {
            console.log(error);
            
        }
    };

    get();
}, [params]);


  const [products, setProducts] = useState<any[]>([]);
  const [query, setQuery] = useState<string>('');
  const [inStock, setInStock] = useState<boolean>(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState<string>('name.ASC');
  const [offset, setOffset] = useState<number>();
  const [limit, setLimit] = useState<number>(6);

  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [minRate, setMinRate] = useState<number | undefined>();
  const [maxRate, setMaxRate] = useState<number | undefined>();
  
  return (
  <main>
    <div className='search-container'>
      <h2>Product Search</h2>

        <div>
          <label>Query: </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div>
          <label>Min Price: </label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Max Price: </label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>
        <div>
          <label>In Stock: </label>
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
          />
        </div>
        <div>
          <label>Min Rate: </label>
          <input
            type="number"
            value={minRate}
            onChange={(e) => setMinRate(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Max Rate: </label>
          <input
            type="number"
            value={maxRate}
            onChange={(e) => setMaxRate(Number(e.target.value))}
          />
        </div>
        <button type="submit" onClick={search}>Search</button>
    </div>

    <div className='search-results-container'>
      {products.length > 0 ? (
          products.map((product) => (
            <a key={product.id} className='product' href={'http://localhost:3000/product/' + product.id}>
              <img src={product.image} />
              <div className='data'>
                 <h3>{product.name}</h3>
                <p>Price: {product.price}</p>
                <p>Rating: {product.rating}/5</p>
                <p>{product.stock > 0 ? 'Stock: ' + product.stock + ' products' : 'Not in stock'}</p>
              </div>
            </a>
          ))
        ) : (
          <p>No results found</p>
        )}

      <div className='pages'>
        <button onClick={previousPage} >Previous</button>
        <button onClick={nextPage} >Next</button>
      </div>
    </div>


  </main>
  );

  function search() {
    setOffset(0);
    setLimit(6);



    let requestURL = createRequestURL({
      query,
      minPrice,
      maxPrice,
      inStock,
      minRate,
      maxRate,
      categories,
      orderBy,
      offset,
      limit,});

      const url = 'http://localhost:3000/search/' + requestURL;
      window.location.href = url;
  }

  function previousPage() {
const searchParams = new URLSearchParams("?" + params);
console.log(params);
const offsetParam = searchParams.get('offset');
const offset = offsetParam !== null ? parseInt(offsetParam) : 0;

    if (offset > 0) {
      const newOffset = offset-limit;
      setOffset(newOffset);

      let requestURL = createRequestURL({
            query,
            minPrice,
            maxPrice,
            inStock,
            minRate,
            maxRate,
            categories,
            orderBy,
            offset : newOffset,
            limit,});

      const url = 'http://localhost:3000/search/' + requestURL;
      window.location.href = url;
    }
  }

  function nextPage() {
    const searchParams = new URLSearchParams("?" + params);
    console.log(params);
    const offsetParam = searchParams.get('offset');
    const offset = offsetParam !== null ? parseInt(offsetParam) : 0;


    const newOffset = offset+limit;
      setOffset(newOffset);

    let requestURL = createRequestURL({
      query,
      minPrice,
      maxPrice,
      inStock,
      minRate,
      maxRate,
      categories,
      orderBy,
      offset: newOffset,
      limit,});

      console.log('request url: ' + requestURL);
      
    const url = 'http://localhost:3000/search/' + requestURL;
    window.location.href = url;
}
}

export default SEARCHPAGE;