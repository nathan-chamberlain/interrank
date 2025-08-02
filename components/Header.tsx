import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import Image from "next/image";

const Header = () => {
    return (
        <>
            <header className="w-full flex items-center justify-between py-4 px-8 bg-gray-800">
                <div className="flex items-center">
                <Link href="/">
                    <Image
                    src="/logo.png"
                    alt="INTERRANK Logo"
                    className="h-16 w-auto cursor-pointer"
                    width={128}
                    height={128}
                    />
                </Link>
                </div>
                <nav className="flex items-center gap-6">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-gray-200 font-semibold px-2 py-1 hover:text-white hover:underline transition-colors">Home</Link>
                    <Link href="/train/interview-listings" className="text-gray-200 font-semibold px-2 py-1 hover:text-white hover:underline transition-colors">Train</Link>
                    <Link href="/leaderboard" className="text-gray-200 font-semibold px-2 py-1 hover:text-white hover:underline transition-colors">Stats/Leaderboard</Link>
                    <Link href="/about" className="text-gray-200 font-semibold px-2 py-1 hover:text-white hover:underline transition-colors">About Us</Link>
                </div>
                <Link href="/profile">
                    <button className="bg-green-700 hover:bg-green-600 p-2 rounded-full flex items-center justify-center ml-8">
                    <CgProfile className="h-8 w-8 text-white" />
                    </button>
                </Link>
                </nav>
            </header>
        </>
    );
}

export default Header;