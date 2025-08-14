import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({ keyword });
  // const { data, isLoading, isError } = useGetProductsQuery(keyword ? { keyword } : {});

  console.log("API response:", data);
  const { products = [] } = data || {};



  return (
    <>
       <Link to="/" className="text-3xl font-bold text-pink-600 ml-[10%]">
         ShopVerse
       </Link>

       
       
       <div className="ml-[18%] mr-[10%] pt-[3%]">
        {!keyword ? <Header /> : null}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error?.error || "An error occurred"}
        </Message>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h1 className="ml-[20rem] mt-[10rem] text-[3rem]">Special Products</h1>

            <Link
              to="/shop"
              className="bg-pink-600 font-bold rounded-full py-2 px-10 mr-[18rem] mt-[10rem]"
            >
              Shop
            </Link>
          </div>

          <div className="flex justify-center flex-wrap mt-[2rem]">
            {/* Check if products array has items before attempting to map */}
            {products.length > 0 ? (
              products.map((product) => (
                
                <Product key={product.id} product={product} />
              ))
            ) : (
              <Message variant="info">No products found</Message>
            )}
          </div>
        </>
      )}
      </div>
    </>
  );
};

export default Home;
