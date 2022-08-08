

    const home = document.createElement("section")
    home.innerHTML = `
        <h1>Home</h1>
        <h3>Welcome to Bookdatasolutions!</h3>
        <a href="#" id="samples">Click here to view Samples</a>
    `;
    document.querySelector("content").appendChild(home);
    samples.onclick = (e) => {
        alert("Samples Clicked!")
    }
