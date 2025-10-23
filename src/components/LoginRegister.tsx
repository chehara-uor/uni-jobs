import React, { useState } from "react";
import styles from "@styles/login-register.module.scss";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Preloader from "@components/Preloader"
interface LoginData {
    username: string;
    password: string;
}
interface RegisterData {
  name: string;
  email: string;
  companyName: string;
  website: string;
  password: string;
  confirmation: string;
}
interface Cookie {
    name: string;
    value: string;
    days: number;
}
export default function LoginRegister() {
  const [mode, setMode] = useState("login");
  const isLogin = mode === "login";
  const [loading, setLoading] = useState(false);
    // const setCookie = (cookie: Cookie) => {
    // const { name, value, days } = cookie;
    // const expirationDate = new Date();
    // expirationDate.setDate(expirationDate.getDate() + days);
    // document.cookie = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
    // };


  const [loginData, setLoginData] = useState<LoginData>({
    username: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState<RegisterData>({
    name: "",
    email: "",
    companyName: "",
    website: "",
    password: "",
    confirmation: "",
  });

  const registerCompany = async (data: any) => {
    setLoading(true);
    try{
      const response = await axios.post("/api/register", JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (response.status === 200) {
        setLoading(false);
        toast.success("Registration successful!");
        setRegisterData({
         name: "",
         email: "",
         companyName: "",
         website: "",
         password: "",
         confirmation: "",
       });
       setMode("login");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Registration failed. Please try again.");
    }
  }

  // const handleLogin = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (isLogin) {
  //     if (loginData.password === "1234" && loginData.username === "test") {
  //       window.location.href = "/post-a-job";
  //       sessionStorage.setItem("isUserLogin", "true");
  //       sessionStorage.setItem("userName", loginData.username);
  //     } else {
  //       alert("Login failed!");
  //     }
  //   } else {
  //     console.log("Registering user:", registerData);
  //   }
  // };
  const transformRegisterData = (data: RegisterData) => {
    return {
      username: data.name.toLocaleLowerCase(),
      email: data.email,
      first_name: data.name,
      password: data.password,
      website: data.website,
      role: "author"
    };
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      try {
        const res = await axios.get(
          "https://unijobs.my.id/wp-json/remoteasia/v2/login",
          {
            params: {
              username_or_email: loginData.username,
              password: loginData.password,
            },
          }
        );

        if (res.status === 200) {
          setLoading(false);
          sessionStorage.setItem("userToken", res.data.token);
          sessionStorage.setItem("userID", res.data.user_id);
          sessionStorage.setItem("isUserLogin", "true");
          sessionStorage.setItem("userName", loginData.username);
          //setLoading(false);
          window.location.href = "/post-a-job";
        }
      } catch (err) {
        setLoading(false);
        if (axios.isAxiosError(err)) {
          if (err.response) {
            if (err.response.status == 401) {
              toast.error("Invalid credentials. Please try again.");
            } else if (err.response.status == 500) {
              toast.error("Server error. Please try again later");
            }
          } else {
            toast.error("Network error. Please check your connection.");
          }
        } else {
          toast.error("An unexpected error occurred");
        }
      }
    }
    else {
       console.log("Registering user:", registerData);
       if (registerData.password === registerData.confirmation) {
         registerCompany(transformRegisterData(registerData));
       } else {
         toast.error("Passwords do not match");
       }
     }
  };

  return (
    <div className={` mt-[80px] py-16 ${styles.bgPlayful}`}>
      {loading && <Preloader />}
      {/* Centered Card */}
      <main className="max-w-3xl mx-auto px-4">
        <div className="relative">
          {/* Illustration blocks (pure Tailwind, optional) */}
          {/* <div className="hidden lg:block absolute -left-6 top-6 w-10 h-24 bg-[#10195D] rounded-md" />
          <div className="hidden lg:block absolute left-10 bottom-10 w-24 h-24 border-2 border-gray-300 rounded-md" />
          <div className="hidden lg:block absolute right-6 bottom-6 w-10 h-24 bg-[#e81b39] rounded-md" /> */}

          <section className="mx-auto max-w-md">
            <div className={`bg-white shadow-2xl md:p-8 ${styles.cardSoft}`}>
              <h1 className="text-center text-2xl md:text-3xl font-semibold text-gray-900">
                {isLogin ? "Login" : "Create Account"}
              </h1>
              <p className="mt-2 text-center text-gray-500">
                {isLogin
                  ? "Login to your account for post a job"
                  : "Fill your details to create your account"}
              </p>

              <form className={`mt-6 space-y-4 py-4 ${styles.form}`} onSubmit={handleLogin}>
                {/* LOGIN FIELDS */}
                {isLogin && (
                  <>
                    <label className="block">
                      <span className="block text-sm font-medium text-gray-700">
                        Email
                      </span>
                      <input
                        type="text"
                        placeholder="Enter Email / Phone No"
                        required
                        value={loginData.username}
                        onChange={(e) =>
                          setLoginData({ ...loginData, username: e.target.value })
                        }
                        className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none "
                      />
                    </label>
                    <label className="block">
                      <span className="block text-sm font-medium text-gray-700">
                        Passcode
                      </span>
                      <div className="mt-1 relative">
                        <input
                          type="password"
                          required
                          placeholder="Password"
                          value={loginData.password}
                          onChange={(e) =>
                            setLoginData({ ...loginData, password: e.target.value })
                          }
                          className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 pr-14 outline-none"
                        />
                        {/* <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
                          aria-label="Toggle password visibility"
                        >
                          Hide
                        </button> */}
                      </div>
                    </label>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Having trouble in sign in?
                      </span>
                      <span>
                        <a href="tel:+1234567890" className="text-sm text-[#0078c1] hover:underline">
                          Reset your password
                        </a>
                      </span>
                    </div>

                    <button
                      type="submit"
                      className={styles.login_submit}
                    >
                      Sign in
                    </button>

                    {/* <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-500 shrink-0">
                        Or Sign in with
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <button
                        type="button"
                        className="border border-gray-300 rounded-lg py-2 text-sm hover:bg-gray-50"
                      >
                        Google
                      </button>
                      <button
                        type="button"
                        className="border border-gray-300 rounded-lg py-2 text-sm hover:bg-gray-50"
                      >
                        Facebook
                      </button>
                    </div> */}
                  </>
                )}

                {/* REGISTER FIELDS */}
                {!isLogin && (
                  <>
                    <div className="grid grid-cols-1 gap-4">
                      <label className="block">
                        <span className="block text-sm font-medium text-gray-700">
                          Name
                        </span>
                        <input
                          type="text"
                          required
                          placeholder="Your name"
                          value={registerData.name}
                          onChange={(e) =>
                            setRegisterData({ ...registerData, name: e.target.value })
                          }
                          className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-4 focus:ring-amber-100 focus:border-amber-400"
                        />
                      </label>

                      <label className="block">
                        <span className="block text-sm font-medium text-gray-700">
                          Email
                        </span>
                        <input
                          type="email"
                          required
                          placeholder="you@example.com"
                          value={registerData.email}
                          onChange={(e) =>
                            setRegisterData({ ...registerData, email: e.target.value })
                          }
                          className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-4 focus:ring-amber-100 focus:border-amber-400"
                        />
                      </label>


                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="block">
                        <span className="block text-sm font-medium text-gray-700">
                          Website URL
                        </span>
                        <input
                          type="url"
                          placeholder="https://yourcompany.com"
                          value={registerData.website}
                          onChange={(e) =>
                            setRegisterData({ ...registerData, website: e.target.value })
                          }
                          className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-4 focus:ring-amber-100 focus:border-amber-400"
                        />
                      </label>

                      <label className="block">
                        <span className="block text-sm font-medium text-gray-700">
                          Company name
                        </span>
                        <input
                          type="text"
                          placeholder="Company Inc."
                          value={registerData.companyName}
                          onChange={(e) =>
                            setRegisterData({ ...registerData, companyName: e.target.value })
                          }
                          className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-4 focus:ring-amber-100 focus:border-amber-400"
                        />
                      </label>
                      </div>
                      <label className="block">
                        <span className="block text-sm font-medium text-gray-700">
                          Password
                        </span>
                        <input
                          type="password"
                          required
                          placeholder="Create a password"
                          value={registerData.password}
                          onChange={(e) =>
                            setRegisterData({ ...registerData, password: e.target.value })
                          }
                          className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-4 focus:ring-amber-100 focus:border-amber-400"
                        />
                      </label>

                      <label className="block">
                        <span className="block text-sm font-medium text-gray-700">
                          Password confirmation
                        </span>
                        <input
                          type="password"
                          required
                          placeholder="Re-enter password"
                          value={registerData.confirmation}
                          onChange={(e) =>
                            setRegisterData({ ...registerData, confirmation: e.target.value })
                          }
                          className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-4 focus:ring-amber-100 focus:border-amber-400"
                        />
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="cursor-pointer w-full rounded-xl bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold py-2.5 transition"
                    >
                      Create Account
                    </button>
                  </>
                )}
              </form>

              {/* Bottom switch */}
              <div className="mt-4 text-center text-sm text-gray-600">
                {isLogin ? (
                  <>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      className={`${styles.register_switch}`}
                      onClick={() => setMode("register")}
                    >
                      Register now
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      className={`${styles.register_switch}`}
                      onClick={() => setMode("login")}
                    >
                      Sign in
                    </button>
                  </>
                )}
              </div>

              <p className="mt-4 text-center text-xs text-gray-400">
                Copyright © RJA 2025 &nbsp; | &nbsp; Privacy Policy
              </p>
            </div>
          <ToastContainer
            position="bottom-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable={false}
            pauseOnHover={false}
            theme="colored"
            />
          </section>
        </div>
      </main>
    </div>
    
  );
}
