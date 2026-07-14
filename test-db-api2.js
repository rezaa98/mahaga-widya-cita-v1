fetch('http://localhost:3000/api/globals/beranda?locale=en').then(r => r.json()).then(d => {
  console.log(d.hero.title);
  console.log(d.hero.description);
});
