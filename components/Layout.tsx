import { NavBar } from "./NavBar"

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <main>{children}</main>
    </div>
  )
}

export default Layout

