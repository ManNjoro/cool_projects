import useLocalStorage from "./useLocalStorage";

export default function LightDarkMode() {
    const [theme, setTheme] = useLocalStorage('theme', 'dark')
    const handleToggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }
  return (
    <div className="light-dark-mode">
      <div className="container">
        <p>Hello World</p>
        <button onClick={handleToggleTheme}>Change Theme</button>
      </div>
    </div>
  );
}
