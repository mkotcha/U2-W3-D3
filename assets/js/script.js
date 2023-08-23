let bookArrLocal = [];

fetch("https://striveschool-api.herokuapp.com/books")
  .then(response => response.json())
  .then(bookArr => printBook(bookArr))
  .catch(err => console.log(err));

const printBook = bookArr => {
  //   console.log(bookArr);
  const row = document.querySelector(".row");
  row.innerHTML = "";
  if (bookArrLocal.length < 1) bookArrLocal = [...bookArr];
  bookArr.forEach(element => {
    if (notDropped(element.asin)) {
      const title = element.title;
      const col = document.createElement("div");
      col.className = "col";
      const card = document.createElement("div");
      card.id = element.asin;
      card.className = "card h-100";
      card.innerHTML = `<img src="${element.img}" class="card-img-top" alt="${title} ">`;
      const body = document.createElement("div");
      body.className = "card-body";
      body.innerHTML = `<h5 class="card-title">${title}</h5><p class="card-text text-end">$ ${element.price}</p>`;
      const drop = document.createElement("button");
      drop.className = "btn btn-primary me-2";
      drop.innerText = "scarta";
      drop.addEventListener("click", dropBook);
      drop.value = element.asin;
      const buy = document.createElement("button");
      buy.className = "btn btn-primary";
      buy.innerText = "compra ora";
      buy.addEventListener("click", addChart);
      buy.value = element.asin;

      body.appendChild(drop);
      body.appendChild(buy);
      card.appendChild(body);
      col.appendChild(card);
      row.appendChild(col);
    }
  });
};

const dropBook = event => {
  document.getElementById(event.target.value).remove();
  let dropped = [];
  if (localStorage.getItem("dropped")) dropped = JSON.parse(localStorage.getItem("dropped"));
  dropped.push(event.target.value);
  localStorage.setItem("dropped", JSON.stringify(dropped));

  printBook(bookArrLocal);
};

const addChart = event => {
  console.log("buy ", event.target.value);

  let cart = [];
  if (localStorage.getItem("cart")) cart = JSON.parse(localStorage.getItem("cart"));
  cart.push(event.target.value);
  localStorage.setItem("cart", JSON.stringify(cart));
  printCart();
};

const notDropped = id => {
  let dropped = [];
  let flag = true;
  if (localStorage.getItem("dropped")) dropped = JSON.parse(localStorage.getItem("dropped"));
  dropped.forEach(elm => {
    if (parseInt(id) === parseInt(elm)) {
      flag = false;
    }
  });
  return flag;
};

const ul = document.querySelector("ul");

const printCart = () => {
  let cart = [];
  let str = "";
  ul.innerHTML = "";
  if (localStorage.getItem("cart")) cart = JSON.parse(localStorage.getItem("cart"));
  cart.forEach(elm => {
    str = `https://striveschool-api.herokuapp.com/books?asin=${elm}`;
    console.log(str);
    fetch(str)
      .then(response => response.json())
      .then(bookArr => {
        const li = document.createElement("li");
        li.innerText = bookArr[0].title;
        const button = document.createElement("button");
        button.classList = "btn btn-danger";
        button.innerHTML = `<i class="bi bi-trash"></i>`;
        button.addEventListener("click", event => delCart(event, bookArr[0].asin));
        li.appendChild(button);
        ul.appendChild(li);
      })
      .catch(err => console.log(err));
  });
};

printCart();

const delCart = (event, id) => {
  console.log(id);
  let cart = [];
  let newCart = [];
  if (localStorage.getItem("cart")) cart = JSON.parse(localStorage.getItem("cart"));
  cart.forEach(elm => {
    if (parseInt(id) === parseInt(elm)) {
      console.log("boom");
    } else newCart.push(elm);
  });
  localStorage.setItem("cart", JSON.stringify(newCart));
  printCart();
};
