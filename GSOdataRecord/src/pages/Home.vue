<script setup>
import AppNavbar from '../components/AppNavbar.vue'
</script>
<template>
  <div class="home">
     
      <AppNavbar />
    

    <!-- BODY WITH BACKGROUND IMAGE -->
    <div class="hero">
      <router-link to="/projects/new" class="create-btn">
        Create New Project
      </router-link>
    </div>

  </div>
</template>

<style scoped>

/* PAGE */
.home {
  position: relative; /* needed for pseudo-element */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* prevent overflow from pseudo-element */
}

/* Full-page semi-transparent background */
.home::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('../assets/adminbuilding.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.64; /* 64% opacity */
  z-index: -1;   /* place behind content */
}

/* HEADER */
.navbar {
  background-color: #6da256; /* slightly transparent so background shows */
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 40px;
  width: 100%;
}

/* LEFT TITLE */
.logo {
  font-size: 20px;
  font-weight: bold;
}

/* RIGHT NAV LINKS */
nav {
  display: flex;
  gap: 25px;
}

nav a {
  color: white;
  text-decoration: none;
  font-weight: 500;
}

nav a:first-child {
  margin-left: 0;
}

nav a:hover {
  text-decoration: underline;
}

/* HERO SECTION */
.hero {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 60px;
}

/* CREATE BUTTON */
.create-btn {
  background-color: #0e490d;
  color: hsl(125, 39%, 94%);
  padding: 14px 30px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 16px;
  font-weight: bold;
  transition: 0.3s;
}

.create-btn:hover {
  background-color: #042c12;
}

</style>