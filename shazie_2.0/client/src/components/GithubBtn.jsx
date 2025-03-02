import { useEffect } from "react";
import axios from "axios";

const CLIENT_ID = "Ov23lisfPDlM75x2Tfg5";

export default function GithubBtn() {
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");

    if (codeParam && localStorage.getItem("accessToken") === null) {
      async function getAccessToken() {
        try {
          const response = await axios.get("/getAccessToken?code=" + codeParam);
          const data = response.data;
          console.log(data);
          if (data.access_token) {
            localStorage.setItem("accessToken", data.access_token);
          }
        } catch (error) {
          console.error("Error fetching access token:", error);
        }
      }
      getAccessToken();
    }
  }, []);
 async function getuserData() {
   try {
     const response = await axios.get("/getUserData", {
       headers: {
         Authorization: "Bearer " + localStorage.getItem("accessToken"),
       },
     });
     const data = response.data;
     console.log(data);
   } catch (error) {
     console.error("Error fetching user data:", error);
   }
 }
 if (localStorage.getItem("accessToken")){
    getuserData();
 }
  function loginWithGithub() {
    window.location.assign(
      "https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID
    );
  }

  return (
    <button
      onClick={loginWithGithub}
      className="btn bg-black text-white border-black"
    >
      <svg
        aria-label="GitHub logo"
        width="16"
        height="16"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path
          fill="white"
          d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
        ></path>
      </svg>
      Login with GitHub
    </button>
  );
}
