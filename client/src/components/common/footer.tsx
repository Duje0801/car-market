import { useNavigate } from "react-router-dom";
import { FaYoutube } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

export function Footer() {
  const navigate = useNavigate();

  const handleRedirectInside = (id: string) => {
    navigate(`/info/${id}`);
  };

  const handleRedirectOutside = (id: string) => {
    if (id === `x`) window.location.href = "https://twitter.com/";
    else if (id === `youTube`) window.location.href = "https://www.youtube.com";
    else if (id === `facebook`)
      window.location.href = "https://www.facebook.com";
  };

  return (
    <footer className="footer p-10 bg-base-300 text-base-content mt-auto ">
      <aside>
        <p className="text-2xl font-bold xxl:text-3xl">Car Market</p>
        <p className="xxl:text-xl">Biggest online car market in Western Europe</p>
      </aside>
      <nav>
        <h6 className="footer-title xxl:text-xl">Company</h6>
        <a
          onClick={() => handleRedirectInside(`aboutUs`)}
          className="link no-underline hover:text-slate-300 hover:cursor-pointer xxl:text-xl"
        >
          About us
        </a>
        <a
          onClick={() => handleRedirectInside(`contact`)}
          className="link no-underline hover:text-slate-300 hover:cursor-pointer xxl:text-xl"
        >
          Contact
        </a>
        <a
          onClick={() => handleRedirectInside(`jobs`)}
          className="link no-underline hover:text-slate-300 hover:cursor-pointer xxl:text-xl"
        >
          Jobs
        </a>
      </nav>
      <nav>
        <h6 className="footer-title xxl:text-xl">Legal</h6>
        <a
          onClick={() => handleRedirectInside(`termsOfUse`)}
          className="link no-underline hover:text-slate-300 hover:cursor-pointer xxl:text-xl"
        >
          Terms of use
        </a>
        <a
          onClick={() => handleRedirectInside(`privacyPolicy`)}
          className="link no-underline hover:text-slate-300 hover:cursor-pointer xxl:text-xl"
        >
          Privacy policy
        </a>
      </nav>
      <nav>
        <h6 className="footer-title xxl:text-xl">Social</h6>
        <div className="grid grid-flow-col gap-4">
          <a>
            <FaSquareXTwitter
              className="text-2xl hover:text-slate-300 hover:cursor-pointer xxl:text-xl"
              onClick={() => handleRedirectOutside(`x`)}
            />
          </a>
          <a>
            <FaYoutube
              className="text-2xl hover:text-slate-300 hover:cursor-pointer xxl:text-xl"
              onClick={() => handleRedirectOutside(`youTube`)}
            />
          </a>
          <a>
            <FaFacebook
              className="text-2xl hover:text-slate-300 hover:cursor-pointer xxl:text-xl"
              onClick={() => handleRedirectOutside("facebook")}
            />
          </a>
        </div>
      </nav>
    </footer>
  );
}
