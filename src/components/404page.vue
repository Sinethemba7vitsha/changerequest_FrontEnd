<template>
    <div class="not-found">
        <h1>404 - Page Not Found</h1>
        <p>Oops! Looks like you're lost.</p>
        <router-link to="/">Go to Home</router-link>

    </div>
</template>
  
<script>
export default {
    name: 'NotFound'
}
</script>
  
<style>
.not-found {
    text-align: center;
    margin-top: 50px;
    font-family: Arial, sans-serif;
}

h1 {
    font-size: 4em;
    color: #333;
}

p {
    font-size: 1.5em;
    color: #666;
}
</style>
  