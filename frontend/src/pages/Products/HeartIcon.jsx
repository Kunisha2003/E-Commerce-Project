import { FaHeart, FaRegHeart, FaVaadin } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
    addToFavorites , removeFromFavorites , setFavorites
} from "../../redux/features/favorites/favoriteSlice"
import {
    addFavoriteToLocalStorage,
    getFavoritesFromLocalStorage,
    removeFavoriteFromLocalStorage,
  } from "../../Utils/localStorage";

import { useEffect } from 'react'

const HeartIcon = ({product}) => {
    // console.log("HeartIcon received product:", product);
    const dispatch = useDispatch()
    const favorites = useSelector((state)=>state.favorites) || [];
    const isFavorite = favorites.some((p)=>p.id === product.id);

    

    const toggleFavorites = () =>{
        if(isFavorite){
            dispatch(removeFromFavorites(product))
            removeFavoriteFromLocalStorage(product.id)
        }
        else{
            dispatch(addToFavorites(product))
            addFavoriteToLocalStorage(product)
        }
    }
   
    return (
    <div
    className="absolute top-2 right-5 cursor-pointer"
    onClick={toggleFavorites}
    >
        {isFavorite ? (
            <FaHeart className="text-pink-500" />
        ) : (
            <FaRegHeart className="text-white" />
        )}
        </div>
  )
}

export default HeartIcon