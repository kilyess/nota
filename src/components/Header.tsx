import Image from "next/image";
import Link from "next/link";

function Header() {
  return (
    <header>
      <Link href="/">
        <Image
          src="/Nota.png"
          height={60}
          width={100}
          alt="Logo"
          className="rounded-full"
          priority
        />
      </Link>
    </header>
  );
}

export default Header;
