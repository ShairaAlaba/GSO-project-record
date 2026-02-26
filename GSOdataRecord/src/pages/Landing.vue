<script setup>
// No script needed for now
</script>
<template>
  <header>

    <!-- LOGO -->
    <img
      alt="Vue logo"
      class="logo"
      src="../assets/logo.png"
      width="125"
      height="125"
    />

    <!-- WELCOME TEXT -->
    <div class="welcome-container">
      <h2 class="title">Welcome to GSO Project Records System</h2>

      <p class="description">
        The GSO Project Records System is a centralized digital platform designed
        to record, organize, and manage project information under the General
        Services Office. This system provides a structured and efficient way to
        document project details, monitor records, and maintain accurate data
        for reference and reporting.
      </p>
    </div>

    <!-- GET STARTED BUTTON -->
    <div class="home">
      <router-link to="/home" class="btn">
        Get Started
      </router-link>
    </div>

  </header>
</template>

<style scoped>

/* PAGE BACKGROUND */
:global(body) {
  background-color: #e8f5e9;
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
}

/* HEADER */
header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 60px 20px;
  line-height: 1.6;
}

/* LOGO */
.logo {
  margin-bottom: 20px;
}

/* TEXT CONTAINER */
.welcome-container {
  max-width: 800px;
}

/* TITLE */
.title {
  font-size: 2rem;
  margin-bottom: 15px;
  font-weight: bold;
}

/* DESCRIPTION */
.description {
  font-size: 1.1rem;
  color: #333;
}

/* BUTTON CONTAINER */
.home {
  margin-top: 40px;
}

/* BUTTON */
.btn {
  display: inline-block;
  padding: 12px 26px;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: bold;
  transition: 0.3s;
}

.btn:hover {
  background-color: #369870;
}

</style>