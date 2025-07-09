import { Link } from "react-router-dom";

const Error404 = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <p className="mt-4 text-lg text-gray-600">Page not found</p>
      <Link to="/" className="mt-6 text-blue-500 underline">
        Go to Home
      </Link>
    </div>
  );
};

export default Error404;
