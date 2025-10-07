import React, { useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser, useAuth } from '@clerk/clerk-react';
import axios from "axios";
import './homepage.css';

function HomePage() {
  const { user } = useUser();
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      if (!isSignedIn) return;

      const token = await getToken();
      console.log("TOKEN:", token);

      try {
        const response = await axios.get("http://localhost:4000/api/users/", {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        console.log("Uporabnik iz backenda:", response.data);
      } catch (error) {
        console.error("Napaka pri pridobivanju uporabnika:", error);
      }
    };

    fetchUser();
  }, [isSignedIn]);

  return (
      <div className="page-wrapper">
        <div className="card-container">
          <SignedOut>
            <SignInButton className="sign-in-button" />
          </SignedOut>
          <SignedIn>
            <UserButton />
            <p className="greeting">Pozdravljen/a {user?.firstName}!</p>
          </SignedIn>

          {/* Motivational Quote and App Description */}
          <h2 className="section-title">Dnevna motivacija</h2>
          <p className="quote">
            "Vsak majhen korak te približa tvojim ciljem – začni danes!"
          </p>
          <h3 className="description-title">O naši aplikaciji</h3>
          <p className="description">
            Naša aplikacija ti pomaga slediti navadam, dosežkom in napredku na poti do boljše verzije sebe.
            Z lahkoto dodajaj navade, spremljaj svoj uspeh in se motiviraj z dnevnimi citati. Pridruži se
            skupnosti, ki podpira zdrav življenjski slog!
          </p>
        </div>
      </div>
  );
}

export default HomePage;