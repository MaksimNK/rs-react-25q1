import { NavLink } from 'react-router-dom';
import styles from './styles.module.css';

export const Header = () => {
  return (
    <nav className={styles.navbar}>
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? styles.active : '')}
      >
        Home
      </NavLink>
      <NavLink
        to="/hook-form"
        className={({ isActive }) => (isActive ? styles.active : '')}
      >
        Hook Form
      </NavLink>
      <NavLink
        to="/uncontrolled"
        className={({ isActive }) => (isActive ? styles.active : '')}
      >
        Uncontrolled Form
      </NavLink>
    </nav>
  );
};
