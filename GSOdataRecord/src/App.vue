<script setup>
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.png" width="125" height="125" />
<br>
    <div class="welcome-container">
      <h2 class="title">Welcome to GSO Project Records System</h2>
      <br>
      <p class="description">
        The GSO Project Records System is a centralized digital platform designed
        to record, organize, and manage project information under the General
        Services Office. This system provides a structured and efficient way to
        document project details, monitor records, and maintain accurate data
        for reference and reporting.
      </p>
    </div>
    <br>
    <br>
    <br>
    <a href="https://vuejs.org/" target="_blank" rel="noopener" class="btn">Get Started</a>
  </header>

  <main>
    <TheWelcome />
  </main>
</template>

<style scoped>
/* PAGE BACKGROUND */
:global(body) {
  background-color: #e8f5e9; /* soft light green */
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
}

/* HEADER */
header {
  display: flex;
  flex-direction: column; /* stack logo and text */
  align-items: center;    /* center horizontally */
  text-align: center;
  padding: 40px 20px;
  line-height: 1.5;
}

/* LOGO */
.logo {
  display: block;
  margin-bottom: 20px;
}

/* WELCOME CONTAINER */
.welcome-container {
  max-width: 800px;
}

/* TITLE */
.title {
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

/* DESCRIPTION */
.description {
  font-size: 1.1rem;
  color: #333;
  line-height: 1.6;
}

.btn {
  display: inline-block;
  padding: 10px 20px;
  background-color: #42b983; /* Vue.js green */
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #369870;
}
</style>