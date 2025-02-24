import { Button , Carousel} from "flowbite-react";
import React, { useEffect } from "react";
import { FaUserTie, FaClock, FaLeaf, FaLock, FaSmile, FaThumbsUp } from 'react-icons/fa';
import { HiArrowSmRight} from "react-icons/hi";
import { Link } from "react-router-dom";
import { clearCheckoutData } from "../../Redux/Slice/cartSlice";
import { useDispatch } from 'react-redux';


const Home = () => {
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(clearCheckoutData()); 
  })
  
  return (
    <div>
      <section id="hero" className="bg-gray-300 dark:bg-gray-900">

      <div className="lg:hidden h-56 sm:h-64 xl:h-80 2xl:h-96 mb-5  ">
      <Carousel pauseOnHover>
        <img src="/src/Images/Banner/Banner-1.svg" alt="..."  className="w-full h-full object-cover"  />
        <img src="/src/Images/Banner/Banner-2.svg" alt="..."  className="w-full h-full object-cover"  />
        <img src="/src/Images/Banner/Banner-4.svg" alt="..."  className="w-full h-full object-cover"  />
        <img src="/src/Images/Banner/Banner-5.svg" alt="..."  className="w-full h-full object-cover"  />
        <img src="/src/Images/Banner/Banner-6.svg" alt="..."  className="w-full h-full object-cover"  />
      </Carousel>
    </div>

        <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
            Experience the Power of Clean with Our Professional Services
            </h1>
            <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
            Professional Residential And Commercial Cleaning Services <br />
            Book a cleaning service today and experience the difference
            </p>

            <Link
  to="/services"
  className="inline-flex items-center justify-center px-5 py-3 mr-3 md:px-10 md:py-5 lg:px-12 lg:py-6"
>
  <Button pill gradientDuoTone="purpleToBlue" >
    <div className="flex align-center justify-center items-center">
    <h1 className="font-bold  text-2xl  sm:text-4xl md:text-3xl lg:text-4xl pl-3">Book Now</h1>
    <HiArrowSmRight className="ml-3 h-10 w-12 md:h-12 md:w-10 lg:h-14 lg:w-14 text-center " />
    </div>
  
  </Button>
</Link>
          </div>
          <div className="hidden lg:mt-0 lg:col-span-5 lg:flex ">
            <img
              src="/src/Images/hero.png"
              alt="hero"
            />
          </div>
        </div>
      </section>

      <section id="features" className="bg-white dark:bg-gray-900">
  <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
    <div className="max-w-screen-md mb-8 lg:mb-16">
      <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">"Why Choose Our Cleaning Services?"</h2>
      <p className="text-gray-500 sm:text-xl dark:text-gray-400">At CleanEase , we're passionate about providing cleaning services that make a difference. Our team of trained and verified cleaners use only the best equipment and eco-friendly products to leave your home or office sparkling clean and healthy. With flexible scheduling and secure online payments, we make it easy to get the cleaning services you need. Plus, our commitment to customer satisfaction means you can trust us to get the job done right.</p>
    </div>
    <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0 text-center">
      <div>
        <div className="flex justify-center items-center mb-4 w-full h-16 rounded-full bg-primary-100 lg:h-20  dark:bg-primary-900">
          <FaUserTie className="feature-icon text-3xl" />
        </div>
        <h3 className="mb-2 text-xl text-center font-bold dark:text-white">Trained and Verified Cleaners</h3>
        <p className="text-gray-500 dark:text-gray-400">Our cleaners are thoroughly vetted and trained to provide exceptional service</p>
      </div>
      <div>
        <div className="flex justify-center items-center mb-4 w-full h-16 rounded-full bg-primary-100 lg:h-20  dark:bg-primary-900">
          <FaClock className="feature-icon text-3xl" />
        </div>
        <h3 className="mb-2 text-xl text-center font-bold dark:text-white">Flexible Scheduling</h3>
        <p className="text-gray-500 dark:text-gray-400">Book a cleaning service at a time that suits you</p>
      </div>
      <div>
        <div className="flex justify-center items-center mb-4 w-full h-16 rounded-full bg-primary-100 lg:h-20  dark:bg-primary-900">
          <FaLeaf className="feature-icon text-3xl" />
        </div>
        <h3 className="mb-2 text-xl text-center font-bold dark:text-white">Eco-Friendly Cleaning Products</h3>
        <p className="text-gray-500 dark:text-gray-400">We use environmentally friendly cleaning products to ensure a healthy and safe environment</p>
      </div>
      <div>
        <div className="flex justify-center items-center mb-4 w-full h-16 rounded-full bg-primary-100 lg:h-20  dark:bg-primary-900">
          <FaLock className="feature-icon text-3xl" />
        </div>
        <h3 className="mb-2 text-xl text-center font-bold dark:text-white">Secure Online Payments</h3>
        <p className="text-gray-500 dark:text-gray-400">Our online payment system is secure and convenient.</p>
      </div>
      <div>
        <div className="flex justify-center items-center mb-4 w-full h-16 rounded-full bg-primary-100 lg:h-20  dark:bg-primary-900">
          <FaSmile className="feature-icon text-3xl" />
        </div>
        <h3 className="mb-2 text-xl text-center font-bold dark:text-white">Satisfaction Guarantee</h3>
        <p className="text-gray-500 dark:text-gray-400">We guarantee our work and ensure you're completely satisfied with our services</p>
      </div>
      <div>
        <div className="flex justify-center items-center mb-4 w-full h-16 rounded-full bg-primary-100 lg:h-20  dark:bg-primary-900">
          <FaThumbsUp className="feature-icon text-3xl" />
        </div>
        <h3 className="mb-2 text-xl text-center font-bold dark:text-white">Excellent Customer Service</h3>
        <p className="text-gray-500 dark:text-gray-400">Our customer service team is available to answer any questions and provide support.</p>
      </div>
    </div>
  </div>
</section>

<section id="content" className="bg-white dark:bg-gray-900">
  <div className="gap-16 items-center py-8 px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-16 lg:px-6">
    <div className="font-light text-gray-500 sm:text-lg dark:text-gray-400 ">
      <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Cleaning Your Home, One Surface at a Time</h2>
      <p className="mb-4">At CleanEase, we understand the importance of a clean and healthy home. Our team of expert cleaners is dedicated to providing top-notch cleaning services that exceed your expectations. From one-time deep cleans to regular maintenance cleanings, we've got you covered.</p>
      <p>We use eco-friendly cleaning products and state-of-the-art equipment to ensure a healthy and safe environment for you and your family. Our cleaners are thoroughly vetted and trained to provide exceptional service and attention to detail.</p>
    </div>
    <div className="grid grid-cols-2 gap-4 mt-8">
      <img className="w-full rounded-lg" src="/src/Images/content1.jpg" alt="cleaning content 1" />
      <img className="mt-4 w-full lg:mt-10 rounded-lg" src="/src/Images/content2.jpg" alt="cleaning content 2" />
    </div>
  </div>
</section>

<section id="testimonial" className="bg-gray-100 dark:bg-gray-900">
  <div className="max-w-screen-xl px-4 py-8 mx-auto text-center lg:py-8 lg:pt-12">
    <figure className="max-w-screen-md mx-auto">
      <svg className="h-12 mx -auto mb-3 text-gray-400 dark:text-gray-600" viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z" fill="currentColor" />
      </svg> 
      <blockquote>
        <p className="text-2xl font-medium text-gray-900 dark:text-white">"I've been using CleanEase for months now and I'm consistently impressed with their professionalism and attention to detail. Highly recommend!"</p>
      </blockquote>
      <figcaption className="flex items-center justify-center mt-6 space-x-3">
        <img className="w-6 h-6 rounded-full" src="/src/Images/PrasathProfile.jpg" alt="profile picture" />
        <div className="flex items-center divide-x-2 divide-gray-500 dark:divide-gray-700">
          <div className="pr-3 font-medium text-gray-900 dark:text-white">Prasath S</div>
          <div className="pl-3 text-sm font-light text-gray-500 dark:text-gray-400">Loyal Customer</div>
        </div>
      </figcaption>
    </figure>
  </div>
</section>

<section id="faq" className="bg-white dark:bg-gray-900 mb-10 pt-20">
  <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
    <h2 className="mb-8 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Frequently asked questions</h2>
    <div className="grid pt-8 text-left border-t border-gray-200 md:gap-16 dark:border-gray-700 md:grid-cols-2">
      <div>
        <div className="mb-10">
          <h3 className="flex items-center mb-4 text-lg font-medium text-gray-900 dark:text-white">
            <svg className="flex-shrink-0 mr-2 w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
            What services do you offer?
          </h3>
          <p className="text-gray-500 dark:text-gray-400">We offer a variety of cleaning services, including one-time deep cleans, regular maintenance cleanings, move-in/move-out cleanings, and special event cleanings.</p>
        </div>
        <div className="mb-10">                        
          <h3 className="flex items-center mb-4 text-lg font-medium text-gray-900 dark:text-white">
            <svg className="flex-shrink-0 mr-2 w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
            How do I schedule a cleaning service?
          </h3>
          <p className="text-gray-500 dark:text-gray-400">You can schedule a cleaning service by contacting us through our website, phone, or email. We will work with you to find a time that fits your schedule.</p>
        </div>
        <div className="mb-10">
          <h3 className="flex items-center mb-4 text-lg font-medium text-gray-900 dark:text-white">
            <svg className="flex-shrink-0 mr-2 w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2 z" clipRule="evenodd" /></svg>
            What areas do you serve?
          </h3>
          <p className="text-gray-500 dark:text-gray-400">We serve the entire city and surrounding areas. Please contact us to see if we serve your specific location.</p>
        </div>
        <div className="mb-10">
          <h3 className="flex items-center mb-4 text-lg font-medium text-gray-900 dark:text-white">
            <svg className="flex-shrink-0 mr-2 w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
            Do you offer any discounts?
          </h3>
          <p className="text-gray-500 dark:text-gray-400">Yes, we offer discounts for first-time customers, referrals, and long-term contracts. Please contact us for more information.</p>
        </div>
      </div>
      <div>
        <div className="mb-10">
          <h3 className="flex items-center mb-4 text-lg font-medium text-gray-900 dark:text-white">
            <svg className="flex-shrink-0 mr-2 w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
            How do I pay for your services?
          </h3>
          <p className="text-gray-500 dark:text-gray-400">We accept all major credit cards, cash, and check. We also offer financing options for larger projects.</p>
        </div>
        <div className="mb-10">
          <h3 className="flex items-center mb-4 text-lg font-medium text-gray-900 dark:text-white">
            <svg className="flex-shrink-0 mr-2 w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
            Do you offer any guarantees?
          </h3>
          <p className="text-gray-500 dark:text-gray-400">Yes, we offer a 100% satisfaction guarantee. If you are not satisfied with our services, we will work with you to make it right.</p>
        </div>
        <div className="mb-10">
          < h3 className="flex items-center mb-4 text-lg font-medium text-gray-900 dark:text-white">
            <svg className="flex-shrink-0 mr-2 w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
            How long does a typical cleaning take?
          </h3>
          <p className="text-gray-500 dark:text-gray-400">The length of a typical cleaning varies depending on the size of the space and the level of cleaning required. We will work with you to determine the best schedule for your needs.</p>
        </div>
        <div className="mb-10">
          <h3 className="flex items-center mb-4 text-lg font-medium text-gray-900 dark:text-white">
            <svg className="flex-shrink-0 mr-2 w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
            Do you offer any eco-friendly cleaning options?
          </h3>
          <p className="text-gray-500 dark:text-gray-400">Yes, we offer eco-friendly cleaning options using natural and biodegradable products. Please contact us for more information.</p>
        </div>
      </div>
    </div>
  </div>
</section>



    </div>
  );
};

export default Home;
