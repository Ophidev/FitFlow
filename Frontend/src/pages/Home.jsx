import React from "react";
import { Link } from "react-router";

const Home = () => {
  return (
    <div className="bg-base-100 text-base-content">

      {/* 🔥 HERO SECTION */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Transform Your Fitness Journey 💪
        </h1>

        <p className="text-lg md:text-xl opacity-70 max-w-2xl mb-6">
          Track workouts, monitor progress, and stay consistent — all in one place.
        </p>

        <div className="flex gap-4">
          <Link to="/login" className="btn btn-primary">
            Get Started
          </Link>
          <button className="btn btn-outline">
            Learn More
          </button>
        </div>
      </section>

      {/* 📊 FEATURES SECTION */}
      <section className="py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">
          Why FitFlow?
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-base-200 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-2">📈 Track Progress</h3>
            <p className="opacity-70">
              Monitor your workouts and see real improvements over time.
            </p>
          </div>

          <div className="bg-base-200 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-2">🧠 Smart Planning</h3>
            <p className="opacity-70">
              Plan workouts efficiently and stay consistent every day.
            </p>
          </div>

          <div className="bg-base-200 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-2">⚡ Stay Motivated</h3>
            <p className="opacity-70">
              Get insights and stay motivated with your fitness journey.
            </p>
          </div>

        </div>
      </section>

      {/* 🧩 STATS SECTION */}
      <section className="py-16 bg-base-200 text-center">
        <div className="grid md:grid-cols-3 gap-6">

          <div>
            <h3 className="text-3xl font-bold text-primary">10K+</h3>
            <p className="opacity-70">Active Users</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-secondary">500K+</h3>
            <p className="opacity-70">Workouts Logged</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-accent">95%</h3>
            <p className="opacity-70">User Satisfaction</p>
          </div>

        </div>
      </section>

      {/* 🚀 CTA SECTION */}
      <section className="py-20 text-center px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Level Up? 🚀
        </h2>

        <p className="opacity-70 mb-6">
          Start your fitness journey today with FitFlow.
        </p>

        <Link to="/login" className="btn btn-primary btn-lg">
          Start Now
        </Link>
      </section>

    </div>
  );
};

export default Home;