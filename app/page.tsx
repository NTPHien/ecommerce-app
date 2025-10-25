'use client';
// import { useEffect, useState } from "react";
// import { supabase } from "../lib/supabaseClient.js"; 

export default function Home() {
  // const [products, setProducts] = useState([]);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     const { data, error } = await supabase
  //       .from('products')
  //       .select('*');

  //     if (error) {
  //       console.error('Error fetching products:', error);
  //     } else {
  //       setProducts(data);
  //     }
  //   };

  //   fetchProducts();
  // }, []);
  return (
    <div>
      <h1>Danh sách sản phẩm</h1>
      {/* <ul>
        {products.map((product) => (
          <li key={product.id}>
            <img src={product.image_url} alt={product.name} width={100} />
            <div>{product.name}</div>
            <div>{product.price} VND</div>
          </li>
        ))}
      </ul> */}
    </div>
  );
}
