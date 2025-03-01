import React from "react";
import { Footer } from "flowbite-react";
import {
  BsFacebook,
  BsGithub,
  BsImages,
  BsInstagram,
  BsLinkedin,
  BsTwitter,
} from "react-icons/bs";

// Footer component
const FooterComp = () => {
  return (
    <Footer container className="border-t-2 bg-slate-200 ">
      <div className="w-full">
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
          
          {/* Brand Section */}
          <Footer.Brand href="/">
            <div className="flex items-center space-x-3 rtl:space-x-reverse ">
              <img src="/dust.png" className="h-14" alt="CleanEase Logo" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                CleanEase
              </span>
            </div>
          </Footer.Brand>

          {/* Links Section */}
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
            {/* Technologies Links */}
            <div>
              <Footer.Title title="Technologies" className="text-blue-800 dark:text-blue-500 font-bold"/>
              <Footer.LinkGroup col>
                <Footer.Link href="https://react.dev/" target="blank">
                  React
                </Footer.Link>
                <Footer.Link
                  href="https://redux-toolkit.js.org/"
                  target="blank"
                >
                  Redux
                </Footer.Link>
                <Footer.Link href="https://tailwindcss.com/" target="blank">
                  Tailwind CSS
                </Footer.Link>
                <Footer.Link href="https://flowbite-react.com/" target="blank">
                  Flowbite
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            {/* Follow Us Links */}
            <div>
              <Footer.Title title="Follow us" className="text-blue-800 dark:text-blue-500 font-bold" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://github.com/Yogadeepan29"
                  target="blank"
                >
                  Github
                </Footer.Link>
                <Footer.Link href="#">Discord</Footer.Link>
                <Footer.Link href="#">LinkedIn</Footer.Link>
              </Footer.LinkGroup>
            </div>
            {/* Legal Links */}
            <div>
              <Footer.Title title="Legal" className="text-blue-800 dark:text-blue-500 font-bold"/>
              <Footer.LinkGroup col>
                <Footer.Link href="#">Privacy Policy</Footer.Link>
                <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        {/* Copyright and Social Media Icons */}
        <div className="w-full sm:flex sm:items-center sm:justify-between font-bold">
          <Footer.Copyright
            href="#"
            by="RYD-Projects™"
            year={new Date().getFullYear()}
          />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon
              href="https://storyset.com/work"
              target="blank"
              icon={BsImages}
            />
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon href="#" icon={BsTwitter} />
            <Footer.Icon href="#" icon={BsLinkedin} />
            <Footer.Icon
              href="https://github.com/Yogadeepan29"
              target="blank"
              icon={BsGithub}
            />
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterComp;
