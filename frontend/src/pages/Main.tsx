
const MainPage = () => {
    return (
      <main className="p-8 bg-gray-50 min-h-screen">
        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to VideoChat</h1>
          <p className="text-gray-700 text-lg">
            Connect seamlessly with friends, family, and colleagues with our easy-to-use video chat platform.
          </p>
        </section>
  
        <section>
          <h2 className="text-2xl font-semibold mb-4">Upcoming Meetings</h2>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <p className="text-gray-600">You have no upcoming meetings.</p>
          </div>
        </section>
      </main>
    );
};
export default MainPage;