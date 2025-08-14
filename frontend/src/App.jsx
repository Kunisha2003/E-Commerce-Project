import {Outlet} from "react-router-dom"
import Navigation from "./pages/Auth/Navigation"
import {ToastContainer} from "react-toastify"
import "react-toastify/ReactToastify.css"
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setFavorites } from "./redux/features/favorites/favoriteSlice";
import { getFavoritesFromLocalStorage } from "./Utils/localStorage";


function App() {
  const dispatch = useDispatch();
   useEffect(()=>{
          const favoritesFromLocalStorage = getFavoritesFromLocalStorage();
          dispatch(setFavorites(favoritesFromLocalStorage))
      } , [])
 return (
    <>
     <ToastContainer />
     <Navigation />
     <main className="py-3">
      <Outlet />
     </main>
    </>
  )
}

export default App
