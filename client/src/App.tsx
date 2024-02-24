import { Link, Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <h1>Car market</h1>
      <Link to="/">Home</Link> | <Link to="/signUp">Sign Up</Link> |
      <Outlet />
    </>
  );
}

export default App;
