import { auth, db } from "../firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const handleSignup = async (e, userData, navigate) => {
  e.preventDefault();

  const {
    firstName,
    lastName,
    dob,
    email,
    employeeId,
    city,
    process,
    shift,
    password,
    phoneNumber
  } = userData;


  if (!email.includes("berg.co.in")) {
    alert("Email id should end with berg.co.in");
    return;
  }

  if (
    !firstName ||
    !lastName ||
    !dob ||
    !email ||
    !password ||
    !employeeId ||
    !city ||
    !process ||
    !shift 
  ) {
    alert("Please fill all the details");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const uid = userCredential.user.uid;

    // Add a new document in collection "Users"
    await setDoc(doc(db, "Users", uid), {
      firstName: firstName,
      lastName: lastName,
      dob: dob,
      email: email,
      employeeId: employeeId,
      city: city,
      process: process,
      shift: shift,
      phone: phoneNumber,
    });
    alert("User has been created");

    navigate("/");
  } catch (e) {
    alert(e);
  }
};

export default handleSignup;
