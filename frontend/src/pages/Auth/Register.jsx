//Need to make few adjustments
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";


const Register = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      setIsAdmin(userInfo.isAdmin);
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      toast.error("Please fill all the inputs");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } 
    
    else {
      try {
        const res = await 
        register(
          { 
            username : username.trim(), 
            email:email.trim(), 
            password , 
            isAdmin }).unwrap();
            console.log(res); 
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
        toast.success("User successfully registered");
      } 
      
      catch (err) {
  
        toast.error(err?.data?.message);
      }
    }
  };

  return (
    <div className="ml-[10%]"  style={{ backgroundImage: "url('/purple-background.png')" }}>
      <section className="pl-[10rem] flex flex-wrap">
       <div className="mr-[4rem] mt-[5rem]">
         <h1 className="text-2xl font-semibold mb-4">Register</h1>

         <form onSubmit = {submitHandler} className="container w-[40rem]">
            <div className="my-[2rem]">
                <label htmlFor="name"
                className="block text-sm font-medium text-white">
                    Name
                </label>
                <input type="text" id = "name" className = "mt-1 p-2 border rounded w-full"
                placeholder="Enter Name" value={username} onChange={(e)=>setName(e.target.value)} 
                />
            </div>

            <div className="my-[2rem]">
                <label htmlFor="email"
                className="block text-sm font-medium text-white">
                    Email Address 
                </label>
                <input 
                type="email" 
                id = "email" 
                className = "mt-1 p-2 border rounded w-full"
                placeholder="Enter Email" value={email} onChange={(e)=>setEmail(e.target.value)} 
                />
            </div>

            <div className="my-[2rem]">
                <label htmlFor="password"
                className="block text-sm font-medium text-white">
                    Password
                </label>
                <input type="password" id = "password" className = "mt-1 p-2 border rounded w-full"
                placeholder="Enter password" value={password} onChange={(e)=>setPassword(e.target.value)} 
                />
            </div>

            <div className="my-[2rem]">
                <label htmlFor="confirmPassword"
                className="block text-sm font-medium text-white">
                    Confirm Password
                </label>
                <input type="password" id = "confirmPassword" className = "mt-1 p-2 border rounded w-full"
                placeholder="Confirm Password" value=
                {confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} 
                />
            </div>

            {/* Admin Checkbox - Only if you want users to have the option to set isAdmin */}
           <div className="my-[2rem]">
           <label className="inline-flex items-center text-sm text-white">
            <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
            className="mr-2"
            disabled={isLoading} // Disable when loading
           />
           Set as Admin
          </label>
          </div>


            <button 
            disabled={isLoading}
            type = "submit"
            className="bg-pink-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem]"
            >
              
              {isLoading ? "Registering..." : "Register"}
            </button>

            {isLoading && <Loader />}
         </form>

         <div className="mt-4">
          <p className="text-white">
            Already have an account? {" "}
            <Link 
            to={redirect ? `/login?redirect=${redirect}` : '/login'}
            className="text-pink-500 hover:underline">
              Login
            </Link>
          </p>
         </div>
         </div>
    </section>
    </div>
  );
};

export default Register;

