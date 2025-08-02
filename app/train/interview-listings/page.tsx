import Link from "next/link";

export default function InterviewListings() {
  return (
    <div className="w-full min-h-screen flex flex-co" style={{ backgroundColor: "#181A1B" }}>
      <main className="max-w-4xl mx-auto mt-12">
        {/* Combined Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* General Interview Questions */}
          <Link
            href="/train"
            className="rounded-lg p-6 shadow-lg flex flex-col items-center bg-white"
          >
            <h2 className="text-xl font-bold mb-2 text-green-900 text-center">
              General Interview Questions
            </h2>
            <p className="text-gray-700 text-center mb-2">
              Practice a wide range of general interview questions.
            </p>
          </Link>
          {/* Company 1 */}
          <div
            className="rounded-lg p-6 shadow-lg flex flex-col items-center bg-white"
          >
            <img
              src="/senddLogo.png"
              alt="Sendd"
              className="h-32 mb-6 object-contain"
            />
            <h2 className="text-xl font-bold mb-2 text-green-900 text-center">
              Sendd
            </h2>
            <p className="text-gray-700 text-center mb-2">
              Practice real interview questions asked at Sendd.
            </p>
          </div>
          {/* Company 2 */}
          <div
            className="rounded-lg p-6 shadow-lg flex flex-col items-center bg-white"
          >
            <img
              src="/rintrLogo.png"
              alt="Rintr"
              className="h-32 mb-6 object-contain"
            />
            <h2 className="text-xl font-bold mb-2 text-green-900 text-center">
              Rintr
            </h2>
            <p className="text-gray-700 text-center mb-2">
              Practice real interview questions asked at Rintr.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
