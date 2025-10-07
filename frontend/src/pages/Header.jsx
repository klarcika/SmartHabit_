import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';
import { useUser, SignOutButton, SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { FiLogOut } from 'react-icons/fi';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const [isListening, setIsListening] = useState(false);

  // Funkcija za govor
  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'sl-SI';
    window.speechSynthesis.speak(speech);
  };

  useEffect(() => {
    if (annyang) {
      annyang.setLanguage('sl-SI');

      const commands = {
        'pojdi na domov': () => {
          navigate('/');
          speak('Pomikam se na stran Domov');
        },
        'pojdi na navade': () => {
          navigate('/habits');
          speak('Pomikam se na stran Navade');
        },
        'pojdi na napredek': () => {
          navigate('/achivements');
          speak('Pomikam se na stran Napredek');
        },
        'pojdi na dosežke': () => {
          navigate('/milestone');
          speak('Pomikam se na stran Dosežki');
        },
        'pojdi na lestvico': () => {
          navigate('/leaderboard');
          speak('Pomikam se na stran Lestvica');
        },
        'pojdi na profil': () => {
          navigate('/profile');
          speak('Pomikam se na stran Profil');
        },
        'zdravo': () => {
          speak('Pozdravljen, kako ti lahko pomagam?');
        },
      };

      // Dodaj ukaze
      annyang.addCommands(commands);

      // Debug: izpisuj prepoznane ukaze
      annyang.addCommands({
        '*karKol': (ukaz) => {
          console.log('🟡 Prepoznan ukaz:', ukaz);
        },
      });

      return () => {
        annyang.abort();
      };
    }
  }, [navigate]);

  const toggleListening = () => {
    if (!isListening) {
      annyang.start({ autoRestart: true, continuous: false });
      speak('Začel sem poslušati.');
      setIsListening(true);
    } else {
      annyang.abort();
      speak('Prenehal sem poslušati.');
      setIsListening(false);
    }
  };

  return (
      <header className="navbar">
        <div className="navbar-content">
          <div className="navbar-section navbar-left">
            <div className="logo">SmartHabit</div>
          </div>

          <nav className="navbar-section navbar-center">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Domov</Link>
            <Link to="/habits" className={location.pathname === '/habits' ? 'active' : ''}>Navade</Link>
            <Link to="/achivements" className={location.pathname === '/achivements' ? 'active' : ''}>Napredek</Link>
            <Link to="/milestone" className={location.pathname === '/milestone' ? 'active' : ''}>Dosežki</Link>
            <Link to="/leaderboard" className={location.pathname === '/leaderboard' ? 'active' : ''}>Leaderboard</Link>
            <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>Profil</Link>
          </nav>

          <div className="navbar-section navbar-right">
            <SignedIn>
              <span className="greeting">Pozdravljen/a {user?.firstName}!</span>
              <Link to="/profile">
                <img
                    src={user?.imageUrl}
                    alt="Avatar"
                    className="avatar clickable"
                    title="Moj profil"
                />
              </Link>
              <button
                  className="voice-button"
                  onClick={toggleListening}
                  title={isListening ? 'Končaj govorjenje' : 'Začni govoriti'}
              >
                {isListening ? '🔴' : '🎙'}
              </button>
              <SignOutButton>
                <button className="logout-button" title="Odjava">
                  <FiLogOut size={20} />
                </button>
              </SignOutButton>
            </SignedIn>

            <SignedOut>
              <button
                  className="voice-button"
                  onClick={toggleListening}
                  title={isListening ? 'Končaj govorjenje' : 'Začni govoriti'}
              >
                {isListening ? '🔴' : '🎙'}
              </button>
              <SignInButton>
                <button className="login-button">Prijava</button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </header>
  );
}

export default Header;