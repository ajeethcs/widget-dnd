import React from "react";

const Navbar = () => {
  const styles = {
    navbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 20px",
      backgroundColor: "#333",
      color: "white",
    },
    logo: {
      fontSize: "1.5rem",
      fontWeight: "bold",
    },
    navLinks: {
      listStyle: "none",
      display: "flex",
      gap: "15px",
    },
    link: {
      color: "white",
      textDecoration: "none",
      cursor: "pointer",
    },
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>MyLogo</div>
      <ul style={styles.navLinks}>
        <li>
          <a style={styles.link} href="#">
            Home
          </a>
        </li>
        <li>
          <a style={styles.link} href="#">
            About
          </a>
        </li>
        <li>
          <a style={styles.link} href="#">
            Services
          </a>
        </li>
        <li>
          <a style={styles.link} href="#">
            Contact
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
