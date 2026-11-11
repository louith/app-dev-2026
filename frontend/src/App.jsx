import { useState, useEffect } from "react";
import "./App.css";
// import Homepage from "./pages/Homepage";

function App() {
  const [count, setCount] = useState(10);
  const [student, setStudent] = useState({
    id: "",
    first_name: "",
    middlename: "",
    lastname: "",
    birthday: "",
    mother_name: "",
    father_name: "",
    phone_number: "",
    created_at: "",
    updated_at: "",
    encoder_id: null,
    user_id: null,
  });

  const [user, setUser] = useState({
    email: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/auth/get-student/1",
        );
        if (!response.ok) {
          throw new Error("Failed to fetch student data");
        }
        const data = await response.json();
        console.log(data);
        setStudent(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStudent();
  }, []);

  const submitUser = async () => {
    try {
      const response = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error("Failed to register user");
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  // const count =55;
  return (
    <>
      {/* <Homepage /> */}

      <p>
        {student.first_name} {student.lastname} - {student.birthday}
      </p>

      <button
        onClick={() => setCount((count) => count + 1)}
        style={{
          backgroundColor: "blue",
          padding: "10px 20px",
        }}
      >
        +
      </button>
      <span>{count}</span>
      <button onClick={() => setCount((count) => count - 1)}>-</button>

      <div className="flex flex-col gap-2 mt-4 w-[20vw] justify-center items-center">
        <input
          type="email"
          placeholder="Email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          className="border border-gray-300 rounded px-2 py-1"
        />
        <input
          type="text"
          placeholder="Username"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          className="border border-gray-300 rounded px-2 py-1"
        />
        <input
          type="password"
          placeholder="Password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          className="border border-gray-300 rounded px-2 py-1"
        />
      </div>

      <button
        onClick={submitUser}
        className="w-[250px] bg-blue-950 text-white rounded-md p-4 mt-6"
      >
        Sign Up
      </button>
    </>
  );
}

export default App;
