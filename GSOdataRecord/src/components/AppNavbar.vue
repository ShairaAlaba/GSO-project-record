
Copy

<template>
  <!-- HEADER / NAVBAR -->
  <header class="navbar">
    <div class="logo-title">
      GSO Project Records System
    </div>

    <nav class="nav-links">
      <router-link to="/home">Home</router-link>
      <router-link to="/history">History</router-link>
      <router-link to="/analysis">Analysis</router-link>

      <img
        alt="School logo"
        class="nav-logo"
        src="../assets/logo.png"
        width="40"
        height="40"
      />
    </nav>
  </header>
</template>

<style>
/* Global reset — removes browser default body/html margin/padding
   that causes the white gaps on left and right of the navbar.
   Not scoped so it applies to the whole app. */
*, *::before, *::after {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
}

#app {
  margin: 0;
  padding: 0;
}
</style>

<style scoped>

/* ================= NAVBAR ================= */

.navbar {
  background-color: #6da256;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 40px;
  width: 100%;
  /* Prevent any inherited margin from creating gaps */
  margin: 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

/* TITLE */
.logo-title {
  font-size: 20px;
  font-weight: bold;
}

/* NAV LINKS */
.nav-links {
  display: flex;
  align-items: center;
  gap: 25px;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
}

.nav-links a:hover {
  text-decoration: underline;
}

.nav-links a.router-link-active {
  text-decoration: underline;
  opacity: 0.85;
}

/* LOGO IMAGE */
.nav-logo {
  margin-left: 10px;
}

</style>