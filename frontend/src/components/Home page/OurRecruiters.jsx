import Marquee from "react-fast-marquee"

import amazonLogo from "../../assets/amazon_logo.png";
import deutsheBankLogo from "../../assets/deutsche_bank_logo.png";
import flipkartLogo from "../../assets/flipkart_logo.png";
import goldmanSachsLogo from "../../assets/goldman_sachs_logo.png";
import googleLogo from "../../assets/google_logo.png";
import microsoftLogo from "../../assets/microsoft_logo.png";
import netflixLogo from "../../assets/netflix_logo.png";
import uberLogo from "../../assets/uber_logo.png";
import zomatoLogo from "../../assets/zomato_logo.png";


export default function OurRecruiters() {
  
    return (
      <section className="px-6 py-8 bg-gray-200 rounded-4xl">
        <h3 className="text-2xl font-bold mb-6 text-center">Our Recruiters</h3>
        <Marquee pauseOnHover={true}>
          <div className="mx-8 px-4 py-4 hover:bg-gray-300 rounded-2xl cursor-pointer">
            <img src={amazonLogo} alt="Amazon" className="h-8" />
          </div>
          <div className="mx-8 px-4 py-4 hover:bg-gray-300 rounded-2xl cursor-pointer">
            <img src={deutsheBankLogo} alt="Deutsche Bank" className="h-8" />
          </div>
          <div className="mx-8 px-4 py-4 hover:bg-gray-300 rounded-2xl cursor-pointer">
            <img src={flipkartLogo} alt="Flipkart" className="h-8" />
          </div>
          <div className="mx-8 px-4 py-4 hover:bg-gray-300 rounded-2xl cursor-pointer">
            <img src={goldmanSachsLogo} alt="Goldman Sachs" className="h-8" />
          </div>
          <div className="mx-8 px-4 py-4 hover:bg-gray-300 rounded-2xl cursor-pointer">
            <img src={googleLogo} alt="Google" className="h-8" />
          </div>
          <div className="mx-8 px-4 py-4 hover:bg-gray-300 rounded-2xl cursor-pointer">
            <img src={microsoftLogo} alt="Microsoft" className="h-8" />
          </div>
          <div className="mx-8 px-4 py-4 hover:bg-gray-300 rounded-2xl cursor-pointer">
            <img src={netflixLogo} alt="Netflix" className="h-8" />
          </div>
          <div className="mx-8 px-4 py-4 hover:bg-gray-300 rounded-2xl cursor-pointer">
            <img src={uberLogo} alt="Uber" className="h-8" />
          </div>
          <div className="mx-8 px-4 py-4 hover:bg-gray-300 rounded-2xl cursor-pointer">
            <img src={zomatoLogo} alt="Zomato" className="h-8" />
          </div>
        </Marquee>
      </section>
    );
  }
  