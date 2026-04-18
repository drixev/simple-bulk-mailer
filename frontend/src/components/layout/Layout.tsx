import { NavLink, Outlet } from "react-router-dom";
import styles from "./Layout.module.css";

const Layout = () => {
  const options = [
    { label: "Compose", path: "/compose" },
    { label: "Bulk", path: "/bulk" },
    { label: "Settings", path: "/settings" },
  ];

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span>bulk-mailer</span>
        </div>
        <nav className={styles.nav}>
          {options.map((opt) => (
            <NavLink
              to={opt.path}
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              {opt.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
