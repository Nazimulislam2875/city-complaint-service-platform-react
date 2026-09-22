import { Link } from "react-router";
import { FaCity, FaArrowRight, FaCheckCircle } from "react-icons/fa";

const HeroBanner = () => {
  return (
    <section className="bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10">
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FaCity />
              Smart City Complaint Platform
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Make Your City
              <span className="text-primary"> Better Together</span>
            </h1>

            <p className="mt-6 text-base-content/70 text-lg leading-8 max-w-xl">
              Report city problems, track your complaints, and help improve
              essential services in your community through one simple platform.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/complaints/create"
                className="btn btn-primary"
              >
                Report a Problem
                <FaArrowRight />
              </Link>

              <Link
                to="/complaints"
                className="btn btn-outline"
              >
                View My Complaints
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-5 text-sm text-base-content/70">
              <span className="flex items-center gap-2">
                <FaCheckCircle className="text-success" />
                Easy Reporting
              </span>

              <span className="flex items-center gap-2">
                <FaCheckCircle className="text-success" />
                Track Status
              </span>

              <span className="flex items-center gap-2">
                <FaCheckCircle className="text-success" />
                Fast Response
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <div className="bg-base-100 rounded-3xl shadow-2xl p-8 border border-base-300">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-primary/10 text-primary p-4 rounded-2xl">
                    <FaCity className="text-3xl" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold">CivicConnect</h3>
                    <p className="text-sm text-base-content/60">
                      Your Voice. Better City.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-base-200 rounded-xl p-4">
                    <p className="font-semibold">Road & Infrastructure</p>
                    <p className="text-sm text-base-content/60 mt-1">
                      Report damaged roads and public infrastructure.
                    </p>
                  </div>

                  <div className="bg-base-200 rounded-xl p-4">
                    <p className="font-semibold">Water & Drainage</p>
                    <p className="text-sm text-base-content/60 mt-1">
                      Submit water supply and drainage complaints.
                    </p>
                  </div>

                  <div className="bg-base-200 rounded-xl p-4">
                    <p className="font-semibold">Electricity & Street Light</p>
                    <p className="text-sm text-base-content/60 mt-1">
                      Report electricity and street light issues.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroBanner;