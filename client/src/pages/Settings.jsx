import { useState } from "react";
import ChangeEmail from "../components/ChangeEmail";
import ChangePassword from "../components/ChangePassword";
import UpdateName from "../components/UpdateName";
import RequestSupport from "../components/RequestSupport";

export default function Settings() {
  const [changeNameModal, setChangeNameModal] = useState(false);
  const [changeEmailModal, setChangeEmailModal] = useState(false);
  const [changePasswordModal, setChangePaswordModal] = useState(false);
  const [requestSupportModal, setRequestSupportModal] = useState(false);
  return (
    <div className="flex items-center  flex-col  bg-white text-center text-black md:pt-6">
      <div className="mb-4 max-w-screen-lg flex flex-col gap-4 p-2">
        <h1 className="text-5xl ">Settings</h1>
        <p>
          On the Settings page, you can easily update your account details.
          Click the buttons below to change your Name, Email, or Password.
          Simply select the option you wish to modify and follow the prompts to
          make your updates.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          className="bg-white text-black p-4 rounded-md hover:bg-royal-blue-500 w-full hover:text-white transition duration-200 ease-in-out border border-royal-blue-500"
          onClick={() => setChangeNameModal(true)}
        >
          Update name
        </button>
        <button
          className="bg-white text-black p-4 rounded-md hover:bg-royal-blue-500 w-full hover:text-white transition duration-200 ease-in-out border border-royal-blue-500"
          onClick={() => setChangeEmailModal(true)}
        >
          Change email
        </button>
        <button
          className="bg-white text-black p-4 rounded-md hover:bg-royal-blue-500 w-full hover:text-white transition duration-200 ease-in-out border border-royal-blue-500"
          onClick={() => setChangePaswordModal(true)}
        >
          Change password
        </button>

        <button
          className="bg-white text-black p-4 rounded-md hover:bg-royal-blue-500 w-full hover:text-white transition duration-200 ease-in-out border border-royal-blue-500"
          onClick={() => setRequestSupportModal(true)}
        >
          Get Support
        </button>
      </div>
      <div className="mt-4 ">
        <button
          className="bg-white text-black p-4 rounded-md hover:bg-royal-blue-500 w-full hover:text-white transition duration-200 ease-in-out border border-royal-blue-500"
          onClick={() =>
            (window.location.href =
              "https://billing.stripe.com/p/login/test_9AQ163fvMbvM8NOaEF")
          }
        >
          Manage Subscriptions
        </button>
      </div>
      {changeNameModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setChangeNameModal(false)}
        >
          <div
            className="bg-white p-6 rounded-md max-w-lg w-full sm:max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Updating your name</h2>
              <button
                onClick={() => setChangeNameModal(false)}
                className="text-gray-500"
              >
                <svg
                  className="w-8 h-8 text-black hover:text-gray-900"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18 17.94 6M18 18 6.06 6"
                  />
                </svg>
              </button>
            </div>

            <UpdateName
              onClose={() => {
                setChangeNameModal(false);
              }}
            />
          </div>
        </div>
      )}
      {changeEmailModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setChangeEmailModal(false)}
        >
          <div
            className="bg-white p-6 rounded-md max-w-lg w-full sm:max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Changing your email address
              </h2>
              <button
                onClick={() => setChangeEmailModal(false)}
                className="text-gray-500"
              >
                <svg
                  className="w-8 h-8 text-black hover:text-gray-900"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18 17.94 6M18 18 6.06 6"
                  />
                </svg>
              </button>
            </div>

            <ChangeEmail
              onClose={() => {
                setChangeEmailModal(false);
              }}
            />
          </div>
        </div>
      )}
      {changePasswordModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setChangePaswordModal(false)}
        >
          <div
            className="bg-white p-6 rounded-md max-w-lg w-full sm:max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Changing your password</h2>
              <button
                onClick={() => setChangePaswordModal(false)}
                className="text-gray-500"
              >
                <svg
                  className="w-8 h-8 text-black hover:text-gray-900"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18 17.94 6M18 18 6.06 6"
                  />
                </svg>
              </button>
            </div>

            <ChangePassword
              onClose={() => {
                setChangePaswordModal(false);
              }}
            />
          </div>
        </div>
      )}
      {requestSupportModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setRequestSupportModal(false)}
        >
          <div
            className="bg-white p-6 rounded-md max-w-lg w-full sm:max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Get Support</h2>
              <button
                onClick={() => setRequestSupportModal(false)}
                className="text-gray-500"
              >
                <svg
                  className="w-8 h-8 text-black hover:text-gray-900"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18 17.94 6M18 18 6.06 6"
                  />
                </svg>
              </button>
            </div>

            <RequestSupport
              onClose={() => {
                setRequestSupportModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
