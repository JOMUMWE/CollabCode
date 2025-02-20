import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function TeamsForm(props) {
  const navigate = useNavigate();
  const [active, setActive] = useState(true);
  const [formData, setFormData] = useState({ name: "", emails: [] });
  const [emailInput, setEmailInput] = useState(""); // Temporary input for adding emails
  const [user, setUser] = useState(false);
  useEffect(() => {
    if (!user) {
      axios.get("/profile").then(({ data }) => {
        setUser(data);
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEmailChange = (e) => {
    setEmailInput(e.target.value);
  };

  const addEmail = () => {
    if (emailInput.trim() && !formData.emails.includes(emailInput)) {
      setFormData({ ...formData, emails: [...formData.emails, emailInput] });
      setEmailInput("");
    }
  };

  const removeEmail = (email) => {
    setFormData({
      ...formData,
      emails: formData.emails.filter((e) => e !== email),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActive(false);
    console.log(user.id);
    try {
      const { data } = await axios.post("/team", {
        name: formData.name,
        emails: formData.emails,
        creatorId: user.id, // Sending multiple emails as an array
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        setFormData({ name: "", emails: [] });
        toast.success("Team Created Successfully!");
        props.fun(!props.act);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
    setActive(true);
    navigate("/dashboard/teams");
  };
  return (
    <div className=" sm:mx-auto sm:w-full sm:max-w-sm px-6 py-12 lg:px-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-900"
          >
            Team Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="block w-full rounded-md bg-white px-3 py-1 text-base text-gray-900 outline outline-gray-300 focus:outline-indigo-600"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-900"
          >
            Add Member Emails
          </label>
          <div className="flex space-x-2">
            <input
              type="email"
              value={emailInput}
              onChange={handleEmailChange}
              className="block w-full rounded-md bg-white px-3 py-1 text-base text-gray-900 outline outline-gray-300 focus:outline-indigo-600"
            />
            <button
              type="button"
              onClick={addEmail}
              className="btn btn-primary"
            >
              Add
            </button>
          </div>
          <div className="mt-2 bg-white">
            {formData.emails.map((email, index) => (
              <div
                role="alert"
                key={index}
                className="mt-2 flex justify-between alert alert-info alert-soft py-2 px-1.5"
              >
                <span className="text-xs font-semibold">{email}</span>
                <button
                  type="button"
                  onClick={() => removeEmail(email)}
                  className="btn btn-active btn-error"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-row justify-between">
          <button
            type="submit"
            className={active ? "btn btn-primary" : "btn btn-neutral"}
          >
            {active ? "Save" : "Saving..."}
          </button>
          <button
            onClick={() => {
              props.fun(!props.act);
            }}
            type="reset"
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
