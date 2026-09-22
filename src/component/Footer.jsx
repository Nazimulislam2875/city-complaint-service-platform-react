import { FaFacebook, FaYoutube, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer footer-horizontal footer-center bg-base-200 text-base-content rounded p-10">
      <nav className="grid grid-flow-col gap-4">
        <a className="link link-hover">About CivicConnect</a>
        <a className="link link-hover">Contact Us</a>
        <a className="link link-hover">City Services</a>
        <a className="link link-hover">Report a Problem</a>
      </nav>

      <nav>
        <div className="grid grid-flow-col gap-4">
          <a className="text-xl cursor-pointer">
            <FaTwitter />
          </a>

          <a className="text-xl cursor-pointer">
            <FaYoutube />
          </a>

          <a className="text-xl cursor-pointer">
            <FaFacebook />
          </a>
        </div>
      </nav>

      <aside>
        <p>
          Copyright © {new Date().getFullYear()} - CivicConnect. All rights reserved.
        </p>
      </aside>
    </footer>
  );
};

export default Footer;