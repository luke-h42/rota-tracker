import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-10 pt-[72px] bg-white ">
      <div className="bg-gray-50  p-8 mb-4 rounded-lg ">
        {/* Header Section */}
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-royal-blue-500 leading-tight md:text-5xl">
            RotaTracker
          </h1>
          <h2 className="text-xl text-gray-700 ">
            The Easy Way to Manage Employee Rotas & Hours
          </h2>
        </header>

        <div className="max-w-6xl mx-auto ">
          {/* Manager Section */}
          <section className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300 ease-in-out">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Create & Manage Rotas
                </h3>
                <p className="text-gray-600 text-lg">
                  Easily add, edit, and delete rotas directly from a weekly
                  timesheet. Customizing schedules to fit your needs has never
                  been simpler.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300 ease-in-out">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Team Communication Made Simple
                </h3>
                <p className="text-gray-600 text-lg">
                  Once you're happy with the rota, simply hit the button to send
                  all your employees a notification via email to check their
                  shifts.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300 ease-in-out">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Report Generation
                </h3>
                <p className="text-gray-600 text-lg">
                  View detailed reports on hours worked by your employees,
                  either by month or for a specific date range. Need to share
                  the report? Click <em>Copy</em> to instantly copy it to your
                  clipboard for easy sharing with relevant stakeholders.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300 ease-in-out">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  User Management
                </h3>
                <p className="text-gray-600 text-lg">
                  Add, edit, or delete users on your account to ensure the right
                  people have access to the right features.
                </p>
              </div>
            </div>
          </section>

          {/* Employee Section */}
          <section className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300 ease-in-out">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Personal Rota Access
                </h3>
                <p className="text-gray-600 text-lg">
                  Employees can easily log in to view their personal rota,
                  complete with all shifts and the total hours worked.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300 ease-in-out">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Team View
                </h3>
                <p className="text-gray-600 text-lg">
                  Switch to a team view to see who else is working that week and
                  coordinate better with your colleagues.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300 ease-in-out">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Shift Flexibility
                </h3>
                <p className="text-gray-600 text-lg">
                  Employees can stay informed about their upcoming shifts and
                  any changes to the rota in real-time.
                </p>
              </div>
            </div>
          </section>

          {/* Call to action Section */}
          <section className="text-center bg-gray-100 py-8 px-4 rounded-lg shadow-inner mt-8">
            <p className="text-2xl font-semibold text-gray-800 mb-4">
              Simplified Scheduling. Better Team Coordination. Efficient Hour
              Reporting.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              At RotaTracker, we're here to help make managing your team's
              schedule and reporting work hours a breeze. Say goodbye to
              spreadsheets and endless emails—streamline your workflow with our
              intuitive, user-friendly platform today!
            </p>
            <div className="flex justify-center items-center gap-6">
              <Link to="/get-started">
                <button className="px-8 py-3 bg-royal-blue-500 text-white text-lg rounded-lg shadow-md hover:bg-royal-blue-600 transition duration-300 ease-in-out">
                  Sign Up
                </button>
              </Link>
              <Link to="/login">
                <button className="px-8 py-3 bg-gray-600 text-white text-lg rounded-lg shadow-md hover:bg-gray-700 transition duration-300 ease-in-out">
                  Log In
                </button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
