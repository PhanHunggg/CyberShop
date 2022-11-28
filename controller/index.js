// tạo mảng lưu đẻ lưu loacal

const product = new ProductServices();
let productCard = [];
let amount = 0;
let money = 0;
const productServices = new ProductServiceList();

// lấy dữ liệu API xuống
const getProduct = () => {
  product.getList().then(function (response) {
    productServices.productList = response.data.map((element) => {
      const product = new Product(
        element.id,
        element.name,
        element.price,
        element.screen,
        element.blackCamera,
        element.fontCamera,
        element.image,
        element.desc,
        element.type
      );
      return product;
    });
    renderProduct(productServices.productList);
    console.log(productServices.productList);
  });
};

// in dữ liệu ra màn hình
const renderProduct = (data) => {
  const html = data.reduce((total, element) => {
    total += `
    <div class=" col-12 col-md-6 col-lg-4">
    <div class="item">
<div class="card">
<div class="lines"></div>
<div class="imgBox">
<img
  src="../images/${element.image}"
  alt=""
/>
</div>
<div class="content">
<div class="details">
  <h2>${element.name}<br /></h2>
  <div class="data">
    <h3>${element.screen} inch<br /><span>Screen</span></h3>
    <h3>${element.price}$<br /><span>Price</span></h3>
  </div>
  <div class="actionBtn">
    <button onclick="handlerCart(${element.id})" id="add">Add</button>
    <button onclick="handleDesc(${element.id})" data-bs-toggle="modal" data-bs-target="#exampleModal" >Description</button>
  </div>
</div>
</div>
</div>
</div>
    
    </div>
    
`;
    return total;
  }, "");

  document.getElementById("items").innerHTML = html;
};

// hàm xuất hiện mảng sp
document.getElementById("btn-shop").onclick = function () {
  document.querySelector(".store").classList.toggle("content");
  let test = document.querySelector(".store");
  if(test.classList.contains("content")){
    document.querySelector("body").style.overflow = "visible"
  }

  disabledInput();
};
const disabledInput = () => {
  const quantityInput = document.querySelectorAll(".quantity");
  for (let i in quantityInput) {
    quantityInput[i].disabled = true;
  }
};

const handlerCart = (id) => {
  amount = document.getElementById("amount").innerHTML;
  amount++;
  document.getElementById("amount").innerHTML = amount;

  product.getById(id).then(function (response) {
    let cardItems = {
      product: {
        id: response.data.id,
        price: response.data.price,
        image: response.data.image,
        name: response.data.name,
      },
      quantity: 1,
    };

    if (productCard.length === 0) {
      productCard.push(cardItems);
    } else {
      for (let i = 0; i < productCard.length; i++) {
        if (productCard[i].product.id === cardItems.product.id) {
          productCard[i].quantity += 1;
          renderCard();
          setLocalStorage();
          setAmountLocal();
          setMoney();
          return;
        }
      }
      productCard.push(cardItems);
    }
    renderCard();
    setLocalStorage();
    setAmountLocal();
    setMoney();
  });
};

const renderCard = () => {
  let html = productCard.reduce((total, element) => {
    total += `
    <div class="sanpham__content">
      <div class="sanpham__container">
          <ul>
            <li class="li__first">
              <img src="../images/${element.product.image}" alt=""/>
            </li>
            <li>${element.product.name}</li>
            <li>
              <div id="buy__amount">
                <button onclick="handleMinus('${
                  element.product.id
                }')" class="btn-minus"><i    class="fa-solid fa-minus"></i></button>
            <input class="quantity" type="text" name="amountProduct" id="amountProduct" value="${
              element.quantity
            }">
                <button onclick="handlePlus('${
                  element.product.id
                }')" class="btn-plus"><i class="fa-solid fa-plus"></i></button>
            </div>
            </li>
            <li>${element.product.price * element.quantity}</li>
            <li>
              <button onclick="deleteProduct('${
                element.product.id
              }')" class="btn-delete btn btn-danger"><i class="fa-solid fa-xmark"></i></button>
            </li>
          </ul>
      </div>
    </div>
    `;

    return total;
  }, "");
  totalCard();
  document.getElementById("sanPham").innerHTML = html;
};

