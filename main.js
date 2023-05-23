document.querySelector("button").addEventListener("click", getFetch);

function getFetch() {
  const choice = document.getElementById("barcode").value;
  //   if (choice.length !== 12) {
  //     alert(`Please enter a barcode that is 12 digits`);
  //     document.getElementById("barcode").value = "";
  //     return;
  //   }

  const url = `https://world.openfoodfacts.org/api/v0/product/${choice}.json`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.status === 1) {
        const item = new ProductInfo(data.product);
        item.showInfo();
        item.listIngredients();
        // //set product name
        // let productName = data.product.product_name;
        // document.getElementById("productName").innerText = productName;

        // //set img .src
        // let img = data.product.image_url;
        // document.getElementById("productImg").src = img;
      } else if (data.status === 0) {
        alert(`Product ${choice} was not found. Please try another.`);
      }
    })
    .catch((err) => {
      console.error(`error: ${err}`);
    });
}

class ProductInfo {
  constructor(productData) {
    this.name = productData.product_name;
    this.ingredients = productData.ingredients;
    this.image = productData.image_url;
  }

  showInfo() {
    document.getElementById("productImg").src = this.image;
    document.getElementById("productName").innerText = this.name;
  }

  listIngredients() {
    let tableRef = document.getElementById("ingredientTable");
    for (let i = 1; i < tableRef.rows.length; ) {
      //don't increment because it will skip rows
      tableRef.deleteRow(i); //clear table after new entry is submitted
    }
    if (!(this.ingredients == null)) {
      for (let key in this.ingredients) {
        let newRow = tableRef.insertRow(-1); //adds to the end rather than above the th
        let newICell = newRow.insertCell(0); //like arrays, starts at 0
        let newVCell = newRow.insertCell(1);
        let newIText = document.createTextNode(this.ingredients[key].text);
        let vegStatus =
          this.ingredients[key].vegetarian == null
            ? "unknown"
            : this.ingredients[key].vegetarian; //check to see if falsy (NaN, undefined) and then if so, return unknow, else return value
        let newVText = document.createTextNode(vegStatus);
        newICell.appendChild(newIText);
        newVCell.appendChild(newVText);
        if (vegStatus === "no") {
          newVCell.classList.add("non-veg-item");
        } else if (vegStatus === "unknown" || vegStatus === "maybe") {
          newVCell.classList.add("maybe-veg-item");
        }
      }
    }
  }
}
