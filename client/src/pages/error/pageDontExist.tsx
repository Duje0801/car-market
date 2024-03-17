import { useNavigate } from "react-router-dom";
import errorImage from "../../assets/images/error/error-image.png";

export function PageDontExist() {

    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/`)
    }

  return (
    <div className="flex flex-col gap-4 mt-8">
      <h2 className="text-2xl text-center w-[65vw] mx-auto">
        Unfortunately, the page you were looking for does not exist.
      </h2>
      <figure>
        <img src={errorImage} alt="error-image" className="w-[65vw] mx-auto md:w-[50vw] lg:w-[35vw]" />
      </figure>
        <button onClick={handleClick} className="btn bg-black text-white w-[40vw] mx-auto md:w-[30vw] lg:w-[20vw]">Go to home page</button>
    </div>
  );
}