const totalCard = () => {
  let total = 0;
  for (let i in productCard) {
    total += productCard[i].product.price * productCard[i].quantity;
  }
  money = total;

  document.getElementById("total").innerHTML = money;
};

const handlePlus = (id) => {
  product.getById(id).then(function (response) {
    for (let i in productCard) {
      if (response.data.id === productCard[i].product.id) {
        productCard[i].quantity += 1;
        amount = document.getElementById("amount").innerHTML;
        amount++;
        document.getElementById("amount").innerHTML = amount;
        renderCard();
        disabledInput();
        setLocalStorage();
        setAmountLocal();
        setMoney();
      }
    }
  });
};

const handleMinus = (id) => {
  product.getById(id).then(function (response) {
    for (let i in productCard) {
      if (response.data.id === productCard[i].product.id) {
        if (productCard[i].quantity <= 1) {
          productCard[i].quantity = 1;
        } else {
          productCard[i].quantity -= 1;
          amount = document.getElementById("amount").innerHTML;
          amount--;
          document.getElementById("amount").innerHTML = amount;
          renderCard();
          disabledInput();
          setLocalStorage();
          setAmountLocal();
          setMoney();
        }
      }
    }
  });
};

const deleteProduct = (id) => {
  const inx = productCard.findIndex((element) => {
    return element.product.id === id;
  });

  const quantity = productCard[inx].quantity;
  const moneyDele = productCard[inx].quantity * productCard[inx].product.price;
  productCard.splice(inx, 1);
  money -= moneyDele;
  amount = document.getElementById("amount").innerHTML;
  amount -= quantity;
  document.getElementById("amount").innerHTML = amount;
  renderCard();
  setLocalStorage();
  setAmountLocal();
  setMoney();
};

const setLocalStorage = () => {
  const stringtify = JSON.stringify(productCard);
  localStorage.setItem("card_List", stringtify);
};

const getLocalStorage = () => {
  const stringify = localStorage.getItem("card_List");
  if (stringify) {
    return JSON.parse(stringify);
  }
  return productCard;
};

const getCardLocalStorage = () => {
  const data = getLocalStorage();
  for (let i in data) {
    productCard.push(data[i]);
  }

  renderCard();
};

const setAmountLocal = () => {
  localStorage.setItem("amount", amount);
};

const getAmountLocal = () => {
  const amount = localStorage.getItem("amount");
  if (!amount) amount = 0;
  document.getElementById("amount").innerHTML = amount;
};

const setMoney = () => {
  localStorage.setItem("money", money);
};

const getMoney = () => {
  const moneyLocal = localStorage.getItem("money");
  if (!moneyLocal) moneyLocal = 0;
  money = moneyLocal;
};

const handleDesc = (id) => {
  product.getById(id).then(function (response) {
    document.getElementById("exampleModalLabel").innerHTML = response.data.name;
    document.querySelector(".modal-body").innerHTML = response.data.desc;
  });
};

// FILLTER
filterCardList = (type) => {
  const filterData = productServices.productList.filter((element) => {
    if (type === "all") {
      return true;
    }
    if (element.type === type) {
      return true;
    }

    return false;
  });
  return filterData;
};

const handlePayment =() =>{
  productCard = [];
  amount= 0;
  document.getElementById("amount").innerHTML = amount;
  money =0;
  renderCard();
  setLocalStorage();
  setAmountLocal();
  setMoney();
}

// Khi window load thì chạy hàm render in ra màn hình
window.onload = () => {
  getProduct();
  getCardLocalStorage();
  getAmountLocal();
  getMoney();
};

// RESPONSIVE

const handleNavbarToggler = () => {
  if (
    !document
      .getElementById("navbar-toggler")
      .classList.contains("respon__togle")
  ) {
    document.getElementById("navbar-toggler").classList.add("respon__togle");
  } else {
    document.getElementById("navbar-toggler").classList.remove("respon__togle");
  }

  if (
    !document
      .getElementById("filter")
      .classList.contains("repspon__filter")
  ) {
    document.getElementById("filter").classList.add("repspon__filter");
  } else {
    document.getElementById("filter").classList.remove("repspon__filter");
  }
};

document.getElementById("setLoai").onchange = (event) => {
  const value = event.target.value;
  const data = filterCardList(value);
  renderProduct(data);
};


