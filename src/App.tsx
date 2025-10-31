import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useTheme } from './components/theme-provider'
import { Routes, Route } from 'react-router-dom'
import LoginForm from './pages/login/LoginForm'
import { Button } from './components/ui/button'
import { Moon, Sun } from "lucide-react"
import Register from './pages/register/Register'
import { ROUTES } from './constants/const'
import Movies from './pages/movies/movie'

function App() {
  const { theme, setTheme } = useTheme()
  return (
    <>
      <div className='flex absolute top-[3%] right-[3%]'>
        <Button variant="outline" className={theme == "light" ? "bg-white" : ""} size="icon" onClick={() => {
          setTheme(theme == "dark" ? "light" : "dark")
          console.log(theme)
        }}>
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
      {/* {children} */}
      {/* <div><Login logo={logoData} /></div> */}
      <>
        <Routes>
          <Route path={ROUTES.HOME} element={<LoginForm />} />
        </Routes>
        <Routes>
          <Route path={ROUTES.REGISTER} element={<Register />} />
        </Routes>
        <Routes>
          <Route path={ROUTES.MOVIES} element={<Movies />} />
        </Routes>
      </>
    </>)
}

export default App
