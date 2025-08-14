import {PRODUCT_URL , UPLOAD_URL} from "../constants";
import {apiSlice} from "./apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
    endpoints: 
    (builder) => ({
      // getProducts: builder.query({
      //   query: ({ keyword }) => ({
      //     url: `${PRODUCT_URL}/getProducts`,
      //     params: { keyword },
      //   }),
      //   keepUnusedDataFor: 5,
      //   providesTags: ["Products"],
      // }),

      getProducts: builder.query({
        query: ({ keyword } = {}) => {
          const config = {
            url: `${PRODUCT_URL}/getProducts`,
          };
          if (keyword) {
            config.params = { keyword };
          }
          return config;
        },
        keepUnusedDataFor: 5,
        providesTags: ["Products"],
      }),
      
  
      getProductById: builder.query({
        query: (productId) => `${PRODUCT_URL}/${productId}`,
        providesTags: (result, error, productId) => [
          { type: "Product", id: productId },
        ],
      }),
  
      allProducts: builder.query({
        query: () => `${PRODUCT_URL}/allProducts`,
      }),
  
      getProductDetails: builder.query({
        query: (productId) => ({
          url: `${PRODUCT_URL}/${productId}`,
        }),
        keepUnusedDataFor: 5,
      }),
  
      createProduct: builder.mutation({
        query: (productData) => ({
          url: `${PRODUCT_URL}/addProduct`,
          method: "POST",
          body: productData,
        }),
        invalidatesTags: ["Product"],
      }),
  
      updateProduct: builder.mutation({
        query: ({ productId, formData }) => ({
          url: `${PRODUCT_URL}/updateProduct/${productId}`,
          method: "PUT",
          body: formData,
        }),
      }),
  
      uploadProductImage: builder.mutation({
        query: (data) => ({
          url: `${UPLOAD_URL}`,
          method: "POST",
          body: data,
        }),
      }),
  
      deleteProduct: builder.mutation({
        query: (productId) => ({
          url: `${PRODUCT_URL}/deleteProduct/${productId}`,
          method: "DELETE",
        }),
        providesTags: ["Product"],
      }),
  
      createReview: builder.mutation({
        query: (data) => ({
          url: `${PRODUCT_URL}/reviews/${data.productId}`,
          method: "POST",
          body: data,
        }),
      }),
  
      getTopProducts: builder.query({
        query: () => `${PRODUCT_URL}/topProducts`,
        keepUnusedDataFor: 5,
      }),
  
      getNewProducts: builder.query({
        query: () => `${PRODUCT_URL}/newProducts`,
        keepUnusedDataFor: 5,
      }),
  
      getFilteredProducts: builder.query({
        query: ({ checked, radio }) => ({
          url: `${PRODUCT_URL}/filteredProducts`,
          method: "POST",
          body: { checked, radio },
        }),
      }),
    }),
  });
  
  export const {
    useGetProductByIdQuery,
    useGetProductsQuery,
    useGetProductDetailsQuery,
    useAllProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useCreateReviewMutation,
    useGetTopProductsQuery,
    useGetNewProductsQuery,
    useUploadProductImageMutation,
    useGetFilteredProductsQuery,
  } = productApiSlice;