export default function VerifyEmail() {
  return (
    <div>
      <div className="form-container">
        <form action="">
          <div className="form-group">
            <label htmlFor="">Enter your OTP code:</label>
            <input type="text" name="otp" className="email-form" id="" />
          </div>
          <input type="submit" value="Send" className="vbtn" />
        </form>
      </div>
    </div>
  );
}
