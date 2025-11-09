export default function Features() {
    return (
      <section className="px-6 py-16 bg-white">
        <h2 className="text-2xl font-bold mb-6">Here’s why you’ll love it JobPortal</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {['24/7 Support', 'Tech & Startup Jobs', 'Quick & Easy', 'Save Time'].map((item) => (
            <div key={item} className="bg-gray-100 p-6 rounded-xl shadow text-center">
              <div className="text-xl font-semibold mb-2">{item}</div>
              <p className="text-gray-600 text-sm">Many companies publish their new career opportunity here.</p>
            </div>
          ))}
        </div>
      </section>
    );
  }
  