import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import type { RootState, AppDispatch } from "../../redux/store";
import { loginAdmin } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

type FormData = {
  email: string;
  password: string;
};

export default function AdminLoginForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/admin");
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const resultAction = await dispatch(loginAdmin(data));

    if (loginAdmin.fulfilled.match(resultAction)) {
      navigate("/admin");
    } else {
      alert("Error logging in: " + resultAction.payload);
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-center mb-6">Admin Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="block text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                message: "Invalid email address",
              },
            })}
            className={`w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
              errors.email
                ? "focus:ring-red-500 border-red-500"
                : "focus:ring-blue-500"
            }`}
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password", {
              required: "Password is required",
            })}
            className={`w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
              errors.password
                ? "focus:ring-red-500 border-red-500"
                : "focus:ring-blue-500"
            }`}
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-500 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </>
  );
}
