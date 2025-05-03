import png from "../assets/codecollab-high-resolution-logo-grayscale-transparent.png";
import gitlogo from "../assets/github-mark.png";

export default function Footer() {
  return (
    <footer className=" text-gray-800 text-sm py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          {/* Left Section */}
          <div className="flex justify-center md:justify-start space-x-4">
            <a href="/">
              <img alt="Your Company" src={png} className="h-8 w-auto" />
            </a>
            
            <a href="/sett" className="hover:underline">
              Settings
            </a>
          </div>

          {/* Right Section */}
          <div className="flex justify-center md:justify-end space-x-4 mt-4 md:mt-0">
            <a href="/contact" className=" hover:underline">
              Contact
            </a>
            <a href="/help" className="hover:underline">
              Help
            </a>
          </div>
        </div>
        <footer className="footer sm:footer-horizontal text-black items-center p-4">
          <aside className="grid-flow-col items-center">
            <p className="text-sm text-gray-600">© {new Date().getFullYear()}, CodeCollab</p>
          </aside>
          <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
            <a href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
            <a href="#">
              <img className="w-6 h-6" alt="gitlogo" src={gitlogo} />
            </a>
          </nav>
        </footer>
      </div>
    </footer>
  );
}
