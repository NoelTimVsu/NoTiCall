import { Button } from "@/components/ui/button";
import { animate, hover } from "motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  const featuretemps = [
    "Messaging",
    "Group Chats",
    "Peer to Peer Video Conference",
    "Security and Privacy",
    "Feauture-5",
    "Feature-6",
  ];

  useEffect(() => {
    // Animate each feature card on hover
    hover(".feature-card", (element) => {
      animate(element, { scale: 1.1 });
      return () => animate(element, { scale: 1 });
    });
  }, []);

  return (
    <main className="flex flex-col min-h-screen bg-gray-50">
      {/* Content wrapper */}
      <div className="flex-grow">
        {/* 1st section */}
        <section className="p-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-6xl font-bold text-gray-900 mb-6">
              Welcome to NoTiCall
            </h1>
            <p className="text-muted-foreground text-lg mb-6">
              Connect seamlessly with friends, family, and colleagues with our
              easy-to-use video chat platform.
            </p>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => navigate("/signup")}>
                Sign up
              </Button>
              <Button variant="blueButton" onClick={() => navigate("/login")}>
                Log in
              </Button>
            </div>
          </div>
          <div className="w-full h-64 bg-gray-300 rounded-xl" />
        </section>

        {/* 2nd section */}
        <section className="p-10 flex flex-col justify-center items-center gap-6 bg-gray-800 w-full shadow-2xl">
          <h2 className="text-4xl font-semibold text-white">Features</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuretemps.map((val, i) => (
              <div
                key={i}
                className="feature-card w-80 h-40 border-2 flex items-center justify-center bg-gray-100 rounded-md text-gray-700 shadow hover:shadow-md transition cursor-pointer"
              >
                {val}
              </div>
            ))}
          </div>
        </section>

        {/* 3rd section */}
        <section className="p-10 flex flex-col justify-center items-center gap-6 bg-gray-800 w-full shadow-2xl">
          <Button variant="blueButton" size="xl">
            <span onClick={() => navigate("/signup")} className="text-xl">
              Get Started
            </span>
          </Button>
        </section>
      </div>

      {/* Footer */}
      <footer className="w-full bg-white border-t py-6 px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground gap-4">
          <span>
            © {new Date().getFullYear()} NoTiCall. All rights reserved.
          </span>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="hover:underline">
              Terms of Service
            </a>
            <a href="#" className="hover:underline">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default HomePage;
