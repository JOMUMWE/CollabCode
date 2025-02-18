import png from '../assets/codecollab-high-resolution-logo-grayscale-transparent.png';

export default function Footer() {
    return (
        <footer className=" text-gray-800 text-sm py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    {/* Left Section */}
                    <div className="flex justify-center md:justify-start space-x-4">
                        <a href="/">
                            <img
                                alt="Your Company"
                                src={png}
                                className="h-8 w-auto"
                            />
                        </a>
                        <a href="#" className="hover:underline">Terms</a>
                        <a href="#" className="hover:underline">Privacy</a>
                        <a href="#" className="hover:underline">Security</a>
                    </div>

                    {/* Right Section */}
                    <div className="flex justify-center md:justify-end space-x-4 mt-4 md:mt-0">
                        <a href="#" className=" hover:underline">Contact</a>
                        <a href="#" className="hover:underline">API</a>
                        <a href="#" className="hover:underline">Status</a>
                        <a href="#" className="hover:underline">Help</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
