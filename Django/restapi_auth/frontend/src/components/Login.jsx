export default function Login() {
  return (
    <div>
      <div className="form-container">
        <div style={{ width: "100%" }} className="wrapper">
          <h2>Login</h2>
          <form>
            <div className="form-group">
              <label htmlFor="">Email Address</label>
              <input type="text" name="email" id="" className="email-form" />
            </div>

            <div className="form-group">
              <label htmlFor="">Password</label>
              <input
                type="password"
                name="password"
                id=""
                className="email-form"
              />
            </div>
            <input type="submit" value="Submit" className="submitButton" />
          </form>
          <h3 className="text-option">Or</h3>
          <div className="githubContainer">
            <button>Sign in with Github</button>
          </div>
          <div className="googleContainer">
            <button>Sign in with Google</button>
          </div>
        </div>
      </div>
    </div>
  );
}
