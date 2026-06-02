import { auth } from "./firebase-config.js";

import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;

        try {

            const userCredential =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            console.log("Login sukses:", userCredential.user);

            alert("Login berhasil!");

            // PINDAH KE DASHBOARD
            window.location.href =
                "dashboard.html";

        } catch (error) {

            console.error(error);

            alert(
                "Login gagal: " +
                error.message
            );
        }
    });
}

// CEK LOGIN STATUS
onAuthStateChanged(auth, (user) => {

    if (user) {
        console.log(
            "User login:",
            user.email
        );
    } else {
        console.log("Belum login");
    }
});

// LOGOUT
const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            try {

                await signOut(auth);

                window.location.href =
                    "login.html";

            } catch (error) {

                console.error(error);
            }
        }
    );
}