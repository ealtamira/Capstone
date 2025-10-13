    function verify() {
      document.body.innerHTML = `
        <p>Scanning sentiment history...</p>
        <p>Analyzing empathy consistency...</p>
        <p>Cross-referencing user reflection...</p>
        <p><b>Welcome back, Observer.</b></p>
      `;
      setTimeout(() => {
        document.body.innerHTML += `<p><i>@NullUser: "It’s already seen you."</i></p>`;
      }, 5000);
    }