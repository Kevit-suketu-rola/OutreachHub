import { Link } from "react-router-dom";

export default function LandingHero() {
  return (
    <div className="bg-gradient-to-b from-blue-400 to-purple-600">
      <section className="flex flex-col items-center justify-center text-center px-6 py-16 min-h-[100vh]">
        <h1 className="text-4xl md:text-7xl font-extrabold text-white mb-6">
          Welcome to OutreachHub
        </h1>
        <p className="text-lg md:text-xl text-gray-100 max-w-2xl mb-8">
          OutreachHub helps you organize contacts, manage campaigns, and send
          messages seamlessly across your workspaces. Simplify your outreach,
          save time, and stay connected.
        </p>
        <Link
          to="/about"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700 transition"
        >
          Learn More
        </Link>
      </section>
    </div>
  );
}
