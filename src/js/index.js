const apps = document.querySelectorAll('[data-js-feature]');

for (let i = 0; i < apps.length; i++) {
  const currentApp = apps[i];
  const featureName = currentApp.getAttribute('data-js-feature');
  const App = require(`./components/${featureName}`).default;
  new App(currentApp).init();

  //keep track of your bootstrapped apps
  console.log('App bootstrapped ->', featureName);
}
