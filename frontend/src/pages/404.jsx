import { useNavigate } from "react-router-dom";

const Page404 = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Error 404</h2>
      <p>This Page does not exist</p>
      <p>
        Return to{" "}
        <span onClick={() => navigate("/")}>
          <b>Home page</b>
        </span>
        !
      </p>
    </div>
  );
};

export default Page404;
