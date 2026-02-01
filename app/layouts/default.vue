<template>
  <div>
    <NotProd />
    <div class="min-h-screen bg-black text-white flex flex-col">
      <Nav />
      <main class="flex-1">
        <slot />
      </main>
      <Footer />
    </div>
  </div>
</template>
