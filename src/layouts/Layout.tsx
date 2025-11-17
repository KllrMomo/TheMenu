import { Outlet, Link } from 'react-router-dom'

export function Layout() {
  const accountType = localStorage.getItem('accountType') || 'customer';

  let greeting;
  if (accountType === 'restaurant') {
    greeting = 'Hello Restaurant Owner!';
  } else {
    greeting = 'Hello Customer!';
  }

  let greetingPhrase;
  if (accountType === 'restaurant') {
    greetingPhrase = 'Your customers are ready to order';
  } else {
    greetingPhrase = 'What would you like to order?';
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navigation Bar */}
      <nav className="w-full bg-[#920728] py-4 relative z-2">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-6">

          {/* Logo */}
          <div>
            <Link to="/">
            <img src="/src/assets/images/logo.png" alt="The Menu Logo" className="h-28 w-28 object-contain rounded-full"/>
          </Link>
          </div>

          {/* Texto centrado */}
          <div className="flex-1 flex flex-col items-center">
            <span className="text-white font-semibold text-lg mb-2 drop-shadow" style={{ textShadow: '2px 2px 4px #0006' }}>
              {greeting}
            </span>
            <span className="text-white font-bold text-3xl drop-shadow" style={{ textShadow: '2px 2px 4px #0006' }}>
              {greetingPhrase}
            </span>
          </div>

          {/* Enlaces a la derecha */}
          <div className="flex items-center gap-6">
            <Link to="/user" className="text-white text-lg hover:underline">
              User
            </Link>

            <div className="h-6 w-px bg-white mx-2"></div>
            <Link to="/about-us" className="text-white text-lg hover:underline">
              About us
            </Link>
          </div>

        </div>

      </nav>
      
      {/* Outlet para renderizar contenido de rutas hijas */}
      <main className="max-w-7xl mx-auto py-6 px-4">
        <Outlet />
      </main>
    </div>
  )
}
